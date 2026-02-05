# Migrating Domain from WordPress to Vercel

Migration plan for `andronikiscretanhouse.com` from WordPress to Vercel.

## Step 1: Add Custom Domain in Vercel

1. Go to your Vercel dashboard → Select your project
2. Go to **Settings** → **Domains**
3. Add `andronikiscretanhouse.com` (and optionally `www.andronikiscretanhouse.com`)
4. Vercel will show you the DNS records you need to configure

## Step 2: Choose Your DNS Approach

You have two options:

### Option A: Use Vercel's Nameservers (Recommended)

Transfer DNS management entirely to Vercel:

- Vercel will provide nameservers like `ns1.vercel-dns.com`, `ns2.vercel-dns.com`
- You'll update these in your domain registrar

### Option B: Keep Existing DNS, Add Records

Add these records at your current DNS provider:

- **A Record**: `@` → `76.76.21.21`
- **CNAME Record**: `www` → `cname.vercel-dns.com`

## Step 3: Update DNS at WordPress/Domain Registrar

1. Log into your WordPress.com account
2. Go to **Upgrades** → **Domains** → Select your domain
3. Look for **DNS Settings** or **Nameservers**

**If your domain is registered with WordPress.com:**

- Go to domain settings → **Change nameservers** or **Transfer domain**
- Either update nameservers to Vercel's, or add the A/CNAME records

**If you want to transfer the domain entirely away from WordPress:**

1. In WordPress: Go to **Domains** → **Transfer to another registrar**
2. Unlock the domain and get the transfer authorization code
3. Transfer to a registrar like Namecheap, Cloudflare, or Google Domains
4. Then point DNS to Vercel

## Step 4: SSL Certificate

Vercel automatically provisions SSL certificates once DNS is configured. This may take a few minutes to a few hours.

## Step 5: Verify Migration

1. Wait for DNS propagation (can take up to 48 hours, usually much faster)
2. Check propagation status at https://dnschecker.org
3. Visit your domain to confirm it loads your Vercel site
4. Verify HTTPS is working

## Step 6: Clean Up WordPress

Once everything is working:

1. Cancel your WordPress hosting plan (if paid)
2. Remove or downgrade the WordPress site

---

## Important Notes

- **Backup**: Make sure your WordPress content is backed up if needed
- **Email**: If you use email with this domain through WordPress, you'll need to set up email elsewhere (like Google Workspace, Zoho, etc.) and add MX records in Vercel
- **Downtime**: There may be brief downtime during DNS propagation

## Checklist

- [ ] Add domain to Vercel project
- [ ] Configure DNS records
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate is active
- [ ] Test all pages on the new domain
- [ ] Cancel/remove WordPress hosting
