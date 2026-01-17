# Email Logging Added ✅

## Summary
Added comprehensive debug logging throughout the email sending process to diagnose Railway connection issues.

## Changes Made

### 1. EmailService.java
- Added SLF4J Logger
- Logs email configuration on startup (host, port, username, password status, all mail properties)
- Logs every step of email creation (MIME message, helper, recipient, subject, body, attachment)
- Logs connection attempt details (server, port, username, TLS/auth settings)
- Logs success with timing
- Logs detailed error information (exception class, message, cause, root cause)
- Logs environment variable status on error

### 2. ApiController.java
- Added logging to `/api/email/send` endpoint
- Logs when request is received
- Logs when service method is called
- Logs success or failure

### 3. application.yml
- Enabled `mail.debug: true` for JavaMail verbose output
- Added logging levels:
  - `timeclock.services.EmailService: DEBUG`
  - `org.springframework.mail: DEBUG`
  - `jakarta.mail: DEBUG`
  - `com.sun.mail: DEBUG`

## What You'll See in Logs

### On Startup
```
=== EMAIL CONFIGURATION ===
Host: smtp.gmail.com
Port: 587
Username: [your-email]
Password set: true
Password length: 16
Protocol: smtp
=== MAIL PROPERTIES ===
[all mail properties listed]
```

### When Sending Email
```
=== EMAIL SEND REQUEST RECEIVED ===
=== STARTING EMAIL SEND ===
[detailed step-by-step progress]
=== ATTEMPTING TO SEND EMAIL ===
[JavaMail debug output]
=== EMAIL SENT SUCCESSFULLY ===
Time taken: [ms] ms
```

### On Error
```
=== GENERAL EXCEPTION ===
Error message: [detailed error]
Exception class: [class]
Stack trace: [full trace]
Cause: [cause]
Root cause: [root cause]
=== ENVIRONMENT CHECK ===
SPRING_MAIL_USERNAME env var set: true/false
SPRING_MAIL_PASSWORD env var set: true/false
```

## Next Steps

1. **Deploy to Railway** with these changes
2. **Check startup logs** for email configuration
3. **Trigger email send** from admin panel
4. **Review logs** to see exactly where it fails
5. **Follow EMAIL_DEBUG_GUIDE.md** for solutions

## Key Things to Look For

1. **Is username set?** Should be `bradenborman00@gmail.com`
2. **Is password set?** Should show `Password set: true` and `Password length: 16`
3. **Where does it fail?** Look for the last successful log before error
4. **What's the root cause?** Check the "Root cause" in error logs

## Common Issues Revealed by Logs

### Username/Password Not Set
```
Username: 
Password set: false
```
→ Add `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD` to Railway

### Connection Timeout
```
Couldn't connect to host, port: smtp.gmail.com, 587
```
→ Railway may block SMTP, or Gmail blocking connection

### Authentication Failed
```
535 Authentication failed
```
→ Wrong password or need Gmail App Password

## Disabling Verbose Logging Later

Once issue is resolved, in `application.yml`:
```yaml
spring:
  mail:
    properties:
      mail:
        debug: false

logging:
  level:
    timeclock.services.EmailService: INFO
```

## Files to Review
- `EMAIL_DEBUG_GUIDE.md` - Comprehensive debugging guide
- `RAILWAY_EMAIL_CHECKLIST.md` - Step-by-step checklist for Railway
- `EMAIL_TROUBLESHOOTING.md` - Original troubleshooting doc (still relevant)
