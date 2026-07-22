"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ApiAuthenticationError,
  fetchPhccApi,
} from "@/lib/auth/authenticated-fetch";
import {
  readAuthenticatedUser,
  type AuthenticatedUser,
} from "@/lib/auth/authenticated-user";
import {
  AuthenticationRequiredError,
  getKeycloakClient,
  getValidAccessToken,
  initializeKeycloak,
} from "@/lib/auth/keycloak-client";

export type AuthenticationStatus =
  | "initializing"
  | "authenticated"
  | "unauthenticated"
  | "error";


type AuthenticationSnapshot = Readonly<{
  status: AuthenticationStatus;
  user: AuthenticatedUser | null;
  errorMessage: string | null;
}>;

type AuthenticationContextValue = AuthenticationSnapshot &
  Readonly<{
    login: () => Promise<void>;
    logout: () => Promise<void>;
    fetchApi: (
      path: string,
      requestInit?: RequestInit,
    ) => Promise<Response>;
  }>;

const AuthenticationContext =
  createContext<AuthenticationContextValue | undefined>(undefined);

function readErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "An unknown authentication error occurred.";
}

export function AuthProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [snapshot, setSnapshot] = useState<AuthenticationSnapshot>({
    status: "initializing",
    user: null,
    errorMessage: null,
  });

  const synchronizeAuthentication = useCallback(() => {
    const client = getKeycloakClient();

    if (client.authenticated && client.token) {
      setSnapshot({
        status: "authenticated",
        user: readAuthenticatedUser(client.tokenParsed),
        errorMessage: null,
      });

      return;
    }

    setSnapshot({
      status: "unauthenticated",
      user: null,
      errorMessage: null,
    });
  }, []);

  useEffect(() => {
    let active = true;
    const client = getKeycloakClient();

    const synchronizeIfActive = () => {
      if (active) {
        synchronizeAuthentication();
      }
    };

    const handleAuthenticationError = (error: unknown) => {
      if (active) {
        setSnapshot({
          status: "error",
          user: null,
          errorMessage: readErrorMessage(error),
        });
      }
    };

    const handleRefreshError = () => {
      handleAuthenticationError(
        new Error("The Keycloak session could not be refreshed."),
      );
    };

    const handleTokenExpired = () => {
      void getValidAccessToken()
        .then(synchronizeIfActive)
        .catch(handleAuthenticationError);
    };

    client.onAuthSuccess = synchronizeIfActive;
    client.onAuthLogout = synchronizeIfActive;
    client.onAuthRefreshSuccess = synchronizeIfActive;
    client.onAuthRefreshError = handleRefreshError;
    client.onTokenExpired = handleTokenExpired;
    client.onAuthError = handleAuthenticationError;

    void initializeKeycloak()
      .then(synchronizeIfActive)
      .catch(handleAuthenticationError);

    return () => {
      active = false;

      if (client.onAuthSuccess === synchronizeIfActive) {
        client.onAuthSuccess = undefined;
      }

      if (client.onAuthLogout === synchronizeIfActive) {
        client.onAuthLogout = undefined;
      }

      if (client.onAuthRefreshSuccess === synchronizeIfActive) {
        client.onAuthRefreshSuccess = undefined;
      }

      if (client.onAuthRefreshError === handleRefreshError) {
        client.onAuthRefreshError = undefined;
      }

      if (client.onTokenExpired === handleTokenExpired) {
        client.onTokenExpired = undefined;
      }

      if (client.onAuthError === handleAuthenticationError) {
        client.onAuthError = undefined;
      }
    };
  }, [synchronizeAuthentication]);

  const login = useCallback(async () => {
    await getKeycloakClient().login({
      redirectUri: window.location.href,
    });
  }, []);

  const logout = useCallback(async () => {
    await getKeycloakClient().logout({
      redirectUri: window.location.origin,
    });
  }, []);

  const fetchApi = useCallback(
    async (
      path: string,
      requestInit?: RequestInit,
    ): Promise<Response> => {
      try {
        return await fetchPhccApi(path, requestInit);
      } catch (error) {
        if (
          error instanceof ApiAuthenticationError ||
          error instanceof AuthenticationRequiredError
        ) {
          synchronizeAuthentication();
        }

        throw error;
      }
    },
    [synchronizeAuthentication],
  );

  const contextValue = useMemo<AuthenticationContextValue>(
    () => ({
      ...snapshot,
      login,
      logout,
      fetchApi,
    }),
    [fetchApi, login, logout, snapshot],
  );

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication(): AuthenticationContextValue {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "useAuthentication must be used within an AuthProvider.",
    );
  }

  return context;
}
