# 🤖 MATGARCO AI CONSTITUTION & ARCHITECTURAL MAP (CAVEMAN EDITION)

## 📌 1. The Prime Directive (Caveman Protocol)

**ACTIVE EVERY RESPONSE.** Terse like caveman. Technical substance exact. Only fluff die.
Drop: articles, filler (just/really/basically), pleasantries, hedging. Fragments OK. Short synonyms. Code unchanged.
Pattern: [thing] [action] [reason]. [next step].
No vibe coding. Zero scope creep.

---

## 🗺️ 2. Architectural Map (Token Saver)

- **`/backend-node/`**: Node.js 20, Express, Mongoose 8. (Controllers, Middleware, Services).
- **`/storefront-next/`**: Next.js 14, App Router. (Wildcard subdomains, edge routing).
- **`/dashboard-react/`**: Vite, React. (Merchant/Admin SPA).

---

## 🏗️ 3. Domain-Specific Rules (Front + Back + DB + API)

### 🖥️ A. Frontend (UI/UX & Storefront/Dashboard)

- **MCPs & UI Agents:** Assume external MCPs handle complex UI generation. Focus on business logic and state wiring.
- **Loading States:** NEVER fetch data without implementing UI Skeletons or loading states to prevent layout shifts.
- **SEO (Storefront):** Use Next.js `generateMetadata` for dynamic OG tags and SEO. Never hardcode meta tags.
- **Styling:** Use generic functional utility classes (Tailwind). No inline styles. No nested CSS hell.

### ⚙️ B. Backend & API (Node.js/Express)

- **Rate Limiting:** Protect all authentication and payment routes against brute-force/DDoS (implement memory/DB rate limiters if Redis is absent).
- **RESTful Discipline:** Use exact HTTP status codes (201 Created, 400 Bad Request, 403 Forbidden, 404 Not Found).
- **Stateless Auth:** Rely strictly on JWTs (`req.user`) and Headers (`x-subdomain`). Never trust sensitive IDs in `req.body`.
- **Fail-Fast Middleware:** Validate inputs and tenant scope BEFORE hitting the controller.

### 🗄️ C. Database (MongoDB/Mongoose)

- **ACID Transactions:** Use `session.withTransaction()` for multi-document operations (e.g., deducting stock + creating order).
- **Atomic Updates:** Use Aggregation Pipeline Updates (e.g., `$inc`, `$max`, `$set` with `$cond`) to prevent Race Conditions.
- **Zero Lock Contention:** Fire-and-forget stats updates (post-commit) outside the main transaction if they don't affect immediate data integrity.

---

## ⚙️ 4. Execution Pipeline (Plan → Context → Review)

1. **Locate:** Use Map to open exact file. No workspace crawling.
2. **Plan:** State exact lines changing. Caveman speak.
3. **Execute:** Write minimal required code. No format changes.
4. **Rollback:** If break, abort. No silent guessing.
