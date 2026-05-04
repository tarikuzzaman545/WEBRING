# Webring AI Visual Production Platform

Premium full-stack agency platform for Webring, an AI-powered product visual production company.

## What Is Included

- Next.js App Router frontend with TypeScript, Tailwind CSS, and Framer Motion
- Express.js API with MongoDB collections for settings, services, portfolio, pricing, team, bookings, messages, and admins
- Admin dashboard for brand settings, services, before/after portfolio, pricing, team, messages, bookings, and image uploads
- Cloudinary image upload integration
- Booking system with admin-controlled availability and double-booking prevention
- Nodemailer confirmation and team notification emails
- Seed script for initial dynamic content and admin user

## Project Structure

```txt
frontend/       Next.js public site, contract page, admin dashboard
backend/        Express API, MongoDB models, upload, email, booking logic
README.md       Setup and deployment guide
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. Fill `backend/.env`:

- `MONGO_URI`
- `JWT_SECRET`
- Cloudinary credentials
- SMTP credentials
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

4. Seed dynamic content and the first admin:

```bash
npm run seed
```

5. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:5000`

## Important Routes

- `/` public agency website
- `/contract` booking form
- `/admin` admin dashboard
- `GET /api/public/content` dynamic website content
- `POST /api/bookings` create booking with product image
- `GET /api/bookings/availability?date=YYYY-MM-DD` available slots
- `POST /api/auth/login` admin login
- `POST /api/admin/upload` Cloudinary upload

## Dynamic Content Rule

The public website pulls brand identity, colors, hero content, section copy, services, portfolio, pricing, team, and contact details from MongoDB through the API. Seed data is only starter content; the admin dashboard can edit it.

## Booking Logic

- Availability is stored in `settings.booking.availability`
- Booked slots are blocked by querying active bookings for the same date and time slot
- Cancelled bookings free the slot again
- Product images are uploaded to Cloudinary before the booking is saved
- Confirmation email goes to the client
- Team notification email goes to `settings.contact.email` or `TEAM_EMAIL`

## Admin Workflow

1. Log in at `/admin` with the seeded admin credentials.
2. Upload assets in the Image Upload panel.
3. Copy returned Cloudinary URLs into services, portfolio, pricing, team, logo, or hero settings.
4. Edit global settings as JSON for nested brand, section, contact, and availability control.
5. Manage bookings and contact message statuses.

## Deployment

### Backend

Deploy the `backend` workspace to Render, Railway, Fly.io, or a Node VPS.

Build command:

```bash
npm install && npm run build --workspace backend
```

Start command:

```bash
npm run start --workspace backend
```

Set backend environment variables from `backend/.env.example`.

### Frontend

Deploy the `frontend` workspace to Vercel or Netlify.

Build command:

```bash
npm run build --workspace frontend
```

Set:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### MongoDB

Use MongoDB Atlas. Add the backend host IP to the Atlas network allowlist and set `MONGO_URI` in the backend deployment environment.

### Cloudinary

Create an unsigned or signed Cloudinary account setup, then set:

```bash
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Email

Use a transactional SMTP provider such as Resend SMTP, SendGrid SMTP, Mailgun, Postmark, or Google Workspace SMTP. Set all `SMTP_*`, `MAIL_FROM`, and `TEAM_EMAIL` variables.

## Production Notes

- Put the backend behind HTTPS.
- Use a long random `JWT_SECRET`.
- Replace the seeded admin password immediately after launch.
- The frontend is pinned to `next@16.3.0-canary.9` because the latest stable release currently bundles a vulnerable PostCSS version. Move back to stable after the stable release line includes the patched PostCSS dependency.
- Add CDN image transformations in Cloudinary for each storefront format.
- Add a backup strategy for MongoDB Atlas.
- Consider adding role-based permissions if multiple editors will manage the dashboard.
