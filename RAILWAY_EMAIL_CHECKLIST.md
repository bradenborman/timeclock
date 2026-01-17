# Railway Email Troubleshooting Checklist

## Step 1: Check Environment Variables in Railway

In Railway Dashboard → Your Project → Variables tab:

- [ ] `SPRING_MAIL_USERNAME` is set to your Gmail address (e.g., `bradenborman00@gmail.com`)
- [ ] `SPRING_MAIL_PASSWORD` is set to your Gmail App Password (16 characters)
- [ ] Both variables are visible in the "Variables" section
- [ ] You've redeployed after adding/changing variables

## Step 2: Generate Gmail App Password

If you haven't already:

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Create new app password for "Mail" → "Other (Railway Timeclock)"
5. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
6. Remove spaces: `xxxxxxxxxxxxxxxx`
7. Use this as `SPRING_MAIL_PASSWORD` in Railway

## Step 3: Check Railway Logs

After deploying, look for these log entries on startup:

### ✅ Good Signs
```
=== EMAIL CONFIGURATION ===
Host: smtp.gmail.com
Port: 587
Username: bradenborman00@gmail.com
Password set: true
Password length: 16
```

### ❌ Bad Signs
```
Username: 
Password set: false
Password length: 0
```
**Fix**: Environment variables not set correctly in Railway

## Step 4: Test Email Send

1. Open your Railway app URL
2. Go to Admin panel (password: `cherry`)
3. Click "📧 Send Email Report"
4. Check Railway logs immediately

### ✅ Success Logs
```
=== EMAIL SEND REQUEST RECEIVED ===
=== STARTING EMAIL SEND ===
Creating MIME message...
MIME message created successfully
=== ATTEMPTING TO SEND EMAIL ===
Mail server: smtp.gmail.com:587
Using username: bradenborman00@gmail.com
=== EMAIL SENT SUCCESSFULLY ===
Time taken: 2345 ms
```

### ❌ Failure Logs - Connection Timeout
```
Couldn't connect to host, port: smtp.gmail.com, 587; timeout 10000
```

**Possible Causes**:
1. Railway blocks outbound SMTP (port 587)
2. Network/firewall issue

**Solutions**:
- Contact Railway support to confirm SMTP is allowed
- Try alternative email service (SendGrid, Mailgun)

### ❌ Failure Logs - Authentication Failed
```
535 Authentication failed
```

**Causes**:
1. Wrong App Password
2. Using regular Gmail password instead of App Password
3. Username/password mismatch

**Solutions**:
1. Regenerate Gmail App Password
2. Double-check no spaces in password
3. Verify username is full email address

### ❌ Failure Logs - Environment Variables Not Set
```
=== ENVIRONMENT CHECK ===
SPRING_MAIL_USERNAME env var set: false
SPRING_MAIL_PASSWORD env var set: false
Configured username: 
Configured password set: false
```

**Solution**: Add environment variables in Railway dashboard and redeploy

## Step 5: Verify Email Received

Check `bradenborman00@gmail.com` inbox for:
- Subject: `[DATE] Timesheet`
- Attachment: `[DATE]-timesheet.xlsx`
- Body: List of notes

## Common Mistakes

1. **Using regular Gmail password** instead of App Password
   - Regular password won't work with 2FA enabled
   - Must use 16-character App Password

2. **Spaces in App Password**
   - Gmail shows: `xxxx xxxx xxxx xxxx`
   - Must enter: `xxxxxxxxxxxxxxxx` (no spaces)

3. **Not redeploying after setting variables**
   - Railway requires redeploy to pick up new environment variables
   - Click "Deploy" button after adding variables

4. **Wrong username format**
   - ❌ `bradenborman00`
   - ✅ `bradenborman00@gmail.com`

## Alternative Solution: Use SendGrid

If Gmail continues to fail, switch to SendGrid (free tier: 100 emails/day):

1. Sign up at https://sendgrid.com
2. Create API key
3. Update Railway variables:
   ```
   SPRING_MAIL_HOST=smtp.sendgrid.net
   SPRING_MAIL_PORT=587
   SPRING_MAIL_USERNAME=apikey
   SPRING_MAIL_PASSWORD=[your-sendgrid-api-key]
   ```
4. Update `application.yml`:
   ```yaml
   spring:
     mail:
       host: ${SPRING_MAIL_HOST:smtp.gmail.com}
       port: ${SPRING_MAIL_PORT:587}
   ```

## Need More Help?

Check the full logs in Railway:
1. Go to Railway Dashboard
2. Click on your service
3. Click "Deployments" tab
4. Click on latest deployment
5. View full logs
6. Look for the `=== EMAIL CONFIGURATION ===` section
7. Share the logs (remove password info) for debugging
