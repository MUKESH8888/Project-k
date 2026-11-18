import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
test("desktop storefront, product identity, wishlist, persisted bag and real checkout", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Celebrate in/ }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const images = [...document.images];
    images.forEach((i) => (i.loading = "eager"));
    await Promise.all(images.map((i) => i.decode()));
  });
  mkdirSync("work/screens", { recursive: true });
  await page.screenshot({
    path: "work/screens/home-desktop.png",
    fullPage: true,
  });
  await page.goto("/sarees?department=men");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.locator(".product-card").first().getByRole("button", {name: /^Save /}).click();
  await page.goto("/wishlist");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.goto("/product/prod_3");
  await expect(
    page.getByRole("heading", { name: "Mayilkan Gadwal Saree", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Mayilkan Gadwal Saree" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Mayilkan Gadwal Saree" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Continue to checkout" }).click();
  for (const [label, value] of [
    ["Full name", "Test Shopper"],
    ["Email address", "buyer@example.test"],
    ["Phone number", "9876543210"],
    ["PIN code", "500001"],
    ["City", "Hyderabad"],
    ["State", "Telangana"],
    ["Street address", "123 Test Street"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page
    .getByRole("button", { name: "Place order · Pay on delivery" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your order is confirmed." }),
  ).toBeVisible();
  await expect(page.getByText("₹24,900 · Pay on delivery")).toBeVisible();
  expect(errors).toEqual([]);
});
test("mobile navigation, search, empty states and dialog keyboard access", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const images = [...document.images];
    images.forEach((i) => (i.loading = "eager"));
    await Promise.all(images.map((i) => i.decode()));
  });
  await page.screenshot({
    path: "work/screens/home-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Men", exact: true })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByLabel("Search", { exact: true }).fill("no-such-weave");
  await expect(
    page.getByRole("heading", { name: "No pieces found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".product-card")).toHaveCount(9);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/product/missing");
  await expect(
    page.getByRole("heading", { name: "Let’s find your way back." }),
  ).toBeVisible();
});
test("admin APIs deny forged sessions and allow authenticated inventory management", async ({
  request,
  page,
}) => {
  expect((await request.get("/api/admin/stats")).status()).toBe(401);
  expect(
    (
      await request.get("/api/orders", {
        headers: {
          Cookie:
            "kalyanam_session=" +
            encodeURIComponent(
              JSON.stringify({ id: "admin_1", role: "admin" }),
            ),
        },
      })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.post("/api/products", {
        data: { title: "Unauthorized", price: 1 },
      })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.post("/api/auth/login", {
        headers: { Origin: "https://attacker.example" },
        data: {
          email: "admin@example.test",
          password: "E2e-only-password-123",
        },
      })
    ).status(),
  ).toBe(403);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page
    .getByLabel("Password", { exact: true })
    .fill("E2e-only-password-123");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Sign in", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your store, at a glance." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(9);
  await page.getByRole("button", { name: "Add product", exact: true }).click();
  await page.getByLabel("Product name").fill("Browser test saree");
  await page.getByLabel("Price (₹)").fill("1500");
  await page.getByLabel("Available stock").fill("3");
  await page
    .getByLabel("Or upload a new photograph")
    .setInputFiles("public/images/products/pochampally-ikat.jpg");
  await page.getByRole("button", { name: "Save product" }).click();
  await expect(
    page.getByRole("cell", { name: "Browser test saree", exact: true }),
  ).toBeVisible();
  const uploaded = page
    .locator("tr")
    .filter({
      has: page.getByRole("cell", { name: "Browser test saree", exact: true }),
    })
    .locator("img");
  await expect(uploaded).toBeVisible();
  await uploaded.evaluate((image) => image.decode());
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: /Celebrate in/ }),
  ).toBeVisible();
});
test("registration creates a customer session and contact enquiry persists", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page
    .getByRole("button", { name: "New here? Create an account" })
    .click();
  await page.getByLabel("Full name").fill("New Customer");
  await page.getByLabel("Email", { exact: true }).fill("new@example.test");
  await page.getByLabel("Password").fill("Customer-password-123");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/account");
  await expect(
    page.getByRole("heading", { name: "Hello, New Customer." }),
  ).toBeVisible();
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("New Customer");
  await page.getByLabel("Email address").fill("new@example.test");
  await page
    .getByLabel("How can we help?")
    .fill("Please help me choose a wedding saree.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("heading", { name: "Thank you for reaching out." }),
  ).toBeVisible();
});
