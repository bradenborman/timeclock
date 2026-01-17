# Running the Development Server

## Quick Start

### Option 1: Run Everything (Recommended)
```bash
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```
This will:
1. Build the React frontend (via Gradle)
2. Start the Spring Boot backend on port 8080
3. Serve the frontend from `http://localhost:8080`

### Option 2: Frontend Only (For UI Development)
```bash
cd tc-client
pnpm run dev
```
This starts Vite dev server on `http://localhost:5173` with hot reload.

**Note**: You'll need the backend running separately for API calls to work.

### Option 3: Backend Only
```bash
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```
Backend runs on `http://localhost:8080` and serves pre-built frontend from `static/` folder.

## Development Workflow

### For UI/UX Changes (Fast Iteration)
1. Start backend: `./gradlew bootRun --args='--spring.profiles.active=local,secret'`
2. In another terminal, start frontend: `cd tc-client && pnpm run dev`
3. Open `http://localhost:5173` (Vite dev server)
4. Make changes to React components - they hot reload instantly!

### For Full Stack Testing
1. Build frontend: `cd tc-client && pnpm run build`
2. Copy build to Spring Boot: `./gradlew build`
3. Run: `./gradlew bootRun --args='--spring.profiles.active=local,secret'`
4. Open `http://localhost:8080`

## Environment Requirements

### Required Files
- `tc-server/src/main/resources/application-secret.yml` (contains database credentials)

### Required Environment Variables (for Railway deployment)
- `SPRING_MAIL_USERNAME` - Gmail address for sending emails
- `SPRING_MAIL_PASSWORD` - Gmail app password
- `ADMIN_PASSWORD` - Admin panel password (default: "cherry")

## Ports
- **Backend**: 8080
- **Frontend Dev Server**: 5173 (Vite)
- **MySQL TCP Proxy**: 25228 (Railway)

## Troubleshooting

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### Database Connection Issues
Check `application-local.yml` and `application-secret.yml` have correct Railway MySQL credentials.

### Frontend Not Loading
1. Check if `tc-server/src/main/resources/static/` has built files
2. Run `cd tc-client && pnpm run build` to rebuild
3. Restart Spring Boot server

### Hot Reload Not Working
Make sure you're accessing `http://localhost:5173` (Vite) not `http://localhost:8080` (Spring Boot).

## Performance Notes
- **Vite Dev Server**: Starts in ~242ms, hot reload in <100ms
- **Full Gradle Build**: ~30-60 seconds (includes frontend build)
- **pnpm install**: ~1-2 seconds (cached), ~57 seconds (first time)

## New UI Features to Test
1. **Gradient backgrounds** on all pages
2. **Hover effects** on buttons and links
3. **Loading spinners** when submitting forms
4. **Toast notifications** when starting shifts
5. **Smooth animations** on page load
6. **Modern form inputs** with focus states
7. **Enhanced admin panel** with better table design
