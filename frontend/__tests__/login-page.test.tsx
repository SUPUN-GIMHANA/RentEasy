import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginPage from "../app/login/page"
import { expect } from "@playwright/test"
import { jest } from "@jest/globals"

const pushMock = jest.fn()
const loginMock = jest.fn()

jest.mock("@/components/header", () => ({
  Header: () => <div data-testid="header" />,
}))

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => ({ get: () => "/browse" }),
}))

jest.mock("@/lib/auth-context", () => ({
  useAuth: () => ({ login: loginMock }),
}))

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("submits login form and redirects on success", async () => {
    loginMock.mockResolvedValue(true)
    const user = userEvent.setup()

    render(<LoginPage />)

    await user.type(screen.getByLabelText(/email/i), "qa@renteasy.com")
    await user.type(screen.getByLabelText(/password/i), "secret123")
    await user.click(screen.getByRole("button", { name: /login/i }))

    expect(loginMock).toHaveBeenCalledWith("qa@renteasy.com", "secret123")
    expect(pushMock).toHaveBeenCalledWith("/browse")
  })

  it("shows error when login fails", async () => {
    loginMock.mockResolvedValue(false)
    const user = userEvent.setup()

    render(<LoginPage />)

    await user.type(screen.getByLabelText(/email/i), "qa@renteasy.com")
    await user.type(screen.getByLabelText(/password/i), "wrong")
    await user.click(screen.getByRole("button", { name: /login/i }))

    expect(screen.getByText(/login failed\. please check your credentials\./i)).toBeInTheDocument()
  })
})
