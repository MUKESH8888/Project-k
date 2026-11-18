import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
mkdirSync("work", { recursive: true });
process.env.COMMERCE_DATA_DIR = mkdtempSync(
  join(process.cwd(), "work", "unit-"),
);
process.env.SESSION_DATA_DIR = process.env.COMMERCE_DATA_DIR;
const { Db } = await import("../lib/db.js");
const { createSession, sessionUser, deleteSession, requireAdmin } =
  await import("../lib/session.js");
const checkout = (items, overrides = {}) => ({
  customerName: "Test Customer",
  customerEmail: "test@example.com",
  customerPhone: "9876543210",
  shippingAddress: "Test address, Hyderabad, Telangana",
  pincode: "500001",
  paymentMethod: "cod",
  idempotencyKey: crypto.randomUUID(),
  items,
  ...overrides,
});
let user;
test("registration hashes passwords and rejects duplicate emails and weak passwords", async () => {
  await assert.rejects(
    Db.registerUser({
      name: "Test",
      email: "invalid",
      password: "longpassword",
    }),
  );
  await assert.rejects(
    Db.registerUser({
      name: "Test",
      email: "test@example.com",
      password: "short",
    }),
  );
  user = await Db.registerUser({
    name: "Test",
    email: "test@example.com",
    password: "Test-password-123",
  });
  assert.equal(user.role, "customer");
  assert.equal(user.password, undefined);
  assert.equal(user.passwordHash, undefined);
  await assert.rejects(
    Db.registerUser({
      name: "Other",
      email: "TEST@example.com",
      password: "Test-password-123",
    }),
  );
  assert.equal(await Db.authenticate(user.email, "wrong"), null);
  assert.equal(
    (await Db.authenticate(user.email, "Test-password-123")).id,
    user.id,
  );
  assert.equal(
    await Db.authenticate("admin@kalyanammall.com", "admin123"),
    null,
  );
});
test("a newly created account can be promoted for administrator setup", async () => {
  const admin = await Db.registerUser({
    name: "Test Admin",
    email: "setup-admin@example.com",
    password: "Test-admin-password-123",
  });
  assert.equal(await Db.promoteUserToAdmin(admin.id), true);
  assert.equal((await Db.findUserById(admin.id)).role, "admin");
  assert.equal(await Db.promoteUserToAdmin("missing-user"), false);
});
test("opaque sessions reject forged roles and are revoked on logout", async () => {
  const request = (token) => ({
    cookies: { get: () => ({ value: token }) },
    headers: new Headers(),
    method: "GET",
    url: "http://localhost/api/admin/stats",
  });
  assert.equal(
    await sessionUser(request(JSON.stringify({ id: "admin_1", role: "admin" }))),
    null,
  );
  const token = await createSession(user);
  assert.equal((await sessionUser(request(token))).id, user.id);
  assert.equal((await requireAdmin(request(token))).status, 403);
  await deleteSession(request(token));
  assert.equal(await sessionUser(request(token)), null);
});
test("catalog filters and missing products behave correctly", async () => {
  const men = await Db.getProducts({ department: "men" });
  assert.ok(men.length >= 2);
  assert.ok(men.every((p) => p.department === "men"));
  assert.equal((await Db.getProducts({ search: "Gadwal" })).length, 1);
  assert.equal(await Db.getProductById("does-not-exist"), null);
});
test("checkout ignores forged prices and totals, decrements stock once, and replays safely", async () => {
  const p = await Db.getProductById("prod_1");
  const data = checkout([{ productId: p.id, quantity: 1, price: 1 }], {
    totalAmount: 1,
    userId: user.id,
  });
  const order = await Db.createOrder(data);
  assert.equal(order.totalAmount, p.price);
  assert.equal(order.paymentStatus, "Unpaid");
  assert.equal((await Db.getProductById(p.id)).stock, p.stock - 1);
  assert.equal((await Db.createOrder(data)).id, order.id);
  assert.equal((await Db.getProductById(p.id)).stock, p.stock - 1);
  await assert.rejects(Db.createOrder({ ...data, userId: "another-user" }));
  assert.equal((await Db.getAdminStats()).totalRevenue, 0);
});
test("invalid quantities and multi-item stock failures roll back the entire order", async () => {
  const p = await Db.getProductById("prod_3");
  for (const quantity of [0, -1, 1.5, 100])
    await assert.rejects(
      Db.createOrder(checkout([{ productId: p.id, quantity }])),
    );
  await assert.rejects(
    Db.createOrder(
      checkout([
        { productId: p.id, quantity: 1 },
        { productId: "missing", quantity: 1 },
      ]),
    ),
  );
  assert.equal((await Db.getProductById(p.id)).stock, p.stock);
  await assert.rejects(
    Db.createOrder(
      checkout([
        { productId: p.id, quantity: p.stock },
        { productId: p.id, quantity: 1 },
      ]),
    ),
  );
});
test("inventory cannot oversell under competing checkouts", async () => {
  const p = await Db.createProduct({
    title: "Stock test",
    department: "women",
    category: "Test",
    image: "/images/products/gadwal-pattu.jpg",
    price: 1000,
    stock: 1,
  });
  const results = await Promise.allSettled([
    Db.createOrder(checkout([{ productId: p.id, quantity: 1 }])),
    Db.createOrder(checkout([{ productId: p.id, quantity: 1 }])),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal((await Db.getProductById(p.id)).stock, 0);
  const order = results.find((r) => r.status === "fulfilled").value;
  assert.equal(order.totalAmount, 1199);
  await Db.updateOrderStatus(order.id, "Cancelled");
  assert.equal((await Db.getProductById(p.id)).stock, 1);
  await Db.updateOrderStatus(order.id, "Cancelled");
  assert.equal((await Db.getProductById(p.id)).stock, 1);
  await assert.rejects(Db.updateOrderStatus(order.id, "Dispatched"));
});
test("payment, contact and appointment inputs are validated", async () => {
  await assert.rejects(
    Db.createOrder(
      checkout([{ productId: "prod_1", quantity: 1 }], {
        paymentMethod: "upi",
      }),
    ),
  );
  await assert.rejects(
    Db.createMessage({ name: "Test", email: "bad", message: "Hello" }),
  );
  await assert.rejects(
    Db.createAppointment({
      name: "Test",
      phone: "9876543210",
      date: "2020-01-01",
      slot: "11 AM",
    }),
  );
});
test("orders survive a fresh Node process", () => {
  const child = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      "import {Db} from './lib/db.js';console.log(JSON.stringify({orders:(await Db.getOrders()).length}));",
    ],
    { cwd: process.cwd(), env: process.env, encoding: "utf8" },
  );
  assert.equal(child.status, 0, child.stderr);
  assert.ok(JSON.parse(child.stdout.trim()).orders >= 2);
});
test("saved addresses are validated and isolated by account", async () => {
  const other = await Db.registerUser({
    name: "Other",
    email: "other@example.test",
    password: "Other-password-123",
  });
  const address = await Db.saveAddress(user.id, {
    label: "Home",
    name: "Test",
    phone: "9876543210",
    address: "123 Test Street",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
  });
  assert.equal((await Db.getAccount(user.id)).addresses.length, 1);
  assert.equal((await Db.getAccount(other.id)).addresses.length, 0);
  assert.equal(await Db.removeAddress(other.id, address.id), false);
  await assert.rejects(
    Db.saveAddress(user.id, {
      label: "Bad",
      name: "Test",
      phone: "bad",
      address: "123 Test Street",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "000000",
    }),
  );
  assert.equal(await Db.removeAddress(user.id, address.id), true);
});
test("profile edits cannot change email or promote a user", async () => {
  const updated = await Db.updateProfile(user.id, {
    name: "Updated Name",
    phone: "9876543210",
    role: "admin",
    email: "attacker@example.test",
  });
  assert.equal(updated.role, "customer");
  assert.equal(updated.email, user.email);
  assert.equal(updated.name, "Updated Name");
});
test("live quote and changed-price rejection preserve stock", async () => {
  const product = await Db.getProductById("prod_3");
  const quote = await Db.quoteOrder([{ productId: product.id, quantity: 1 }]);
  assert.equal(quote.totalAmount, product.price);
  await assert.rejects(
    Db.createOrder(
      checkout([{ productId: product.id, quantity: 1 }], { expectedTotal: 1 }),
    ),
  );
  assert.equal((await Db.getProductById(product.id)).stock, product.stock);
});
test("customer cancellation enforces ownership, restocks once and blocks dispatched orders", async () => {
  const product = await Db.getProductById("prod_3");
  const order = await Db.createOrder(
    checkout([{ productId: product.id, quantity: 1 }], { userId: user.id }),
  );
  assert.equal(await Db.cancelOwnOrder("another-user", order.id), null);
  await Db.cancelOwnOrder(user.id, order.id);
  await Db.cancelOwnOrder(user.id, order.id);
  assert.equal((await Db.getProductById(product.id)).stock, product.stock);
  const shipped = await Db.createOrder(
    checkout([{ productId: product.id, quantity: 1 }], { userId: user.id }),
  );
  await Db.updateOrderStatus(shipped.id, "Processing");
  await Db.updateOrderStatus(shipped.id, "Dispatched");
  await assert.rejects(Db.cancelOwnOrder(user.id, shipped.id));
  await assert.rejects(
    Db.updateShipment(shipped.id, {
      carrier: "Test courier",
      trackingNumber: "ABC123",
      trackingUrl: "javascript:alert(1)",
    }),
  );
  const tracked = await Db.updateShipment(shipped.id, {
    carrier: "Test courier",
    trackingNumber: "ABC123",
    trackingUrl: "https://example.com/track/ABC123",
  });
  assert.equal(tracked.shipment.trackingNumber, "ABC123");
  assert.equal(tracked.history.length, 3);
});
test("password change rejects wrong credentials and invalidates every existing session", async () => {
  const first = await createSession(user),
    second = await createSession(user);
  const request = (token) => ({ cookies: { get: () => ({ value: token }) } });
  await assert.rejects(
    Db.changePassword(user.id, "wrong", "Replacement-password-123"),
  );
  assert.ok(await sessionUser(request(first)));
  await Db.changePassword(
    user.id,
    "Test-password-123",
    "Replacement-password-123",
  );
  assert.equal(await sessionUser(request(first)), null);
  assert.equal(await sessionUser(request(second)), null);
  assert.equal(await Db.authenticate(user.email, "Test-password-123"), null);
  assert.ok(await Db.authenticate(user.email, "Replacement-password-123"));
});
