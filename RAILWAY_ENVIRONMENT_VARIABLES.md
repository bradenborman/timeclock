# Railway Environment Variables Setup

## Required Variables

Go to your Railway project → Your app service → **Variables** tab

### Database Variables (Auto-set by Railway MySQL)

When you add a MySQL database to your Railway project, these are automatically created:

```bash
MYSQLHOST=caboose.proxy.rlwy.net
MYSQLPORT=25228
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=ZeCXopZwhazUTALHjvYcmzmpxUyoYElB
```

### Spring Boot Database Variables (You need to add these)

Click **"+ New Variable"** and add each of these:

#### 1. Database URL
**Variable Name:**
```
SPRING_DATASOURCE_URL
```

**Value:**
```
jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&serverTimezone=America/Chicago&allowPublicKeyRetrieval=true
```

Railway will automatically replace `${{MySQL.MYSQLHOST}}` etc. with the actual values from your MySQL service.

#### 2. Database Username
**Variable Name:**
```
SPRING_DATASOURCE_USERNAME
```

**Value:**
```
${{MySQL.MYSQLUSER}}
```

#### 3. Database Password
**Variable Name:**
```
SPRING_DATASOURCE_PASSWORD
```

**Value:**
```
${{MySQL.MYSQLPASSWORD}}
```

### Email Variables (You need to add these)

#### 4. Email Username
**Variable Name:**
```
SPRING_MAIL_USERNAME
```

**Value:**
```
your-email@gmail.com
```
Replace with your actual Gmail address.

#### 5. Email Password
**Variable Name:**
```
SPRING_MAIL_PASSWORD
```

**Value:**
```
your-gmail-app-password
```
Replace with your Gmail App Password (16 characters, no spaces).

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App Passwords"
4. Generate password for "Mail"
5. Copy the 16-character password

#### 6. Email Recipient (Optional)
**Variable Name:**
```
EMAIL_RECIPIENT
```

**Value:**
```
recipient@example.com
```
Replace with the email address that should receive daily reports.

## Quick Copy-Paste Format

Here's the format for easy copy-paste into Railway:

```bash
# Database (use Railway's reference syntax)
SPRING_DATASOURCE_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&serverTimezone=America/Chicago&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQLUSER}}
SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQLPASSWORD}}

# Email (REQUIRED - replace with your actual values)
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-gmail-app-password

# Admin password (optional, defaults to 'cherry')
ADMIN_PASSWORD=cherry
```

**⚠️ IMPORTANT:** Without `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD`, the email functionality will fail with a timeout error!

## Step-by-Step in Railway Dashboard

### 1. Add MySQL Service (if not already added)
- Click **"+ New"**
- Select **"Database"** → **"Add MySQL"**
- Wait for it to provision

### 2. Add Variables to Your App Service
- Click on your **app service** (not the MySQL service)
- Go to **"Variables"** tab
- Click **"+ New Variable"**
- Add each variable one by one

### 3. Use Railway's Variable References
Railway's `${{MySQL.VARIABLENAME}}` syntax automatically pulls values from your MySQL service. This is better than hardcoding because:
- ✅ Automatically updates if MySQL credentials change
- ✅ Works across environments
- ✅ More secure

### 4. Redeploy
After adding variables:
- Railway will automatically redeploy
- Or click **"Redeploy"** in the Deployments tab

## Verification

Check the deployment logs for:

```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
Tomcat started on port XXXX (http)
Started TimeclockApplication in X.XXX seconds
```

If you see these, the database connection worked!

## Troubleshooting

### "Cannot connect to database"
- Check that MySQL service is running
- Verify `SPRING_DATASOURCE_URL` uses `${{MySQL.MYSQLHOST}}` syntax
- Check for typos in variable names (they're case-sensitive!)

### "Authentication failed"
- Verify `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD` are set
- Make sure they reference the MySQL service: `${{MySQL.MYSQLUSER}}`

### "Mail authentication failed"
- Using Gmail App Password (not regular password)?
- 2-Step Verification enabled?
- No spaces in the password?

### Variables not taking effect
- Click **"Redeploy"** after adding variables
- Check the **"Deployments"** tab for logs

## Security Notes

✅ **Good:**
- Variables are encrypted in Railway
- Not visible in logs
- Can be different per environment

❌ **Don't:**
- Commit these values to git
- Share them in public channels
- Use regular Gmail password (use App Password)

## Local vs Production

| Environment | Configuration |
|-------------|---------------|
| **Local** | `application-secret.yml` file |
| **Railway** | Environment variables |

Both work the same way - Spring Boot reads from either source!

## Summary

1. ✅ Add MySQL service to Railway (if not done)
2. ✅ Add 6 environment variables to your app service
3. ✅ Use `${{MySQL.VARIABLENAME}}` for database vars
4. ✅ Use actual values for email vars
5. ✅ Redeploy and check logs

Your app will now connect to the database and send emails! 🚀
