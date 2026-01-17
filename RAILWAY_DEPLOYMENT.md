# Railway Deployment Guide

## Prerequisites
- Railway account (https://railway.app)
- MySQL database provisioned on Railway

## Setup Steps

### 1. Create New Project on Railway
```bash
# Install Railway CLI (optional)
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### 2. Add MySQL Database
- In Railway dashboard, click "New" → "Database" → "Add MySQL"
- Railway will automatically create a MySQL instance

### 3. Configure Environment Variables

Set these in Railway dashboard under "Variables":

**Database Configuration:**
```
SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}?useSSL=false&serverTimezone=America/Chicago
SPRING_DATASOURCE_USERNAME=${MYSQLUSER}
SPRING_DATASOURCE_PASSWORD=${MYSQLPASSWORD}
```

**Email Configuration:**
```
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
EMAIL_RECIPIENT=recipient@example.com
```

**Java Options (optional):**
```
JAVA_OPTS=-Xmx512m -Xms256m
```

### 4. Railway Auto-Variables
Railway automatically provides:
- `PORT` - Application port (Spring Boot will use this)
- `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD` - When MySQL is added

### 5. Deploy

**Option A: GitHub Integration (Recommended)**
1. Push code to GitHub
2. Connect repository in Railway dashboard
3. Railway auto-deploys on push

**Option B: Railway CLI**
```bash
railway up
```

### 6. Database Setup
After first deployment, run your SQL schema:
```bash
# Connect to Railway MySQL
railway connect mysql

# Or use the connection string from Railway dashboard
mysql -h [host] -u [user] -p[password] [database] < sql/create-tables.txt
```

## Key Differences from Heroku

| Feature | Heroku | Railway |
|---------|--------|---------|
| Config | Procfile | railway.json or nixpacks.toml |
| Database | Add-ons | Built-in services |
| Port | $PORT | $PORT (same) |
| Build | Buildpacks | Nixpacks (auto-detect) |
| Pricing | Dyno hours | Usage-based |

## Monitoring

- View logs: Railway dashboard → Deployments → Logs
- Or via CLI: `railway logs`

## Troubleshooting

**Build fails:**
- Check that Gradle wrapper has execute permissions
- Verify Java version compatibility

**Database connection fails:**
- Verify environment variables are set correctly
- Check that MySQL service is running
- Ensure timezone parameter is in connection string

**Port binding issues:**
- Railway automatically sets PORT variable
- Spring Boot should pick it up via `-Dserver.port=$PORT`

## Cost Optimization

Railway offers:
- $5/month hobby plan with $5 credit
- Pay-as-you-go for usage beyond credit
- Free trial with limited hours

Consider:
- Using sleep mode for non-production environments
- Optimizing Java heap size with JAVA_OPTS
