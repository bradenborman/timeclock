# Email Debugging Guide

## Changes Made

Added comprehensive logging to debug email sending issues on Railway.

### Files Modified
1. `tc-server/src/main/java/timeclock/services/EmailService.java`
2. `tc-server/src/main/java/timeclock/controllers/ApiController.java`
3. `tc-server/src/main/resources/application.yml`

## What the Logging Shows

### On Application Startup
The EmailService constructor will log:
```
=== EMAIL CONFIGURATION ===
Host: smtp.gmail.com
Port: 587
Username: [your email]
Password set: true/false
Password length: [number]
Protocol: smtp
Default Encoding: UTF-8
=== MAIL PROPERTIES ===
mail.smtp.auth = true
mail.smtp.starttls.enable = true
mail.smtp.starttls.required = true
mail.smtp.connectiontimeout = 10000
mail.smtp.timeout = 10000
mail.smtp.writetimeout = 10000
mail.debug = true
=========================
```

### When Email Send is Triggered
```
=== EMAIL SEND REQUEST RECEIVED ===
Endpoint: GET /api/email/send
Timestamp: [timestamp]
Calling timeclockService.sendDailySummaryEmail()...

=== STARTING EMAIL SEND ===
Date of query: [date]
Number of notes: [count]
File size: [bytes] bytes
Formatted date string: [date]
Recipient: bradenborman00@gmail.com
Creating MIME message...
MIME message created successfully
Creating MimeMessageHelper...
MimeMessageHelper created successfully
Setting recipient to: bradenborman00@gmail.com
Setting subject to: [date] Timesheet
Building email body...
Email body built, length: [chars] characters
Setting email text...
Adding attachment: [filename]
Attachment added successfully

=== ATTEMPTING TO SEND EMAIL ===
Mail server: smtp.gmail.com:587
Using username: [email]
TLS enabled: true
Auth enabled: true
[JavaMail debug output will appear here]

=== EMAIL SENT SUCCESSFULLY ===
Time taken: [ms] ms
```

### On Error
```
=== GENERAL EXCEPTION ===
Error message: [error]
Exception class: [class name]
Stack trace: [full trace]
Cause: [cause message]
Cause class: [cause class]
Root cause: [root cause]
Root cause class: [root cause class]

=== ENVIRONMENT CHECK ===
SPRING_MAIL_USERNAME env var set: true/false
SPRING_MAIL_PASSWORD env var set: true/false
Configured username: [email or empty]
Configured password set: true/false
```

## Common Issues and Solutions

### Issue 1: Connection Timeout
**Symptom**: `Couldn't connect to host, port: smtp.gmail.com, 587; timeout 10000`

**Possible Causes**:
1. Railway firewall blocking outbound SMTP connections
2. Gmail blocking the connection
3. Network issues

**Solutions**:
- Check if Railway allows SMTP on port 587
- Try port 465 with SSL instead of TLS
- Verify Gmail "Less secure app access" or use App Password

### Issue 2: Authentication Failed
**Symptom**: `535 Authentication failed`

**Possible Causes**:
1. Wrong username/password
2. Gmail requires App Password (not regular password)
3. 2FA enabled without App Password

**Solutions**:
1. Generate Gmail App Password: https://myaccount.google.com/apppasswords
2. Set `SPRING_MAIL_PASSWORD` to the App Password (16 characters, no spaces)
3. Verify `SPRING_MAIL_USERNAME` is the full email address

### Issue 3: Environment Variables Not Set
**Symptom**: `Configured username:` (empty) or `Password set: false`

**Solutions**:
1. In Railway dashboard, go to Variables tab
2. Add `SPRING_MAIL_USERNAME` = your Gmail address
3. Add `SPRING_MAIL_PASSWORD` = your Gmail App Password
4. Redeploy the application

### Issue 4: Fontconfig Error
**Symptom**: `Fontconfig error: Cannot load default config file`

**This is NOT the problem!** This is a warning from Apache POI (Excel generation) and doesn't affect email sending. The real error is below this warning.

## Testing Locally

1. Create `application-secret.yml` with:
```yaml
spring:
  mail:
    username: your-email@gmail.com
    password: your-app-password
```

2. Run:
```bash
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```

3. Open admin panel and click "Send Email"

4. Check console for detailed logs

## Testing on Railway

1. Set environment variables in Railway dashboard
2. Deploy the application
3. Trigger email send from admin panel
4. Check Railway logs for detailed output

## Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification if not already enabled
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)"
5. Enter "Railway Timeclock"
6. Click "Generate"
7. Copy the 16-character password (no spaces)
8. Use this as `SPRING_MAIL_PASSWORD`

## Alternative: Use SendGrid or Mailgun

If Gmail continues to have issues, consider using a transactional email service:

### SendGrid
```yaml
spring:
  mail:
    host: smtp.sendgrid.net
    port: 587
    username: apikey
    password: ${SENDGRID_API_KEY}
```

### Mailgun
```yaml
spring:
  mail:
    host: smtp.mailgun.org
    port: 587
    username: ${MAILGUN_USERNAME}
    password: ${MAILGUN_PASSWORD}
```

## Disabling Debug Logging

Once the issue is resolved, set in `application.yml`:
```yaml
spring:
  mail:
    properties:
      mail:
        debug: false

logging:
  level:
    timeclock.services.EmailService: INFO
    org.springframework.mail: INFO
```
