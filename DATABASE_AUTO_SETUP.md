# Automatic Database Table Creation

## Overview
The application now automatically creates database tables on startup if they don't exist.

## How It Works

### 1. Schema File
Located at: `tc-server/src/main/resources/schema.sql`

Contains:
```sql
CREATE TABLE IF NOT EXISTS Users (...)
CREATE TABLE IF NOT EXISTS Shifts (...)
CREATE TABLE IF NOT EXISTS Notes (...)
```

### 2. Spring Boot Configuration
In `application.yml`:
```yaml
spring:
  sql:
    init:
      mode: always
      continue-on-error: false
```

**Settings:**
- `mode: always` - Runs schema.sql on every startup
- `continue-on-error: false` - Stops if SQL fails (safer)

### 3. Execution Order
1. Spring Boot starts
2. Connects to database (HikariCP)
3. Executes `schema.sql` automatically
4. Tables created if they don't exist
5. Application starts normally

## Tables Created

### Users
- Primary key: `userId` (VARCHAR 36)
- Stores employee information
- Referenced by Shifts table

### Shifts
- Primary key: `shiftId` (INT AUTO_INCREMENT)
- Foreign key: `userId` → Users
- Tracks clock in/out times

### Notes
- Primary key: `id` (INT AUTO_INCREMENT)
- Stores daily notes/observations

## Benefits

✅ **No Manual Setup**: Tables created automatically
✅ **Idempotent**: Safe to run multiple times (IF NOT EXISTS)
✅ **Version Control**: Schema in git, not manual SQL files
✅ **Railway Ready**: Works on first deployment
✅ **Local Dev**: Works with local database too

## Deployment

### Railway
1. Push code to GitHub
2. Railway builds and deploys
3. On first startup, tables are created automatically
4. Subsequent startups skip existing tables

### Local Development
```bash
./gradlew bootRun --args='--spring.profiles.active=local'
```
Tables created in Railway MySQL database automatically.

## Verification

Check logs for:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

No errors = tables created successfully!

## Troubleshooting

### "Table already exists" error
This shouldn't happen with `IF NOT EXISTS`, but if it does:
- Check `schema.sql` has `IF NOT EXISTS` clause
- Verify `continue-on-error: false` in application.yml

### Schema not executing
Check:
1. `schema.sql` is in `src/main/resources/`
2. `spring.sql.init.mode: always` is set
3. Database connection is working (check HikariCP logs)

### Want to disable auto-creation?
Change in `application.yml`:
```yaml
spring:
  sql:
    init:
      mode: never  # or 'embedded' for H2/HSQLDB only
```

## Migration from Manual Setup

**Before:**
```bash
# Had to manually run:
mysql -h host -u user -p < sql/create-tables.txt
```

**After:**
```bash
# Just start the app:
./gradlew bootRun
# Tables created automatically!
```

## Advanced: Data Initialization

Want to add default data? Create `data.sql`:

```sql
-- tc-server/src/main/resources/data.sql
INSERT IGNORE INTO Users (userId, name, email) 
VALUES ('admin-001', 'Admin User', 'admin@example.com');
```

Spring Boot will run it after `schema.sql`.

## Production Considerations

### Option 1: Keep Auto-Creation (Recommended for small apps)
- Simple, works everywhere
- Safe with `IF NOT EXISTS`
- Good for Railway, Heroku, etc.

### Option 2: Use Flyway/Liquibase (For larger apps)
Add to `build.gradle`:
```gradle
implementation 'org.flywaydb:flyway-core'
```

Then disable schema.sql:
```yaml
spring:
  sql:
    init:
      mode: never
  flyway:
    enabled: true
```

## Summary

Your database tables are now created automatically on startup! No more manual SQL execution needed. Just deploy and go! 🚀
