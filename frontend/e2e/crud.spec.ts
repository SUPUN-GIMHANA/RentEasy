import { expect, test } from "@playwright/test"

test.describe("Auth + CRUD flow", () => {
  test("login, create, update, delete item", async ({ page }) => {
    await page.goto("/login")

    await page.getByLabel("Email").fill("qa-user@test.com")
    await page.getByLabel("Password").fill("password123")
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page).toHaveURL(/browse|admin|orders/)

    await page.goto("/admin/add-item")
    await page.getByLabel("Item Name *").fill("Playwright QA Item")
    await page.getByLabel("Price per day *").fill("2500")
    await page.getByLabel("Location *").fill("Colombo")
    await page.getByLabel("Description *").fill("Created from Playwright E2E")
    await page.getByRole("button", { name: /create item|add item|submit/i }).click()

    await page.goto("/admin/items")
    await expect(page.getByText("Playwright QA Item")).toBeVisible()

    await page.getByRole("button", { name: /edit/i }).first().click()
    await page.getByLabel(/price/i).fill("3000")
    await page.getByRole("button", { name: /save|update/i }).click()

    await expect(page.getByText(/3000|3,000/)).toBeVisible()

    await page.getByRole("button", { name: /delete/i }).first().click()
    await page.getByRole("button", { name: /confirm|delete/i }).last().click()

    await expect(page.getByText("Playwright QA Item")).toHaveCount(0)
  })
})
