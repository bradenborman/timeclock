# Email Troubleshooting Guide

## Error: "Couldn't connect to host, port: smtp.gmail.com, 587; timeout"

This error means the application can't connect to Gmail's SMTP server.

### Causes & Solutions

### 1. **Missing Email Credentials** ⚠️ Most Common

**Problem:** `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD` environment variables are not set.

**Solution:**
In Railway dashboard → Your app service → Variables tab, add:

```bash
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-gmail-app-password
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Go to **App Passwords**
4. Generate password for "Mail"
5. Copy the 16-character password (no spaces)

### 2. **Railway Network Restrictions**

**Problem:** Railway might block outbound SMTP connections on port 587.

**Solution A - Use Port 465 (SSL):**

Add to Railway variables:
```bash
SPRING_MAIL_PORT=465
SPRING_MAIL_PROPERTIES_MAIL_SMTP_SSL_ENABLE=true
```

**Solution B - Disable Email Feature:**

If email isn't critical, you can disable it by not setting the email variables. The app will still work, but the "Send Email" button will fail.

### 3. **Gmail Security Settings**

**Problem:** Gmail is blocking the login attempt.

**Solution:**
- Make sure you're using an **App Password**, not your regular Gmail password
- Check if Gmail sent you a security alert email
- Verify 2-Step Verification is enabled

### 4. **Firewall/Network Issues**

**Problem:** Your network or Railway's network blocks SMTP.

**Test locally:**
```bash
telnet smtp.gmail.com 587
```

If this fails, SMTP is blocked.

**Alternative:** Use a different email service:
- SendGrid (Railway has an integration)
- Mailgun
- AWS SES
- Postmark

## Testing Email Locally

### 1. Set environment variables:
```bash
# Windows PowerShell
$env:SPRING_MAIL_USERNAME="your-email@gmail.com"
$env:SPRING_MAIL_PASSWORD="your-app-password"

# Linux/Mac
export SPRING_MAIL_USERNAME="your-email@gmail.com"
export SPRING_MAIL_PASSWORD="your-app-password"
```

### 2. Run the app:
```bash
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```

### 3. Test the email endpoint:
```bash
curl http://localhost:8080/api/email/send
```

### 4. Check logs for errors

## Configuration Reference

### Current Configuration (application.yml)

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${SPRING_MAIL_USERNAME:}
    password: ${SPRING_MAIL_PASSWORD:}
    properties:
      mail:
        smtp:
          auth: true
          connectiontimeout: 10000
          timeout: 10000
          writetimeout: 10000
          starttls:
            enable: true
            required: true
```

### Alternative: Port 465 (SSL)

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 465
    username: ${SPRING_MAIL_USERNAME:}
    password: ${SPRING_MAIL_PASSWORD:}
    properties:
      mail:
        smtp:
          auth: true
          ssl:
            enable: true
          connectiontimeout: 10000
          timeout: 10000
          writetimeout: 10000
```

## Using SendGrid (Recommended for Railway)

SendGrid is more reliable on cloud platforms.

### 1. Sign up for SendGrid
- Free tier: 100 emails/day
- https://sendgrid.com/

### 2. Get API Key
- SendGrid Dashboard → Settings → API Keys
- Create API Key with "Mail Send" permission

### 3. Update application.yml
```yaml
spring:
  mail:
    host: smtp.sendgrid.net
    port: 587
    username: apikey
    password: ${SENDGRID_API_KEY:}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

### 4. Set Railway variable
```bash
SENDGRID_API_KEY=SG.your-api-key-here
```

## Disabling Email Feature

If you don't need email functionality:

### Option 1: Don't set email variables
The app will work, but email sending will fail (which is fine if you don't use it).

### Option 2: Make email optional in code

Update `EmailService.java`:
```java
public void sendWorksheetEmail(...) {
    if (javaMailSender.getUsername() == null || javaMailSender.getUsername().isEmpty()) {
        System.out.println("Email not configured. Skipping email send.");
        return;
    }
    // ... rest of email code
}
```

## Quick Checklist

- [ ] `SPRING_MAIL_USERNAME` set in Railway
- [ ] `SPRING_MAIL_PASSWORD` set in Railway (Gmail App Password, not regular password)
- [ ] 2-Step Verification enabled on Gmail account
- [ ] App Password generated from Google Account settings
- [ ] Railway redeployed after adding variables
- [ ] Check Railway logs for specific error messages

## Still Not Working?

1. **Check Railway logs** for the exact error
2. **Try port 465** instead of 587
3. **Consider SendGrid** instead of Gmail
4. **Test locally first** to isolate the issue
5. **Verify Gmail App Password** is correct (16 characters, no spaces)

## Summary

**Most common fix:** Add these to Railway variables:
```bash
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-16-char-app-password
```

Then redeploy and test!
