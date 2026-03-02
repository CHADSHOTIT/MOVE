# Office Movement + Parking Bay Allocation

Lightweight internal app for weekly movement selection and automatic parking allocation.

## Stack
- Next.js (TypeScript)
- Prisma + SQLite
- ExcelJS export

## Setup
1. Install deps:
   ```bash
   npm install
   ```
2. Create `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   ADMIN_TOKEN="change-me"
   ```
3. Run migrations + generate client:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed data:
   ```bash
   npm run seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

## Usage
- User flow: `/` → select name → edit week (Mon–Fri).
- Admin: `/admin?token=<ADMIN_TOKEN>`.
- Export XLSX: admin page link or `/api/export?token=<ADMIN_TOKEN>`.

## Config
- Owner cutoff is stored in `Setting` key `owner_cutoff_hhmm` (default `18:00` previous day, Europe/London).
- Locking rule: day is read-only from `00:00` Europe/London (`isDayLocked`).

## Allocation behavior
- Owners with `OFFICE` keep own bays.
- Owner bays are released when owner is non-office OR missing status after cutoff.
- Non-owner `OFFICE` requests are ordered by `requestedAt ASC` for first-come-first-served temp assignment.
- Assignments are deterministic and recomputed from source movements/requests.

## Scheduler strategy
- App implements lazy recompute on week/admin page loads and after movement/staff changes.
- You can optionally trigger `/api/admin/recompute?token=...` from cron every 5 minutes.

## Acceptance tests covered
- Owner marking non-office releases bay.
- Non-owner earlier office request gets bay first.
- Owner missing by cutoff releases bay.
- Day locking at day start prevents edits.
- Excel export includes status, assigned bay, request timestamp and summary tab.


## How do I test?

### 1) Fast local smoke test
```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```
6. Run unit tests:
   ```bash
   npm test
   ```
Then open:
- User page: `http://localhost:3000`
- Admin page: `http://localhost:3000/admin?token=change-me`

### 2) Manual acceptance checks
Use admin to set up names from seed data and run these scenarios:

1. **Owner releases bay when not in office**
   - Pick owner `Alice Carter` (bay 1), set Tuesday to `WFH`.
   - Pick a non-owner and set Tuesday to `OFFICE`.
   - Expected: non-owner can receive bay 1.

2. **First-come-first-served ordering**
   - For the same day, set non-owner `Karl Smith` to `OFFICE` first, then `Laura Brown` later.
   - Expected: Karl receives a temp bay before Laura when bays are limited.

3. **Missing owner by cutoff releases bay**
   - In admin, set cutoff to a near-future time (for testing).
   - Leave an owner unset for target day; after cutoff, trigger recompute by loading week/admin page or `GET /api/admin/recompute?token=...`.
   - Expected: owner bay becomes available to non-owner office queue.

4. **Locking at day start**
   - On the date itself (Europe/London), refresh the week page.
   - Expected: current day is disabled/read-only and save button is hidden for that day.

5. **Excel export**
   - From admin, click **Export current week XLSX**.
   - Expected file has `Week` and `Summary` sheets with statuses, assigned bays, request timestamps, and per-day summary counts.

### 3) Optional API checks (token required)
- Recompute endpoint:
```bash
curl "http://localhost:3000/api/admin/recompute?token=change-me"
```
- Export endpoint:
```bash
curl -L "http://localhost:3000/api/export?token=change-me" -o office-movement-week.xlsx
```
