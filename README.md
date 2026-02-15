# Dog Walking App - Complete Source Code

A full-stack dog walking business management application built with:
- **Frontend:** React + Vite
- **Backend:** Cloudflare Pages Functions
- **Database:** Cloudflare D1 (SQLite)
- **Hosting:** Cloudflare Pages

**100% FREE** - Everything runs on Cloudflare's free tier!

---

## ✅ COMPLETE FILES INCLUDED

### Frontend (React)
- ✅ `src/main.jsx` - Entry point
- ✅ `src/App.jsx` - Router & protected routes
- ✅ `src/styles/main.css` - Complete CSS
- ✅ `src/components/Icons.jsx` - All SVG icons
- ✅ `src/utils/api.js` - API client
- ✅ `src/utils/auth.jsx` - Auth context
- ✅ `src/pages/Home.jsx` - Home page
- ✅ `src/pages/Services.jsx` - Services page
- ✅ `src/pages/Contact.jsx` - Contact form
- ✅ `src/pages/Login.jsx` - Login page
- ✅ `src/pages/client/Layout.jsx` - Client portal layout
- ✅ `src/pages/client/Dashboard.jsx` - Client dashboard
- ✅ `src/pages/client/Bookings.jsx` - Client bookings
- ✅ `src/pages/admin/Dashboard.jsx` - Admin dashboard

### Backend (Cloudflare Pages Functions)
- ✅ `functions/_helpers.js` - Auth & DB utilities
- ✅ `functions/api/auth/login.js` - Login endpoint
- ✅ `functions/api/auth/logout.js` - Logout endpoint
- ✅ `functions/api/auth/session.js` - Session check
- ✅ `functions/api/contact.js` - Contact form
- ✅ `functions/api/client/bookings.js` - Client bookings API
- ✅ `functions/api/client/pets.js` - Client pets API
- ✅ `functions/api/client/invoices.js` - Client invoices API
- ✅ `functions/api/admin/dashboard.js` - Admin dashboard API
- ✅ `functions/api/admin/clients.js` - Admin clients CRUD
- ✅ `functions/api/admin/pets.js` - Admin pets CRUD
- ✅ `functions/api/admin/bookings.js` - Admin bookings CRUD
- ✅ `functions/api/admin/invoices.js` - Admin invoices CRUD

### Configuration
- ✅ `schema.sql` - Complete database schema
- ✅ `wrangler.toml` - Cloudflare config
- ✅ `package.json` - Dependencies
- ✅ `vite.config.js` - Build config
- ✅ `index.html` - HTML entry
- ✅ `.gitignore` - Git ignore rules

---

## 🚀 DEPLOYMENT GUIDE

### Step 1: Create Cloudflare Account (2 min)
1. Go to https://dash.cloudflare.com/sign-up
2. Create a free account
3. Verify your email

### Step 2: Create D1 Database (5 min)
1. In Cloudflare dashboard → Workers & Pages → D1
2. Click "Create database"
3. Name: `dog-walking-db`
4. Click "Create"
5. **COPY THE DATABASE ID** (you'll need this)

### Step 3: Apply Database Schema (2 min)
1. Click on your `dog-walking-db` database
2. Go to "Console" tab
3. Copy the ENTIRE contents of `schema.sql`
4. Paste into the console
5. Click "Execute"
6. You should see "Success" messages

### Step 4: Update wrangler.toml (1 min)
1. Open `wrangler.toml` in a text editor
2. Find the line: `database_id = "YOUR_DATABASE_ID_HERE"`
3. Replace `YOUR_DATABASE_ID_HERE` with your actual Database ID from Step 2
4. Save the file

### Step 5: Push to GitHub (5 min)
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 6: Deploy to Cloudflare Pages (5 min)
1. In Cloudflare dashboard → Workers & Pages
2. Click "Create application" → "Pages" tab
3. Click "Connect to Git"
4. Connect GitHub and select your repository
5. Configure build settings:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Click "Save and Deploy"
7. Wait 2-3 minutes for build to complete

### Step 7: Bind D1 Database (CRITICAL - 3 min)
1. In Cloudflare Pages → Your project → Settings
2. Scroll to "Functions"
3. Under "D1 database bindings" click "Add binding"
4. Variable name: `DB` (must be exactly this)
5. D1 database: Select `dog-walking-db`
6. Click "Save"
7. Go to "Deployments" tab
8. Click "Retry deployment" on the latest deployment

### Step 8: Test Your App (2 min)
1. Visit your Cloudflare Pages URL (e.g., `your-app.pages.dev`)
2. Click "Client Login"
3. Login with demo credentials:
   - **Admin:** admin@pawwalkers.com / admin123
   - **Client:** client@example.com / client123
4. Test the client portal!

---

## 🎉 YOU'RE DONE!

Your app is now live and fully functional!

---

## 📱 FEATURES

### Public Pages
- ✅ Professional home page with services
- ✅ Services listing page
- ✅ Contact form (submits to database)
- ✅ User authentication

### Client Portal
- ✅ Dashboard with next booking
- ✅ View all bookings (upcoming/past)
- ✅ View pet profiles
- ✅ View invoices (read-only)
- ✅ Mobile-responsive navigation

### Admin Portal
- ✅ Dashboard with statistics
- ✅ Today's schedule
- ✅ View clients, pets, bookings, invoices
- ✅ CRUD operations via database console

---

## 🔧 LOCAL DEVELOPMENT

```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Run with Wrangler (includes D1)
npm run pages:dev

# Open http://localhost:8788
```

---

## 💾 DATABASE MANAGEMENT

Access your database via Cloudflare Dashboard:
1. Go to D1 → `dog-walking-db` → Console
2. Run SQL queries to manage data

Example queries:
```sql
-- View all users
SELECT * FROM users;

-- View all bookings
SELECT * FROM bookings;

-- Create a new client
INSERT INTO users (email, password_hash, role) 
VALUES ('new@example.com', 'hash_here', 'client');
```

---

## 🔒 DEMO CREDENTIALS

**Included in database:**
- Admin: admin@pawwalkers.com / admin123
- Client: client@example.com / client123

⚠️ **Change these before going live!**

---

## 💰 COST: $0

Everything runs on Cloudflare's generous free tier:
- Cloudflare Pages: Free (500 builds/month)
- Cloudflare D1: Free (5GB storage, 5M reads/day)
- Cloudflare Functions: Free (100k requests/day)

Perfect for small businesses!

---

## 🎨 CUSTOMIZATION

1. **Branding:** Search/replace "PawWalkers" with your business name
2. **Colors:** Edit `src/styles/main.css`, change `#0ea5e9` to your color
3. **Services:** Edit `src/pages/Services.jsx`
4. **Contact Info:** Update in `src/pages/Home.jsx` and `Contact.jsx`

---

## 🐛 TROUBLESHOOTING

**"DB is not defined" error:**
→ You forgot Step 7 (bind D1 database)

**Login doesn't work:**
→ Check schema.sql was applied in Step 3

**Build fails:**
→ Make sure `package.json` is correct

**API returns 404:**
→ Check functions are in `/functions/api/` directory

---

## ✅ PRODUCTION CHECKLIST

Before going live with real customers:
- [ ] Change demo user passwords in database
- [ ] Remove demo credentials from login page
- [ ] Update all contact information
- [ ] Test all features end-to-end
- [ ] Set up custom domain (optional)

---

## 📄 FILE STRUCTURE

```
dog-walking-cloudflare/
├── functions/               # Backend API
│   ├── _helpers.js
│   └── api/
│       ├── auth/
│       ├── client/
│       └── admin/
├── src/                     # Frontend
│   ├── pages/
│   ├── components/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── schema.sql              # Database schema
├── wrangler.toml          # Cloudflare config
├── package.json           # Dependencies
└── index.html             # Entry point
```

---

## 🆘 SUPPORT

1. Check this README
2. Review Cloudflare D1 docs: https://developers.cloudflare.com/d1/
3. Review Cloudflare Pages docs: https://developers.cloudflare.com/pages/

---

**Built with ❤️ using 100% free infrastructure!**
