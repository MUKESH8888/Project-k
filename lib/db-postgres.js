import {
  randomUUID,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import {
  inTransaction,
  lockKey,
  query,
  ready,
  transaction,
} from "./postgres.js";
import { seedProducts } from "./catalog.js";

await ready;

const all = async (kind) =>
  (await query("SELECT data FROM records WHERE kind=$1 ORDER BY created_at DESC", [
    kind,
  ])).rows.map((row) => row.data);

const get = async (kind, id) => {
  const result = await query(
    `SELECT data FROM records WHERE kind=$1 AND id=$2${inTransaction() ? " FOR UPDATE" : ""}`,
    [kind, String(id)],
  );
  return result.rows[0]?.data || null;
};

const put = async (kind, row) => {
  const result = await query(
    `INSERT INTO records (kind,id,data) VALUES ($1,$2,$3::jsonb)
     ON CONFLICT (kind,id) DO UPDATE SET data=EXCLUDED.data
     RETURNING data`,
    [kind, row.id, JSON.stringify(row)],
  );
  return result.rows[0].data;
};

const remove = async (kind, id) =>
  (await query("DELETE FROM records WHERE kind=$1 AND id=$2", [kind, id]))
    .rowCount > 0;

const tx = transaction;
const safe = (u) =>
  u
    ? { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role }
    : null;

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export async function currentUser(id) {
  const user = await get("users", id);
  return user ? { ...safe(user), authVersion: user.authVersion || 0 } : null;
}

function quoteItems(input, products) {
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
    const p = products.get(id);
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

async function quote(input) {
  if (!Array.isArray(input) || !input.length || input.length > 50)
    throw new Error("Review the items in your bag.");
  const quantities = new Map();
  input.forEach((item) => {
    const id = String(item.productId || item.id);
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    )
      throw new Error("Invalid item quantity.");
    quantities.set(id, (quantities.get(id) || 0) + item.quantity);
  });
  const products = new Map();
  for (const id of quantities.keys()) products.set(id, await get("products", id));
  return quoteItems(input, products);
}

function verify(password, hash) {
  const [salt, value] = hash.split(":");
  const bytes = Buffer.from(value, "hex");
  return (
    bytes.length === 64 &&
    timingSafeEqual(bytes, scryptSync(password, salt, 64))
  );
}

function required(value, label, max = 500) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new Error(`${label} is required (maximum ${max} characters).`);
  return value.trim();
}

function productData(data, old = {}) {
  const product = { ...old, ...data };
  product.title = required(product.title, "Product title", 200);
  product.category = required(product.category, "Collection", 100);
  product.description =
    typeof product.description === "string"
      ? product.description.slice(0, 3000)
      : "";
  product.price = Number(product.price);
  product.stock = Number(product.stock);
  if (
    !Number.isFinite(product.price) ||
    product.price <= 0 ||
    product.price > 10000000 ||
    !Number.isInteger(product.stock) ||
    product.stock < 0
  )
    throw new Error("Enter a positive price and whole-number stock.");
  if (!["women", "men", "kids"].includes(product.department))
    throw new Error("Choose a department.");
  if (
    typeof product.image !== "string" ||
    !/^(?:\/images\/[\w./-]+|\/media\/[a-f0-9-]{36}\.webp|https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[a-zA-Z0-9._/-]+)$/.test(
      product.image,
    ) ||
    product.image.includes("..")
  )
    throw new Error("Choose a local catalog image.");
  return {
    ...product,
    price: Math.round(product.price * 100) / 100,
    id: old.id || `prod_${randomUUID()}`,
    updatedAt: new Date().toISOString(),
  };
}

await tx(async () => {
  const catalog = await query(
    "SELECT 1 FROM metadata WHERE key='catalog-v2'",
  );
  if (!catalog.rowCount) {
    const names = [
      "Swarna Kanchi Silk Saree",
      "Rani Pink Bridal Silk Saree",
      "Mayilkan Gadwal Saree",
      "Padma Banarasi Silk Saree",
      "Heritage Pattu Dhoti Set",
    ];
    for (const [index, product] of seedProducts.entries()) {
      await put("products", {
        ...product,
        title: names[index],
        image:
          index === 4 ? "/images/products/men-pattu-panche.jpg" : product.image,
        href: `/product/${product.id}`,
        description:
          "A considered expression of Indian occasionwear, with rich texture, traditional detailing and a beautiful drape.",
      });
    }
    for (const product of [
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
    ]) {
      await put("products", {
        ...product,
        image: `/images/products/${product.image}.jpg`,
        stock: 8,
        colors: [],
        href: `/product/${product.id}`,
        description:
          "Thoughtfully selected traditional occasionwear for the celebrations you will always remember.",
      });
    }
    await query("INSERT INTO metadata VALUES ('catalog-v2','1')");
  }

  const version = await query(
    "SELECT 1 FROM metadata WHERE key='catalog-v3'",
  );
  if (!version.rowCount) {
    const product = await get("products", "prod_2");
    if (product?.title === "Rani Pink Bridal Silk Saree")
      await put("products", {
        ...product,
        title: "Amethyst Bridal Silk Saree",
        colorFamily: "purple",
        telugu: "",
      });
    await query("INSERT INTO metadata VALUES ('catalog-v3','1')");
  }
});

export const Db = {
  async getAccount(id) {
    const user = safe(await get("users", id));
    if (!user) return null;
    return {
      user,
      addresses: (await get("accounts", id))?.addresses || [],
    };
  },
  async updateProfile(id, data) {
    return tx(async () => {
      const user = await get("users", id);
      if (!user) throw new Error("Account not found.");
      const name = required(data.name, "Name", 100);
      const phone = String(data.phone || "").trim();
      if (phone && !/^\+?[\d\s-]{10,16}$/.test(phone))
        throw new Error("Enter a valid phone number.");
      return safe(await put("users", { ...user, name, phone }));
    });
  },
  async saveAddress(userId, data) {
    return tx(async () => {
      if (!(await get("users", userId))) throw new Error("Account not found.");
      const account = (await get("accounts", userId)) || {
        id: userId,
        addresses: [],
      };
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
      await put("accounts", {
        ...account,
        addresses: [...account.addresses, address],
      });
      return address;
    });
  },
  async removeAddress(userId, id) {
    return tx(async () => {
      const account = await get("accounts", userId);
      if (!account?.addresses.some((address) => address.id === id))
        return false;
      await put("accounts", {
        ...account,
        addresses: account.addresses.filter((address) => address.id !== id),
      });
      return true;
    });
  },
  async changePassword(id, currentPassword, newPassword) {
    return tx(async () => {
      const user = await get("users", id);
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
      await put("users", {
        ...user,
        passwordHash: hashPassword(newPassword),
        authVersion: (user.authVersion || 0) + 1,
      });
      return true;
    });
  },
  async quoteOrder(items) {
    return quote(items);
  },
  async cancelOwnOrder(userId, id) {
    return tx(async () => {
      const order = await get("orders", id);
      if (!order || order.userId !== userId) return null;
      if (order.status === "Cancelled") return order;
      if (!["Confirmed", "Processing"].includes(order.status))
        throw new Error(
          "This order has already shipped and cannot be cancelled here.",
        );
      for (const item of order.items) {
        const product = await get("products", item.productId);
        if (product)
          await put("products", {
            ...product,
            stock: product.stock + item.quantity,
          });
      }
      const at = new Date().toISOString();
      return put("orders", {
        ...order,
        status: "Cancelled",
        updatedAt: at,
        history: [
          ...(order.history || []),
          { status: "Cancelled", at, by: "Customer" },
        ],
      });
    });
  },
  async updateShipment(id, data) {
    return tx(async () => {
      const order = await get("orders", id);
      if (!order) return null;
      if (order.status === "Cancelled")
        throw new Error("Cancelled orders cannot be shipped.");
      const carrier = required(data.carrier, "Courier name", 100);
      const trackingNumber = required(data.trackingNumber, "Tracking number", 100);
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
    const result = await query(
      "SELECT data FROM records WHERE kind='users' AND lower(data->>'email')=$1",
      [String(email).trim().toLowerCase()],
    );
    return safe(result.rows[0]?.data);
  },
  async findUserById(id) {
    return safe(await get("users", id));
  },
  async authenticate(email, password) {
    const user = await this.findUserByEmail(email);
    if (!user || typeof password !== "string" || password.length > 128)
      return null;
    const record = await get("users", user.id);
    return record && verify(password, record.passwordHash) ? safe(record) : null;
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
    return tx(async () => {
      if (await this.findUserByEmail(email))
        throw new Error("An account with this email already exists.");
      return safe(
        await put("users", {
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
    return tx(async () => {
      const user = await get("users", id);
      if (!user) return false;
      await put("users", { ...user, role: "admin" });
      return true;
    });
  },
  async promoteUserToAdmin(id) {
    return tx(async () => {
      const user = await get("users", id);
      if (!user) return false;
      await put("users", { ...user, role: "admin" });
      return true;
    });
  },
  async getProducts(filters = {}) {
    return (await all("products"))
      .filter(
        (product) =>
          (!filters.department ||
            filters.department === "all" ||
            product.department === filters.department) &&
          (!filters.category ||
            filters.category === "all" ||
            product.category
              .toLowerCase()
              .includes(filters.category.toLowerCase())) &&
          (!filters.search ||
            `${product.title} ${product.category} ${product.department}`
              .toLowerCase()
              .includes(filters.search.toLowerCase())),
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
    return tx(async () => {
      const product = await get("products", id);
      return product ? put("products", productData(data, product)) : null;
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
    const customerName = required(data.customerName, "Full name", 100);
    const customerEmail = required(
      data.customerEmail,
      "Email",
      254,
    ).toLowerCase();
    const customerPhone = required(data.customerPhone, "Phone", 25);
    const shippingAddress = required(data.shippingAddress, "Address", 800);
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) ||
      !/^\+?[\d\s-]{10,16}$/.test(customerPhone) ||
      !/^\d{6}$/.test(data.pincode || "")
    )
      throw new Error("Enter a valid email, phone and six-digit PIN code.");
    if (data.paymentMethod !== "cod")
      throw new Error("Only cash on delivery is currently available.");
    if (!Array.isArray(data.items) || !data.items.length || data.items.length > 50)
      throw new Error("Review the items in your bag.");
    const key = required(data.idempotencyKey, "Checkout reference", 100);
    return tx(async () => {
      await lockKey(`checkout:${key}`);
      const existing = (await all("orders")).find(
        (order) => order.idempotencyKey === key,
      );
      if (existing) {
        if (
          existing.customerEmail !== customerEmail ||
          existing.userId !== (data.userId || null)
        )
          throw new Error("Checkout reference already used.");
        return existing;
      }
      const { items, subtotal, deliveryFee, totalAmount } = await quote(data.items);
      if (
        data.expectedTotal !== undefined &&
        (!Number.isFinite(data.expectedTotal) ||
          Math.round(data.expectedTotal * 100) !==
            Math.round(totalAmount * 100))
      )
        throw new Error(
          "Prices have changed. Refresh your order total before placing the order.",
        );
      for (const item of items) {
        const product = await get("products", item.productId);
        await put("products", {
          ...product,
          stock: product.stock - item.quantity,
        });
      }
      const now = new Date().toISOString();
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
        history: [{ status: "Confirmed", at: now, by: "Store" }],
        createdAt: now,
        date: now,
      });
    });
  },
  async updateOrderStatus(id, status) {
    return tx(async () => {
      const order = await get("orders", id);
      if (!order) return null;
      const allowed = {
        Confirmed: ["Processing", "Cancelled"],
        Processing: ["Dispatched", "Cancelled"],
        Dispatched: ["Delivered"],
        Delivered: [],
        Cancelled: [],
      };
      if (order.status === status) return order;
      if (!allowed[order.status]?.includes(status))
        throw new Error("Invalid order status transition.");
      if (status === "Cancelled") {
        for (const item of order.items) {
          const product = await get("products", item.productId);
          if (product)
            await put("products", {
              ...product,
              stock: product.stock + item.quantity,
            });
        }
      }
      return put("orders", {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
        history: [
          ...(order.history || []),
          { status, at: new Date().toISOString(), by: "Store" },
        ],
        paymentStatus: status === "Delivered" ? "Collected" : order.paymentStatus,
      });
    });
  },
  async getAppointments() {
    return all("appointments");
  },
  async createAppointment(data) {
    const customerName = required(
      data.customerName || data.name,
      "Name",
      100,
    );
    const customerPhone = required(
      data.customerPhone || data.phone,
      "Phone",
      25,
    );
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
    const appointment = await get("appointments", id);
    return appointment
      ? put("appointments", { ...appointment, status })
      : null;
  },
  async getAdminStats() {
    const orders = await all("orders");
    return {
      totalRevenue: orders
        .filter((order) => order.status === "Delivered")
        .reduce((sum, order) => sum + order.totalAmount, 0),
      ordersCount: orders.length,
      appointmentsCount: (await all("appointments")).filter((appointment) =>
        ["Requested", "Booked"].includes(appointment.status),
      ).length,
      lowStockCount: (await all("products")).filter(
        (product) => product.stock < 3,
      ).length,
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

export async function deleteExpiredSessions(now) {
  await query("DELETE FROM sessions WHERE expires < $1", [now]);
}
