# 📋 Database Migration Instructions

## 🎯 What This Does:
This SQL creates ALL tables needed for the Coali Trust Network system including:
- User profiles & authentication
- Trust relationships & delegations  
- Bookmarks & subscriptions
- Voting system with delegation
- Admin panel features
- ZOOZ transactions

## 🚀 How to Run:

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select your project: `hcqygoupvgcsdxtzyest`
3. Click **SQL Editor** in left sidebar

### Step 2: Run the Migration
1. Click **New Query**
2. Open file: `/app/database/COMPLETE_MIGRATION.sql`
3. Copy the ENTIRE contents
4. Paste into Supabase SQL Editor
5. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Success
You should see:
- ✅ "Success. No rows returned"
- OR specific counts for inserted rows

### Step 4: Refresh Your App
1. Go back to: https://trustflow-4.preview.emergentagent.com
2. Hard refresh (Ctrl+Shift+R)
3. Open browser console (F12)
4. You should see: "🎉 Demo data seeding complete!"

## 📊 Tables Created:

**Core Tables:**
1. profiles - User accounts
2. trust_relationships - Who trusts whom
3. bookmarks - Saved posts
4. subscriptions - Following/subscribers
5. user_votes - Decision votes

**Delegation System:**
6. trust_delegations - Voting power delegation
7. user_expertise - Expert qualifications
8. vote_delegations_log - Auto-vote history
9. vote_withdrawals - Vote changes
10. delegation_notifications - Delegation alerts

**Admin Features:**
11. admin_user_notes - Admin notes per user
12. zooz_transactions - ZOOZ transfer history
13. admin_activity_log - Admin action audit trail
14. expertise_categories - Reference data (10 categories)

**Table Updates:**
- demo_decisions: Added category, end_date, votes counts
- demo_posts: Added status, bookmark_count

## ⚠️ Important Notes:

- Run this ONLY ONCE
- All tables use `IF NOT EXISTS` so it's safe to re-run
- Permissions are granted for `authenticated` and `anon` roles
- Indexes created for performance

## 🐛 Troubleshooting:

**If you get permission errors:**
- Make sure you're logged into Supabase dashboard
- Check you have admin/owner access to the project

**If tables already exist:**
- That's OK! The script skips existing tables
- Only new tables will be created

**If you see foreign key errors:**
- Some relationships depend on existing data
- The script handles this gracefully

## ✅ After Running:

Your app will immediately have:
- Real trust relationships showing in profile
- Real bookmarks displaying saved posts
- Real voting history with results
- Real subscriptions to creators
- Full admin panel functionality
- Trust delegation voting system

## 📍 File Location:
`/app/database/COMPLETE_MIGRATION.sql`
