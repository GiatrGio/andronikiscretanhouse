# Supabase Setup Guide for Androniki's Cretan House

This guide walks you through setting up Supabase for authentication, database, and storage.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization, name your project, and set a database password
4. Wait for the project to be provisioned

## 2. Get API Keys

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefg.supabase.co`)
   - **anon/public key**
   - **service_role key** (keep this secret!)

3. Update your `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Set Up the Database

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `scripts/supabase-schema.sql`
4. Click **Run** to execute the SQL

This creates:
- `recipes` table with JSONB data column
- Indexes for slug and category
- Row Level Security policies
- Automatic `updated_at` trigger

## 4. Create the Storage Bucket

1. Go to **Storage** in the Supabase dashboard
2. Click **New Bucket**
3. Name it `recipe-images`
4. Enable **Public bucket** (so images are publicly accessible)
5. Click **Create bucket**

## 5. Create an Admin User

1. Go to **Authentication > Users**
2. Click **Add User**
3. Choose **Create new user**
4. Enter an email and password for your admin account
5. Click **Create user**

Note: You may need to confirm the email if email confirmation is enabled. To disable it:
- Go to **Authentication > Providers > Email**
- Toggle off "Confirm email"

## 6. Configure Authentication Settings (Optional)

Go to **Authentication > Settings** to configure:
- JWT expiry time (default: 3600 seconds / 1 hour)
- Enable/disable email confirmation
- Set password requirements

## 7. Migrate Existing Recipes (Optional)

If you have existing recipes in JSON files:

```bash
npx tsx scripts/migrate-to-supabase.ts
```

This will:
- Read recipes from `public/recipes/`
- Upload images to Supabase Storage
- Insert recipes into the database

## Verification

After setup, verify everything works:

1. **Authentication**
   - Visit `/admin/recipes` - should redirect to login
   - Log in with your admin credentials
   - Should access the admin dashboard

2. **Logout**
   - Click the logout button in the sidebar
   - Should redirect to login page

3. **Recipes**
   - Visit `/recipes` - should show recipe list
   - Click a recipe - should show details

4. **Admin Operations**
   - Create a new recipe
   - Edit an existing recipe
   - Delete a recipe

## File Structure

```
src/lib/supabase/
├── client.ts      # Browser client (client components)
├── server.ts      # Server client (server components)
├── middleware.ts  # Middleware client (auth checks)
├── admin.ts       # Service role client (admin operations)
└── storage.ts     # Storage helper functions
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public/anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) |

## URL Structure

Recipe URLs have changed from slug-based to ID-based:
- Old: `/recipes/moussaka`
- New: `/recipes/1`

This simplifies database operations and avoids slug management complexity.
