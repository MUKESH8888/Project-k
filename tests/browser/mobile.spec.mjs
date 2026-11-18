import { test, expect } from "@playwright/test";
test("all mobile breakpoints fit the viewport, including a populated checkout and admin", async ({
  page,
}) => {
  await page.goto("/product/prod_1");
  await page.getByRole("button", { name: "Add to bag" }).click();
  for (const width of [320, 360, 390, 768]) {
    await page.setViewportSize({ width, height: 850 });
    for (const path of [
      "/",
      "/sarees",
      "/product/prod_1",
      "/cart",
      "/checkout",
      "/contact",
      "/stores",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/checkout");
  await expect(
    page.getByRole("button", { name: "Place order · Pay on delivery" }),
  ).toBeEnabled();
  await page.screenshot({
    path: "work/screens/checkout-mobile.png",
    fullPage: true,
  });
  const login = await page.request.post("/api/auth/login", {
    data: { email: "admin@example.test", password: "E2e-only-password-123" },
  });
  expect(login.ok()).toBe(true);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Orders", exact: true }).click();
  for (const width of [320, 360, 390, 768]) {
    await page.setViewportSize({ width, height: 850 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Admin at ${width}px`,
    ).toBe(true);
  }
});
test("mobile account addresses, saved-address checkout, cancellation and password change work end-to-end", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const registration = await page.request.post("/api/auth/register", {
    data: {
      name: "Mobile Customer",
      email: "mobile@example.test",
      password: "Mobile-password-123",
    },
  });
  expect(registration.ok()).toBe(true);
  await page.goto("/account");
  await page.getByRole("button", { name: "Addresses", exact: true }).click();
  for (const [label, value] of [
    ["Label (e.g. Home)", "Home"],
    ["Recipient name", "Mobile Customer"],
    ["Phone number", "9876543210"],
    ["PIN code", "500001"],
    ["City", "Hyderabad"],
    ["State", "Telangana"],
    ["Street address", "123 Mobile Test Street"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole("button", { name: "Save address" }).click();
  await expect(page.getByRole("status")).toHaveText("Address saved.");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/product/prod_6");
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.goto("/checkout");
  await page
    .getByLabel("Use a saved address")
    .selectOption({ label: "Home — Hyderabad, 500001" });
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue(
    "Mobile Customer",
  );
  await page
    .getByRole("button", { name: "Place order · Pay on delivery" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your order is confirmed." }),
  ).toBeVisible();
  await page.goto("/account");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Cancel order" }).click();
  await expect(page.locator(".status-pill")).toHaveText("Cancelled");
  await page.getByRole("button", { name: "Profile", exact: true }).click();
  await page.getByLabel("Full name").fill("Mobile Shopper");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(
    page.getByRole("heading", { name: "Hello, Mobile Shopper." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Security", exact: true }).click();
  await page
    .getByLabel("Current password", { exact: true })
    .fill("Mobile-password-123");
  await page
    .getByLabel("New password", { exact: true })
    .fill("Changed-password-123");
  await page
    .getByRole("button", { name: "Change password", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
  expect((await page.request.get("/api/account")).status()).toBe(401);
  expect(
    (
      await page.request.post("/api/auth/login", {
        data: {
          email: "mobile@example.test",
          password: "Changed-password-123",
        },
      })
    ).status(),
  ).toBe(200);
});
