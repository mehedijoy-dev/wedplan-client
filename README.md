# WedPlan: Wedding Planning Platform

WedPlan is a role-based wedding planning platform. Customers discover wedding services and request bookings, vendors publish and manage their services and booking requests, and admins moderate users, services and platform transactions.

## Live Website and Repositories

|                       | Link                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| **Live Website**      | [https://wedplan-client-kappa.vercel.app](https://wedplan-client-kappa.vercel.app)                 |
| **Live API**          | [https://wedplan-server-tawny.vercel.app](https://wedplan-server-tawny.vercel.app)                 |
| **Client Repository** | [https://github.com/mehedijoy-dev/wedplan-client](https://github.com/mehedijoy-dev/wedplan-client) |
| **Server Repository** | [https://github.com/mehedijoy-dev/wedplan-server](https://github.com/mehedijoy-dev/wedplan-server) |

## Important Features

- Role-based authentication (Customer, Vendor, Admin) with Better Auth: email/password and Google login
- Admin accounts cannot be created through public registration
- Browse approved and active services with search by name, category and location filters, and price sorting (ascending and descending)
- Protected service details page with an image gallery and a booking request form
- Booking system with duplicate request prevention, vendor accept/reject, and customer cancel for pending requests only
- Vendor dashboard: overview, add/edit/pause/delete services, booking requests, subscription and profile settings
- Free plan limited to 3 active services, Premium for unlimited services through Stripe Checkout (test mode)
- Premium is activated only after a verified Stripe webhook event, never from the frontend redirect
- Admin dashboard: overview, manage users (search, role filter, block/unblock), approve/reject/delete services, read-only transactions
- Customer dashboard: overview and booking management
- Server-side JWT verification and role checks on all protected APIs; blocked users cannot access protected features
- Image uploads (profile and service images) through ImgBB
- Fully responsive design, toast notifications, loading and empty states, custom 404 page and Motion animations on the home page

## Technology Stack

- **Client:** Next.js (App Router), TypeScript, Tailwind CSS, ShadCN UI, Motion (Framer Motion), Better Auth
- **Server:** Node.js, Express.js, MongoDB, JWT verification with jose
- **Payments:** Stripe Checkout (test mode) and Stripe Webhooks
- **Image Hosting:** ImgBB
- **Deployment:** Vercel

## Installation

```bash
git clone [https://github.com/mehedijoy-dev/wedplan-client.git](https://github.com/mehedijoy-dev/wedplan-client.git)
cd wedplan-client
npm install
```
