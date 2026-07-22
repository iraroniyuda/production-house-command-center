import { describe, expect, it } from "vitest";

import { readAuthenticatedUser } from "./authenticated-user";

describe("readAuthenticatedUser", () => {
  it("extracts supported identity claims", () => {
    expect(
      readAuthenticatedUser({
        sub: "user-123",
        preferred_username: "roni",
        email: "roni@example.test",
      }),
    ).toEqual({
      subject: "user-123",
      username: "roni",
      email: "roni@example.test",
    });
  });

  it("allows optional username and email claims", () => {
    expect(
      readAuthenticatedUser({
        sub: "user-123",
      }),
    ).toEqual({
      subject: "user-123",
      username: null,
      email: null,
    });
  });

  it("rejects claims without a subject", () => {
    expect(
      readAuthenticatedUser({
        preferred_username: "roni",
      }),
    ).toBeNull();
  });

  it("rejects non-object claims", () => {
    expect(readAuthenticatedUser(null)).toBeNull();
    expect(readAuthenticatedUser("invalid")).toBeNull();
  });
});
