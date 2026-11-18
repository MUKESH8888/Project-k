import { DatabaseSync } from "node:sqlite";
import {
  randomUUID,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { seedProducts } from "./catalog.js";
const directory = process.env.COMMERCE_DATA_DIR || join(process.cwd(), ".data");
mkdirSync(directory, { recursive: true });
const sql = new DatabaseSync(join(directory, "commerce.sqlite"));
sql.exec(
  "PRAGMA busy_timeout=10000; PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS records (kind TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY(kind,id)); CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT);",
);
const all = (kind) =>
  sql
    .prepare("SELECT data FROM records WHERE kind=? ORDER BY rowid DESC")
    .all(kind)
    .map((r) => JSON.parse(r.data));
const get = (kind, id) => {
  const r = sql
    .prepare("SELECT data FROM records WHERE kind=? AND id=?")
    .get(kind, String(id));
  return r ? JSON.parse(r.data) : null;
};
const put = (kind, row) => {
  sql
    .prepare(
      "INSERT INTO records VALUES (?,?,?) ON CONFLICT(kind,id) DO UPDATE SET data=excluded.data",
    )
    .run(kind, row.id, JSON.stringify(row));
  return row;
};
const remove = (kind, id) =>
  Boolean(
    sql.prepare("DELETE FROM records WHERE kind=? AND id=?").run(kind, id)
      .changes,
  );
function tx(fn) {
  sql.exec("BEGIN IMMEDIATE");
  try {
    const v = fn();
    sql.exec("COMMIT");
    return v;
  } catch (e) {
    sql.exec("ROLLBACK");
    throw e;
  }
}
const safe = (u) =>
  u
    ? { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role }
    : null;
export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function currentUser(id) {
  const user = get("users", id);
  return user ? { ...safe(user), authVersion: user.authVersion || 0 } : null;
}
function quoteItems(input) {
  if (!Array.isArray(input) || !input.length || input.length > 50)
    throw new Error("Review the items in your bag.");
  const quantities = new Map();
  input.forEach((i) => {
    const id = String(i.productId || i.id);
    if (!Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 20)
      throw new Error("Invalid item quantity.");
    quantities.set(id, (quantities.get(id) || 0) + i.quantity);
  });
  const items = [...quantities].map(([id, quantity]) => {
    const p = get("products", id);
    if (!p || quantity > p.stock || quantity > 20)
      throw new Error(
        "An item is unavailable or exceeds available stock. Please review your bag.",
      );
    return {
      productId: id,
      title: p.title,
      image: p.image,
      price: p.price,
      quantity,
    };
  });
  const subtotal =
    items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0) /
    100;
  const deliveryFee = subtotal >= 5000 ? 0 : 199;
  return { items, subtotal, deliveryFee, totalAmount: subtotal + deliveryFee };
}
function verify(password, hash) {
  const [salt, value] = hash.split(":");
  const bytes = Buffer.from(value, "hex");
  return (
    bytes.length === 64 &&
    timingSafeEqual(bytes, scryptSync(password, salt, 64))
  );
}
function required(v, label, max = 500) {
  if (typeof v !== "string" || !v.trim() || v.length > max)
    throw new Error(`${label} is required (maximum ${max} characters).`);
  return v.trim();
}
function productData(data, old = {}) {
  const p = { ...old, ...data };
  p.title = required(p.title, "Product title", 200);
  p.category = required(p.category, "Collection", 100);
  p.description =
    typeof p.description === "string" ? p.description.slice(0, 3000) : "";
  p.price = Number(p.price);
  p.stock = Number(p.stock);
  if (
    !Number.isFinite(p.price) ||
    p.price <= 0 ||
    p.price > 10000000 ||
    !Number.isInteger(p.stock) ||
    p.stock < 0
  )
    throw new Error("Enter a positive price and whole-number stock.");
  if (!["women", "men", "kids"].includes(p.department))
    throw new Error("Choose a department.");
  if (
    typeof p.image !== "string" ||
    !/^(?:\/images\/[\w./-]+|\/media\/[a-f0-9-]{36}\.webp|https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[a-zA-Z0-9._/-]+)$/.test(
      p.image,
    ) ||
    p.image.includes("..")
  )
    throw new Error("Choose a local catalog image.");
  return {
    ...p,
    price: Math.round(p.price * 100) / 100,
    id: old.id || `prod_${randomUUID()}`,
    updatedAt: new Date().toISOString(),
  };
}
tx(() => {
  if (!sql.prepare("SELECT value FROM metadata WHERE key='catalog-v2'").get()) {
    const names = [
      "Swarna Kanchi Silk Saree",
      "Rani Pink Bridal Silk Saree",
      "Mayilkan Gadwal Saree",
      "Padma Banarasi Silk Saree",
      "Heritage Pattu Dhoti Set",
    ];
    seedProducts.forEach((p, i) =>
      put("products", {
        ...p,
        title: names[i],
        image: i === 4 ? "/images/products/men-pattu-panche.jpg" : p.image,
        href: `/product/${p.id}`,
        description:
          "A considered expression of Indian occasionwear, with rich texture, traditional detailing and a beautiful drape.",
      }),
    );
    [
      {
        id: "prod_6",
        title: "Pochampally Ikat Saree",
        department: "women",
        category: "Pochampally Ikat",
        image: "pochampally-ikat",
        price: 18900,
        colorFamily: "red",
      },
      {
        id: "prod_7",
        title: "Royal Embroidered Sherwani",
        department: "men",
        category: "Wedding Edit",
        image: "men-royal-sherwani",
        price: 28500,
        colorFamily: "cream",
      },
      {
        id: "prod_8",
        title: "Little Celebrations Pattu Pavada",
        department: "kids",
        category: "Festive Kidswear",
        image: "kids-pattu-pavada",
        price: 4900,
        colorFamily: "pink",
      },
      {
        id: "prod_9",
        title: "Festive Boys Kurta Set",
        department: "kids",
        category: "Festive Kidswear",
        image: "kids-boys-kurta",
        price: 3500,
        colorFamily: "gold",
      },
    ].forEach((p) =>
      put("products", {
        ...p,
        image: `/images/products/${p.image}.jpg`,
        stock: 8,
        colors: [],
        href: `/product/${p.id}`,
        description:
          "Thoughtfully selected traditional occasionwear for the celebrations you will always remember.",
      }),
    );
    sql.prepare("INSERT INTO metadata VALUES ('catalog-v2','1')").run();
  }
  if (!sql.prepare("SELECT value FROM metadata WHERE key='catalog-v3'").get()) {
    const product = get("products", "prod_2");
    if (product?.title === "Rani Pink Bridal Silk Saree")
      put("products", {
        ...product,
        title: "Amethyst Bridal Silk Saree",
        colorFamily: "purple",
        telugu: "",
      });
    sql.prepare("INSERT INTO metadata VALUES ('catalog-v3','1')").run();
  }
});
export const Db = {
  async getAccount(id) {
    const user = safe(get("users", id));
    if (!user) return null;
    return { user, addresses: get("accounts", id)?.addresses || [] };
  },
  async updateProfile(id, data) {
    return tx(() => {
      const user = get("users", id);
      if (!user) throw new Error("Account not found.");
      const name = required(data.name, "Name", 100);
      const phone = String(data.phone || "").trim();
      if (phone && !/^\+?[\d\s-]{10,16}$/.test(phone))
        throw new Error("Enter a valid phone number.");
      return safe(put("users", { ...user, name, phone }));
    });
  },
  async saveAddress(userId, data) {
    return tx(() => {
      if (!get("users", userId)) throw new Error("Account not found.");
      const account = get("accounts", userId) || { id: userId, addresses: [] };
      const address = {
        id: randomUUID(),
        label: required(data.label, "Address label", 50),
        name: required(data.name, "Recipient name", 100),
        phone: required(data.phone, "Phone", 25),
        address: required(data.address, "Street address", 500),
        city: required(data.city, "City", 100),
        state: required(data.state, "State", 100),
        pincode: required(data.pincode, "PIN code", 6),
      };
      if (
        !/^[1-9]\d{5}$/.test(address.pincode) ||
        !/^\+?[\d\s-]{10,16}$/.test(address.phone)
      )
        throw new Error("Enter a valid phone and six-digit PIN code.");
      if (account.addresses.length >= 10)
        throw new Error("You can save up to 10 addresses.");
      put("accounts", {
        ...account,
        addresses: [...account.addresses, address],
      });
      return address;
    });
  },
  async removeAddress(userId, id) {
    return tx(() => {
      const account = get("accounts", userId);
      if (!account?.addresses.some((a) => a.id === id)) return false;
      put("accounts", {
        ...account,
        addresses: account.addresses.filter((a) => a.id !== id),
      });
      return true;
    });
  },
  async changePassword(id, currentPassword, newPassword) {
    const user = get("users", id);
    if (
      !user ||
      typeof currentPassword !== "string" ||
      currentPassword.length > 128 ||
      !verify(currentPassword, user.passwordHash)
    )
      throw new Error("Current password is incorrect.");
    if (
      typeof newPassword !== "string" ||
      newPassword.length < 10 ||
      newPassword.length > 128
    )
      throw new Error("Use a password between 10 and 128 characters.");
    if (currentPassword === newPassword)
      throw new Error("Choose a different new password.");
    const hash = hashPassword(newPassword);
    return tx(() => {
      const latest = get("users", id);
      if (latest.passwordHash !== user.passwordHash)
        throw new Error("Account changed. Please sign in again.");
      put("users", {
        ...latest,
        passwordHash: hash,
        authVersion: (latest.authVersion || 0) + 1,
      });
      return true;
    });
  },
  async quoteOrder(items) {
    return quoteItems(items);
  },
  async cancelOwnOrder(userId, id) {
    return tx(() => {
      const order = get("orders", id);
      if (!order || order.userId !== userId) return null;
      if (order.status === "Cancelled") return order;
      if (!["Confirmed", "Processing"].includes(order.status))
        throw new Error(
          "This order has already shipped and cannot be cancelled here.",
        );
      order.items.forEach((i) => {
        const p = get("products", i.productId);
        if (p) put("products", { ...p, stock: p.stock + i.quantity });
      });
      return put("orders", {
        ...order,
        status: "Cancelled",
        updatedAt: new Date().toISOString(),
        history: [
          ...(order.history || []),
          { status: "Cancelled", at: new Date().toISOString(), by: "Customer" },
        ],
      });
    });
  },
  async updateShipment(id, data) {
    return tx(() => {
      const order = get("orders", id);
      if (!order) return null;
      if (order.status === "Cancelled")
        throw new Error("Cancelled orders cannot be shipped.");
      const carrier = required(data.carrier, "Courier name", 100),
        trackingNumber = required(data.trackingNumber, "Tracking number", 100);
      let trackingUrl = String(data.trackingUrl || "").trim();
      if (trackingUrl) {
        let url;
        try {
          url = new URL(trackingUrl);
        } catch {
          throw new Error("Enter a valid HTTPS tracking link.");
        }
        if (url.protocol !== "https:" || url.username || url.password)
          throw new Error("Enter a valid HTTPS tracking link.");
        trackingUrl = url.toString();
      }
      return put("orders", {
        ...order,
        shipment: { carrier, trackingNumber, trackingUrl },
        updatedAt: new Date().toISOString(),
      });
    });
  },
  async findUserByEmail(email) {
    return safe(
      all("users").find((u) => u.email === String(email).toLowerCase()),
    );
  },
  async findUserById(id) {
    return safe(get("users", id));
  },
  async authenticate(email, password) {
    const u = all("users").find(
      (u) => u.email === String(email).trim().toLowerCase(),
    );
    return u &&
      typeof password === "string" &&
      password.length <= 128 &&
      verify(password, u.passwordHash)
      ? safe(u)
      : null;
  },
  async registerUser({ name, email, phone = "", password }) {
    name = required(name, "Name", 100);
    email = required(email, "Email", 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error("Enter a valid email.");
    if (
      typeof password !== "string" ||
      password.length < 10 ||
      password.length > 128
    )
      throw new Error("Use a password between 10 and 128 characters.");
    const passwordHash = hashPassword(password);
    return tx(() => {
      if (all("users").some((u) => u.email === email))
        throw new Error("An account with this email already exists.");
      return safe(
        put("users", {
          id: randomUUID(),
          name,
          email,
          phone,
          passwordHash,
          role: "customer",
        }),
      );
    });
  },
  async promoteUserToAdmin(id) {
    return tx(() => {
      const user = get("users", id);
      if (!user) return false;
      put("users", { ...user, role: "admin" });
      return true;
    });
  },
  async getProducts(q = {}) {
    return all("products")
      .filter(
        (p) =>
          (!q.department ||
            q.department === "all" ||
            p.department === q.department) &&
          (!q.category ||
            q.category === "all" ||
            p.category.toLowerCase().includes(q.category.toLowerCase())) &&
          (!q.search ||
            `${p.title} ${p.category} ${p.department}`
              .toLowerCase()
              .includes(q.search.toLowerCase())),
      )
      .reverse();
  },
  async getProductById(id) {
    return get(
      "products",
      id === "swarna-kanchi-pure-silk-saree" ? "prod_1" : id,
    );
  },
  async createProduct(data) {
    return put("products", productData(data));
  },
  async updateProduct(id, data) {
    return tx(() => {
      const p = get("products", id);
      return p ? put("products", productData(data, p)) : null;
    });
  },
  async deleteProduct(id) {
    return remove("products", id);
  },
  async getOrders() {
    return all("orders");
  },
  async getOrderById(id) {
    return get("orders", id);
  },
  async createOrder(data) {
    const customerName = required(data.customerName, "Full name", 100),
      customerEmail = required(data.customerEmail, "Email", 254).toLowerCase(),
      customerPhone = required(data.customerPhone, "Phone", 25),
      shippingAddress = required(data.shippingAddress, "Address", 800);
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) ||
      !/^\+?[\d\s-]{10,16}$/.test(customerPhone) ||
      !/^\d{6}$/.test(data.pincode || "")
    )
      throw new Error("Enter a valid email, phone and six-digit PIN code.");
    if (data.paymentMethod !== "cod")
      throw new Error("Only cash on delivery is currently available.");
    if (
      !Array.isArray(data.items) ||
      !data.items.length ||
      data.items.length > 50
    )
      throw new Error("Review the items in your bag.");
    const key = required(data.idempotencyKey, "Checkout reference", 100);
    return tx(() => {
      const existing = all("orders").find((o) => o.idempotencyKey === key);
      if (existing) {
        if (
          existing.customerEmail !== customerEmail ||
          existing.userId !== (data.userId || null)
        )
          throw new Error("Checkout reference already used.");
        return existing;
      }
      const { items, subtotal, deliveryFee, totalAmount } = quoteItems(
        data.items,
      );
      if (
        data.expectedTotal !== undefined &&
        (!Number.isFinite(data.expectedTotal) ||
          Math.round(data.expectedTotal * 100) !==
            Math.round(totalAmount * 100))
      )
        throw new Error(
          "Prices have changed. Refresh your order total before placing the order.",
        );
      items.forEach((i) => {
        const p = get("products", i.productId);
        put("products", { ...p, stock: p.stock - i.quantity });
      });
      return put("orders", {
        id: `KLM-${randomBytes(5).toString("hex").toUpperCase()}`,
        idempotencyKey: key,
        userId: data.userId || null,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        pincode: data.pincode,
        items,
        subtotal,
        deliveryFee,
        totalAmount: subtotal + deliveryFee,
        paymentMethod: "Cash on delivery",
        paymentStatus: "Unpaid",
        status: "Confirmed",
        history: [
          { status: "Confirmed", at: new Date().toISOString(), by: "Store" },
        ],
        createdAt: new Date().toISOString(),
        date: new Date().toISOString(),
      });
    });
  },
  async updateOrderStatus(id, status) {
    return tx(() => {
      const o = get("orders", id);
      if (!o) return null;
      const allowed = {
        Confirmed: ["Processing", "Cancelled"],
        Processing: ["Dispatched", "Cancelled"],
        Dispatched: ["Delivered"],
        Delivered: [],
        Cancelled: [],
      };
      if (o.status === status) return o;
      if (!allowed[o.status]?.includes(status))
        throw new Error("Invalid order status transition.");
      if (status === "Cancelled")
        o.items.forEach((i) => {
          const p = get("products", i.productId);
          if (p) put("products", { ...p, stock: p.stock + i.quantity });
        });
      return put("orders", {
        ...o,
        status,
        updatedAt: new Date().toISOString(),
        history: [
          ...(o.history || []),
          { status, at: new Date().toISOString(), by: "Store" },
        ],
        paymentStatus: status === "Delivered" ? "Collected" : o.paymentStatus,
      });
    });
  },
  async getAppointments() {
    return all("appointments");
  },
  async createAppointment(data) {
    const customerName = required(data.customerName || data.name, "Name", 100),
      customerPhone = required(data.customerPhone || data.phone, "Phone", 25);
    if (!/^\+?[\d\s-]{10,16}$/.test(customerPhone))
      throw new Error("Enter a valid phone number.");
    const date = required(data.date, "Date", 10);
    const parsedDate = new Date(date + "T12:00:00Z");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date ||
      date <
        new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
    )
      throw new Error("Choose today or a future date.");
    return put("appointments", {
      id: randomUUID(),
      customerName,
      customerPhone,
      date,
      slot: required(data.slot || data.time, "Time slot", 100),
      weaves: data.weaves || [],
      status: "Requested",
      createdAt: new Date().toISOString(),
    });
  },
  async updateAppointmentStatus(id, status) {
    if (!["Requested", "Booked", "Completed", "Cancelled"].includes(status))
      throw new Error("Invalid appointment status.");
    const a = get("appointments", id);
    return a ? put("appointments", { ...a, status }) : null;
  },
  async getAdminStats() {
    const orders = all("orders");
    return {
      totalRevenue: orders
        .filter((o) => o.status === "Delivered")
        .reduce((n, o) => n + o.totalAmount, 0),
      ordersCount: orders.length,
      appointmentsCount: all("appointments").filter((a) =>
        ["Requested", "Booked"].includes(a.status),
      ).length,
      lowStockCount: all("products").filter((p) => p.stock < 3).length,
      recentOrders: orders.slice(0, 6),
    };
  },
  async createMessage(data) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || ""))
      throw new Error("Enter a valid email address.");
    return put("messages", {
      id: randomUUID(),
      name: required(data.name, "Name", 100),
      email: required(data.email, "Email", 254),
      message: required(data.message, "Message", 3000),
      createdAt: new Date().toISOString(),
    });
  },
  async getMessages() {
    return all("messages");
  },
};
