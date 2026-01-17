# Railway SMTP Solution

## Problem
Gmail SMTP works locally but fails on Railway with connection timeout errors.

## Root Cause
**Railway blocks outbound SMTP (ports 25, 465, 587) on Free, Trial, and Hobby plans.**

SMTP is only available on the **Pro plan and above** to prevent spam and abuse.

## Solution: Upgrade to Railway Pro

### Steps to Enable Gmail SMTP:

1. **Upgrade to Pro Plan**
   - Go to Railway Dashboard → Settings → Billing
   - Click "Upgrade to Pro"
   - Pricing: Pay-as-you-go (starts at $5/month minimum)
   - [Railway Pricing Details](https://railway.app/pricing)

2. **Redeploy Your Service** (Required!)
   - After upgrading, go to your service
   - Click "Deploy" or trigger a new deployment
   - SMTP ports are unblocked after redeploy

3. **Verify Email Works**
   - Open your Railway app
   - Go to Admin panel (password: `cherry`)
   - Click "📧 Send Email Report"
   - Check logs for success message
   - Check `bradenborman00@gmail.com` for the email

### What's Already Configured:

✅ Gmail SMTP settings in `application.yml`
✅ Environment variables set in Railway:
   - `SPRING_MAIL_USERNAME=candyfactorydonotreply@gmail.com`
   - `SPRING_MAIL_PASSWORD=[your-app-password]`
✅ Comprehensive logging to debug any issues
✅ Code tested and working locally

### After Upgrading:

Your email will work immediately with **no code changes needed**. The comprehensive logging will show:
```
=== EMAIL CONFIGURATION ===
Host: smtp.gmail.com
Port: 587
Username: candyfactorydonotreply@gmail.com
Password set: true
=== EMAIL SENT SUCCESSFULLY ===
```

## Alternative: Free Transactional Email Services

If you don't want to upgrade yet, these services work on **all Railway plans** (they use HTTPS instead of SMTP):

- **Resend** - 3,000 emails/month free
- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free (first 3 months)

Let me know if you want to implement one of these as a temporary solution.

## Current Status

✅ Application works perfectly locally
✅ Email sends successfully from local environment
✅ Modern UI deployed and working
✅ Comprehensive logging added for debugging
⏳ Waiting for Railway Pro upgrade to enable SMTP

## Reference

- [Railway Outbound Networking Docs](https://docs.railway.com/reference/outbound-networking)
- [Railway Pricing](https://railway.app/pricing)
