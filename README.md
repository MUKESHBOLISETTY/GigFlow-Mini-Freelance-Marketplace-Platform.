
# ServiceHive

ServiceHive is a freelance marketplace web app that connects clients and freelancers. It includes a React client (Vite), an Express server, and MongoDB for persistence. The project implements authentication, project posting, bidding, email workflows, OTP, and Server-Sent Events for realtime updates.

**Tech Stack:**
- **Client:** React, Vite, Tailwind CSS
- **Server:** Node.js, Express
- **Database:** MongoDB (Mongoose models)
- **Email:** nodemailer (mailSender)

**Quick Start**
- **Clone:** git clone <repo-url>
- **Server:**
	- Install: `cd server && npm install`
	- Start: `npm run dev` (or `node index.js`)
- **Client:**
	- Install: `cd client && npm install`
	- Start: `npm run dev`

**Env / Configuration**
- Add your `.env` in `server/` with values for `MONGO_URI`, `JWT_SECRET`, `EMAIL_*` creds, and any other keys used in `config/database.js`.

**Project Structure (high level)**
- **server/**: Express app and API
	- `index.js` — server entry
	- `config/database.js` — DB connection
	- `controllers/` — request handlers (AuthController, ProjectController, BidController)
	- `routes/` — route definitions (AuthRoutes, ProjectRoutes, BidRoutes)
	- `models/` — Mongoose models (Client, Freelancer, Project, Bid, OTP, ForgotPassword)
	- `middlewares/` — AuthMiddleware, ServerSentUpdates
	- `mail/` — email templates
	- `utils/` — `mailSender.js`, `respond.js`
- **client/**: React (Vite) app
	- `src/components/` — UI components for client, freelancer, reusable pieces
	- `src/hooks/` — custom hooks (`useAuth.js`, `useBids.js`, `useGigs.js`)
	- `src/redux/` — store and slices
	- `src/services/api.js` — API helper

**API & Routes (overview)**
- `POST /auth/signup`, `POST /auth/login` — authentication
- `POST /projects` — create project (client)
- `GET /projects` — list/search projects
- `POST /projects/:id/bid` — place a bid (freelancer)
- Additional endpoints for OTP, password reset, and bid management follow controllers in `controllers/` and routes in `routes/`.


---



