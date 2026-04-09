import { api, ApiError } from "@/lib/api-client"
import { describe } from "node:test";

describe("api.auth.login", () => {
  beforeEach(() => {
    localStorage.clear()
    ;(global as any).fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("stores token and user on successful login", async () => {
    const responsePayload = {
      token: "jwt-token",
      id: "user-1",
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
      role: "USER",
    }

    ;(global as any).fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => responsePayload,
      clone: function () { return this },
      text: async () => "",
    } as unknown as Response)

    const result = await api.auth.login({ email: "user@test.com", password: "pass123" })

    expect(result.token).toBe("jwt-token")
    expect(localStorage.getItem("authToken")).toBe("jwt-token")
    expect(JSON.parse(localStorage.getItem("user") || "{}").id).toBe("user-1")
  })

  it("throws ApiError when backend rejects login", async () => {
    ;(global as any).fetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: { get: () => "application/json" },
      json: async () => ({ message: "Invalid credentials" }),
      text: async () => "",
      clone: function () { return this },
    } as unknown as Response)

    await expect(api.auth.login({ email: "bad@test.com", password: "bad" }))
      .rejects
      .toBeInstanceOf(ApiError)
  })
})
