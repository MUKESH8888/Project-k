# Kalyanam — redesigned storefront

A responsive Next.js 16.4.6 storefront with a working, persistent single-server commerce backend.

## Run

Requirements: Node.js 24+, npm, and writable persistent disk.

```powershell
cd 'D:\Project K\kalyanam-mall'
npm install
npm run dev
```

Production preview:

```powershell
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
```

Storefront: http://localhost:3100 · Management: http://localhost:3100/admin

## Included

- Responsive editorial storefront, locally hosted fonts, reusable product cards and SVG icons.
- Women, men and kids collections; search, price filtering, sorting and distinct product details.
- Persistent shopping bag and wishlist, empty states, accessible native dialogs and keyboard focus.
- Customer profiles, saved delivery addresses, password changes with all-device session revocation, and customer cancellation before dispatch.
- Live checkout price/stock quotes and price-change rejection before committing an order.
- Admin courier/tracking details and a customer-facing order timeline.
- Customer registration and sign-in, salted scrypt password hashes, opaque HttpOnly sessions, logout revocation, request limits and origin checks.
- Cash-on-delivery checkout, server-calculated prices, atomic stock changes, idempotency and order confirmation.
- Account order history scoped to the signed-in customer ID. Guest orders remain on their checkout confirmation; matching an email alone never grants access.
- Admin catalog editing, validated image uploads, stock management, order status transitions, appointment requests and customer enquiry inbox.
- Collected revenue is calculated only from delivered orders. There are no fabricated sales, reviews or customers.
- Product-image uploads accept JPEG/PNG/WebP up to 5 MB, decode and re-encode images as WebP and strip original metadata.

## Data and deployment

The working backend uses SQLite in `.data/commerce.sqlite`; sessions and request limits use separate SQLite files in `.data/`. Catalog data is seeded once from the existing project's local assets. Orders, users and stock changes survive restarts. Never delete `.data/` to redeploy.

The prior PostgreSQL connection could not be reached. Its `.env.local` and `database/` schema/seed files were preserved; this implementation does not connect to or modify that remote database. The old source is also retained in Git history. Do not run the legacy SQL seed for this new backend.

Deploy as a persistent Node server behind HTTPS. This storage model is intentionally single-host: do not deploy it to an ephemeral/serverless filesystem or horizontally scaled instances without migrating the storage layer. Keep the application disk, `.data/`, and `public/images/uploads/` durable and backed up. Stop the app for a simple consistent filesystem backup, or use SQLite's online backup facilities.

Optional environment variables:

- `COMMERCE_DATA_DIR`: absolute directory for commerce.sqlite (default `.data/`).
- `SESSION_DATA_DIR`: absolute directory for sessions.sqlite and limits.sqlite (default `.data/`).
- `APP_ORIGIN`: exact public HTTPS origin for origin validation behind a reverse proxy.
- `TRUST_PROXY=true`: only when the reverse proxy overwrites X-Forwarded-For. Otherwise rate limiting uses a conservative shared local bucket.

Uploaded images live in `public/images/uploads/` under the running app. Existing catalog images stay in `public/images/products/`. Files are excluded from Git, so back up uploads separately.

## Administrator access

There are no default passwords or production demo accounts. To create an administrator:

```powershell
$env:ADMIN_EMAIL = 'your-email@example.com'
$env:ADMIN_NAME = 'Store Owner'
# Set ADMIN_PASSWORD privately in your environment (10–128 characters).
npm run admin:create
Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
```

This command creates a new account and refuses to silently promote an existing account. The local handoff includes a generated owner account in a separate private access file. Do not put that file in source control or a public deployment.

## Verification

```powershell
npm run lint
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
npm run db:backup
```

The browser suite uses installed Microsoft Edge and an isolated test database/server on port 3101. It checks desktop/mobile layouts, browser errors, image decoding, filters, wishlist, bag persistence, checkout, registration, enquiry submission, forged-session rejection, and admin catalog/image editing. The suite also exercises 320, 360, 390 and 768px widths, populated checkout, mobile admin, saved-address checkout, cancellation and password changes. Test data stays under `work/`; it never edits the normal commerce database. Screenshots are in `work/screens/`.

The backend suite tests password handling, password-change session revocation, address isolation, ownership checks, tracking-link validation, logout revocation, price tampering, quantity validation, all-or-nothing checkout, stock contention, duplicate submission, cancellation restocking and persistence in a fresh process.

## Before taking real customer orders

The website is functional locally, but business integrations have not been invented or simulated:

- Checkout supports cash on delivery only. Connect a merchant payment gateway and verified webhooks to accept online payments.
- Shipping is managed by the store; there is no live courier integration or guaranteed transit estimate.
- Enquiries and appointment requests are stored in the admin inbox; automatic email/SMS/WhatsApp delivery is not configured. Appointment requests are not automatically confirmed bookings.
- Review the seeded products, actual stock, prices, image rights, physical store addresses and delivery/return terms with the client.
- Configure the real domain, HTTPS, backups and production administrator before public launch.
- Password reset and email verification require a transactional email provider and are not present in this build.

The production dependency audit is clean. The full development-tool audit still reports a picomatch-related ReDoS advisory through lint/build tooling; do not describe the entire dependency tree as vulnerability-free or force incompatible major upgrades without checking the tooling.

## Fonts

Cormorant Garamond and DM Sans are stored locally in `public/fonts/`. Their SIL Open Font License files are included beside them.

## Operations added in this revision

- `npm run db:backup` creates online SQLite snapshots, checks each with `PRAGMA integrity_check`, and copies uploaded images. Default destination: `.data/backups/<timestamp>`. Override with `BACKUP_DIR`. Backups contain private customer/account data and must stay private. Restore instructions are included in each backup folder.
- `GET /api/health` returns a minimal health status without customer or infrastructure details.
- Session authorization re-reads the current user and authentication version from durable storage, so password changes invalidate old sessions even if the session-file cleanup is interrupted.
- Account email cannot be changed through profile editing; customer requests cannot promote roles or modify other accounts' addresses or orders.
- Shipment links require HTTPS and are entered manually by an administrator. There is no claim of live courier synchronization.
- Cash on delivery remains the only payment method, as explicitly requested. Email/SMS account recovery and notifications remain provider-dependent and are not represented as active features.
