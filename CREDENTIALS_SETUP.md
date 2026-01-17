# Credentials Setup Guide

## Overview
Sensitive credentials are stored in `application-secret.yml` which is **NOT** checked into git.

## Local Development Setup

### 1. Create Your Secret File
```bash
cd tc-server/src/main/resources
cp application-secret.yml.template application-secret.yml
```

### 2. Update With Your Credentials

Edit `application-secret.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://YOUR_HOST:PORT/railway?useSSL=false&serverTimezone=America/Chicago&allowPublicKeyRetrieval=true
    username: root
    password: YOUR_ACTUAL_PASSWORD
  mail:
    username: your-email@gmail.com
    password: your-gmail-app-password

email:
  recipient: recipient@example.com
```

### 3. Get Railway Database Credentials

From Railway dashboard:
1. Click on your **MySQL service**
2. Go to **"Connect"** tab
3. Copy the TCP Proxy details:
   - Host: `something.proxy.rlwy.net`
   - Port: `12345`
   - Password: From **Variables** tab

### 4. Get Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Go to **App Passwords**
4. Generate password for "Mail"
5. Copy the 16-character password

## Running Locally

```bash
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```

The `secret` profile loads `application-secret.yml`.

## Production (Railway) Setup

Railway uses **environment variables** instead of the secret file.

### Set These Variables in Railway:

```bash
# Database (auto-set when you add MySQL service)
SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}?useSSL=false&serverTimezone=America/Chicago
SPRING_DATASOURCE_USERNAME=${MYSQLUSER}
SPRING_DATASOURCE_PASSWORD=${MYSQLPASSWORD}

# Email
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-gmail-app-password

# Email recipient
EMAIL_RECIPIENT=recipient@example.com
```

Railway automatically replaces `${MYSQLHOST}` etc. with values from your MySQL service.

## File Structure

```
tc-server/src/main/resources/
├── application.yml                    ✅ In git - base config
├── application-local.yml              ✅ In git - local profile (no secrets)
├── application-secret.yml             ❌ NOT in git - your actual secrets
└── application-secret.yml.template    ✅ In git - template to copy
```

## Security Notes

### ✅ Safe (In Git)
- `application.yml` - Base configuration
- `application-local.yml` - Profile config without credentials
- `application-secret.yml.template` - Template with placeholders

### ❌ Never Commit (In .gitignore)
- `application-secret.yml` - Contains real passwords
- Any file with actual credentials

## Troubleshooting

### "Cannot connect to database"
Check `application-secret.yml`:
- Correct host and port from Railway
- Correct password (no extra spaces)
- `allowPublicKeyRetrieval=true` is in URL

### "Mail authentication failed"
Check `application-secret.yml`:
- Using Gmail App Password (not regular password)
- 2-Step Verification enabled on Google account
- No spaces in password

### "Profile 'secret' not found"
Make sure:
- `application-secret.yml` exists in `src/main/resources/`
- Running with `--spring.profiles.active=local,secret`

### Accidentally Committed Secrets?

If you committed `application-secret.yml`:

```bash
# Remove from git but keep local file
git rm --cached tc-server/src/main/resources/application-secret.yml
git commit -m "Remove secret file from git"
git push

# Rotate all passwords immediately!
# - Change Railway database password
# - Generate new Gmail app password
```

## Team Setup

When a new developer joins:

1. Share the Railway MySQL connection details securely (Slack DM, 1Password, etc.)
2. They copy `application-secret.yml.template` to `application-secret.yml`
3. They fill in the credentials
4. They can now run locally!

## CI/CD

For automated builds/tests, use environment variables:

```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://..."
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="..."
./gradlew test
```

Spring Boot automatically picks up environment variables that match property names.

## Summary

- ✅ Secrets in `application-secret.yml` (local dev)
- ✅ Secrets in environment variables (Railway production)
- ✅ Template in git for easy setup
- ✅ Real secrets never committed
- ✅ `.gitignore` protects you
