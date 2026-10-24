const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== KALYANAM SHOPPING MALL API SUITE VALIDATION ===\n');
  let testsPassed = 0;
  let testsFailed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`TEST: ${name}... `);
      await fn();
      console.log('✅ PASSED');
      testsPassed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      testsFailed++;
    }
  }

  let customerCookie = '';
  let adminCookie = '';

  // 1. Auth: Unauthenticated /api/auth/me
  await test('GET /api/auth/me (Unauthenticated)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`);
    const data = await res.json();
    if (res.status !== 200 || data.user !== null) {
      throw new Error(`Expected null user, got: ${JSON.stringify(data)}`);
    }
  });

  // 2. Auth: Customer Login
  await test('POST /api/auth/login (Customer)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sunitha@kalyanammall.com', password: 'sunitha123' }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success || (data.user.role !== 'customer' && data.user.role !== 'user')) {
      throw new Error(`Login failed: ${JSON.stringify(data)}`);
    }
    const rawCookie = res.headers.get('set-cookie');
    if (rawCookie) {
      customerCookie = rawCookie.split(';')[0];
    }
  });

  // 3. Auth: Authenticated /api/auth/me with Customer Cookie
  await test('GET /api/auth/me (Customer Session)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: customerCookie },
    });
    const data = await res.json();
    if (res.status !== 200 || !data.user || data.user.email !== 'sunitha@kalyanammall.com') {
      throw new Error(`Session verify failed: ${JSON.stringify(data)}`);
    }
  });

  // 4. Auth: Customer Logout
  await test('POST /api/auth/logout', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: customerCookie },
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Logout failed: ${JSON.stringify(data)}`);
    }
  });

  // 5. Auth: Admin Login
  await test('POST /api/auth/login (Admin)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@kalyanammall.com', password: 'admin123' }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success || data.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${JSON.stringify(data)}`);
    }
    const rawCookie = res.headers.get('set-cookie');
    if (rawCookie) {
      adminCookie = rawCookie.split(';')[0];
    }
  });

  // 6. Admin: Stats Endpoint
  await test('GET /api/admin/stats', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Cookie: adminCookie },
    });
    const data = await res.json();
    if (res.status !== 200 || !data.stats || typeof data.stats.totalRevenue !== 'number') {
      throw new Error(`Admin stats failed: ${JSON.stringify(data)}`);
    }
  });

  // 7. Products: GET List
  let createdProductId = null;
  await test('GET /api/products', async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    if (res.status !== 200 || !data.products || !Array.isArray(data.products) || data.products.length === 0) {
      throw new Error(`Products fetch failed: ${JSON.stringify(data)}`);
    }
  });

  // 8. Products: POST New Product
  await test('POST /api/products (Admin Create)', async () => {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        title: 'Venkatagiri Zari Handloom Saree',
        telugu: 'వెంకటగిరి జరీ పట్టు చీర',
        price: 18500,
        originalPrice: 22000,
        category: 'venkatagiri',
        shade: 'Rani Pink & Old Gold',
        badge: 'HANDLOOM',
        stock: 5,
        rating: 4.8,
        reviewsCount: 19,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      }),
    });
    const data = await res.json();
    if (res.status !== 201 || !data.product || !data.product.id) {
      throw new Error(`Product creation failed: ${JSON.stringify(data)}`);
    }
    createdProductId = data.product.id;
  });

  // 9. Products: GET Single Product
  await test(`GET /api/products/${createdProductId}`, async () => {
    const res = await fetch(`${BASE_URL}/api/products/${createdProductId}`);
    const data = await res.json();
    if (res.status !== 200 || !data.product || data.product.id !== createdProductId) {
      throw new Error(`Single product fetch failed: ${JSON.stringify(data)}`);
    }
  });

  // 10. Products: PUT Update Product
  await test(`PUT /api/products/${createdProductId}`, async () => {
    const res = await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({ price: 19999, stock: 8 }),
    });
    const data = await res.json();
    if (res.status !== 200 || data.product.price !== 19999 || data.product.stock !== 8) {
      throw new Error(`Product update failed: ${JSON.stringify(data)}`);
    }
  });

  // 11. Products: DELETE Product
  await test(`DELETE /api/products/${createdProductId}`, async () => {
    const res = await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookie },
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Product delete failed: ${JSON.stringify(data)}`);
    }
  });

  // 12. Orders: GET Orders List
  let testOrderId = null;
  await test('GET /api/orders', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      headers: { Cookie: adminCookie },
    });
    const data = await res.json();
    if (res.status !== 200 || !Array.isArray(data.orders)) {
      throw new Error(`Orders fetch failed: ${JSON.stringify(data)}`);
    }
  });

  // 13. Orders: POST New Order
  await test('POST /api/orders (Create Order)', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Ananya Varma',
        customerPhone: '+91 99887 76655',
        customerEmail: 'ananya@example.com',
        shippingAddress: 'Plot 88, Jubilee Hills Road No. 36, Hyderabad',
        items: [
          {
            id: 1,
            title: 'Swarna Kanchi Pure Silk Saree',
            price: 42500,
            quantity: 1,
            shade: 'Sindhoori Vermilion Red',
          },
        ],
        total: 42500,
        paymentMethod: 'upi',
      }),
    });
    const data = await res.json();
    if (res.status !== 201 || !data.order || !data.order.id) {
      throw new Error(`Order placement failed: ${JSON.stringify(data)}`);
    }
    testOrderId = data.order.id;
  });

  // 14. Orders: PUT Update Order Status
  await test(`PUT /api/orders/${testOrderId} (Status -> Dispatched)`, async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${testOrderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({ status: 'Dispatched' }),
    });
    const data = await res.json();
    if (res.status !== 200 || data.order.status !== 'Dispatched') {
      throw new Error(`Order status update failed: ${JSON.stringify(data)}`);
    }
  });

  // 15. Appointments: GET Appointments
  let testApptId = null;
  await test('GET /api/appointments', async () => {
    const res = await fetch(`${BASE_URL}/api/appointments`, {
      headers: { Cookie: adminCookie },
    });
    const data = await res.json();
    if (res.status !== 200 || !Array.isArray(data.appointments)) {
      throw new Error(`Appointments fetch failed: ${JSON.stringify(data)}`);
    }
  });

  // 16. Appointments: POST New Appointment
  await test('POST /api/appointments (Book Consultation)', async () => {
    const res = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Kavitha Sharma',
        phone: '+91 91234 56789',
        date: '2026-10-25',
        time: '11:00 AM',
        category: 'kanchipuram',
        notes: 'Bride sister looking for Muhurtham silk sarees with heavy zari',
      }),
    });
    const data = await res.json();
    if (res.status !== 201 || !data.appointment || !data.appointment.id) {
      throw new Error(`Appointment booking failed: ${JSON.stringify(data)}`);
    }
    testApptId = data.appointment.id;
  });

  // 17. Appointments: PUT Update Appointment Status
  await test(`PUT /api/appointments/${testApptId} (Status -> Completed)`, async () => {
    const res = await fetch(`${BASE_URL}/api/appointments/${testApptId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({ status: 'Completed' }),
    });
    const data = await res.json();
    if (res.status !== 200 || data.appointment.status !== 'Completed') {
      throw new Error(`Appointment update failed: ${JSON.stringify(data)}`);
    }
  });

  // 18. Page Routes Verification
  const pages = [
    '/',
    '/sarees',
    '/product/1',
    '/product/swarna-kanchi-pure-silk-saree',
    '/checkout',
    '/admin',
    '/admin/login',
    '/stores',
    '/about',
  ];

  for (const page of pages) {
    await test(`Page Route: ${page}`, async () => {
      const res = await fetch(`${BASE_URL}${page}`);
      if (res.status !== 200) {
        throw new Error(`Returned status ${res.status}`);
      }
    });
  }

  console.log('\n=================================================');
  console.log(`TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
  console.log('=================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
