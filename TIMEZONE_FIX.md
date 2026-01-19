# Timezone Fix - Central Time (America/Chicago)

## Changes Made

### 1. Application Level (TimeclockApplication.java)
- Set JVM default timezone to `America/Chicago` on startup
- This ensures all `LocalDateTime.now()` calls use Central Time

### 2. Database Configuration (application.yml)
- Added `serverTimezone=America/Chicago` to JDBC connection URL
- Added `spring.jackson.time-zone: America/Chicago` for JSON serialization
- Ensures database timestamps are interpreted as Central Time

### 3. Deployment Configurations
- **Procfile**: Added `-Duser.timezone=America/Chicago` JVM argument
- **railway.json**: Added `-Duser.timezone=America/Chicago` to startCommand
- **nixpacks.toml**: Added `-Duser.timezone=America/Chicago` to start command

## How It Works

1. **Clock In**: When you clock in at 11:45 AM Central, it stores 11:45 AM in the database
2. **Clock Out**: When you clock out at 11:47 AM Central, it stores 11:47 AM
3. **Display**: Times are displayed as 11:45 AM and 11:47 AM (not converted to UTC)
4. **Calculation**: Time worked = 2 minutes (correct math)

## Testing

After deploying:
1. Clock in and verify the displayed time matches your local Central Time
2. Clock out and verify both times are correct
3. Refresh the page - times should remain in Central Time
4. Check the time worked calculation is accurate

## Railway Environment Variable (Optional)

You can also set this in Railway dashboard:
- Variable: `TZ`
- Value: `America/Chicago`

This provides an additional layer of timezone configuration at the OS level.
