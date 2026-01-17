# 🍬 Candy Factory Timeclock

A modern, user-friendly timeclock application built for tracking employee shifts at The Candy Factory.

## Core Features

### 🕐 Time Tracking
- **Quick Clock In/Out** - Employees select their name from an alphabetical dropdown and clock in with one click
- **Automatic Time Calculation** - System automatically calculates hours worked when clocking out
- **Real-Time Updates** - Live shift view shows who's currently working and who's clocked out
- **Shift Visibility Toggle** - Hide completed shifts to focus on active workers

### 👥 User Management
- **Yearly Verification System** - Employees verify their contact information (email, phone, address) once per year
- **Smart Onboarding** - New employees fill out a simple form with progress tracking
- **Automatic Name Formatting** - Names are automatically formatted to proper Title Case
- **Confirmation Prompts** - Prevents accidental clock-ins with a confirmation modal

### 👤 Admin Panel
- **Password Protected** - Secure admin access with password: `cherry`
- **Shift Management** - Edit clock in/out times or delete shifts as needed
- **Email Reports** - Send daily timesheet via email with one click
- **Date-Based Downloads** - Download Excel spreadsheets for any date using the calendar picker
- **Real-Time Shift View** - See all shifts for the current day with edit capabilities

### 📊 Reporting
- **Excel Spreadsheets** - Automated generation of formatted timesheets
- **Email Integration** - Daily summary emails sent automatically via cron job
- **Custom Date Exports** - Download reports for any historical date
- **Formatted Output** - Professional spreadsheets with employee names and hours worked

### 🎨 User Experience
- **Dark Mode** - Toggle between light and dark themes (persists across sessions)
- **Loading States** - Skeleton screens and spinners for better perceived performance
- **Toast Notifications** - Success messages when clocking in/out with employee name and hours worked
- **Responsive Design** - Clean, modern interface that works on desktop and tablet
- **Persistent Preferences** - "Hide Completed" toggle saves to localStorage

### 🔒 Security
- **Spring Security** - Form-based authentication protects the entire application
- **Remember Me** - 3-week persistent sessions so users don't need to re-login daily
- **Admin Verification** - Separate password protection for admin panel access
- **Database-Backed Sessions** - Sessions persist across server restarts

## Technology Stack

**Backend:**
- Spring Boot 3.4.1
- Java 21
- MySQL Database
- Spring Security
- Apache POI (Excel generation)
- JavaMail (Email reports)

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Getting Started

### Prerequisites
- Java 21
- MySQL Database
- Node.js & npm/pnpm

### Configuration

1. **Database Setup** - Create MySQL database and configure connection in `application-local.yml`

2. **Email Configuration** - Set environment variables:
   ```
   SPRING_MAIL_USERNAME=your-email@gmail.com
   SPRING_MAIL_PASSWORD=your-app-password
   ```

3. **Admin Password** - Set in `application.yml` or via environment variable:
   ```
   ADMIN_PASSWORD=🍒
   ```

### Running Locally

```bash
# Run with local and secret profiles
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```

Access the application at `http://localhost:8080`

### Login Credentials

**Application Login:**
- Username: `mike`
- Password: `root`

**Admin Panel:**
- Password: `cherry`

## Daily Operations

### For Employees
1. Navigate to "Start Shift"
2. Select your name from the dropdown
3. Confirm your identity
4. Clock out when finished from the home screen

### For Administrators
1. Access Admin Panel from home screen
2. Enter admin password
3. View/edit shifts, send reports, or download spreadsheets

## Automated Tasks

- **Daily Email Report** - Automatically sent at 5:00 PM Central Time
- **Session Cleanup** - Remember-me tokens cleaned up automatically
- **Database Initialization** - Tables created automatically on first run

## Notes

- First-time users or users who haven't verified this year will be prompted to confirm their information
- The "Hide Completed" toggle preference is saved per browser
- Dark mode preference is saved per browser
- All times are in Central Time Zone
- Spreadsheets are named with the format: `YYYY-MM-DD-timesheet.xlsx`

---

Built with ❤️ for The Candy Factory
