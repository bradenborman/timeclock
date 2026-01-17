# Running the DevlServer

The `DevlServer` is a development server that runs with `local` and `secret` profiles.

## Option 1: From IDE (Recommended)

### IntelliJ IDEA
1. Open `tc-server/src/test/java/timeclock/DevlServer.java`
2. Right-click on the file or the `main` method
3. Select **"Run 'DevlServer.main()'"**
4. Server starts at `http://localhost:8080`

### Eclipse
1. Open `tc-server/src/test/java/timeclock/DevlServer.java`
2. Right-click on the file
3. Select **"Run As" → "Java Application"**
4. Server starts at `http://localhost:8080`

### VS Code
1. Open `tc-server/src/test/java/timeclock/DevlServer.java`
2. Click the **"Run"** button above the `main` method
3. Server starts at `http://localhost:8080`

## Option 2: From Command Line

### Using Gradle (compiles test classes and runs)
```bash
./gradlew :tc-server:testClasses
java -cp "tc-server/build/classes/java/test;tc-server/build/classes/java/main;tc-server/build/resources/main;$(./gradlew :tc-server:printClasspath -q)" timeclock.DevlServer
```

### Simpler: Use bootRun with profiles
```bash
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```

This does the same thing as DevlServer!

## Option 3: Create a Run Configuration

### IntelliJ IDEA
1. Go to **Run → Edit Configurations**
2. Click **+** → **Application**
3. Set:
   - **Name**: DevlServer
   - **Main class**: `timeclock.DevlServer`
   - **Module**: `timeclock.tc-server.test`
   - **Working directory**: `$MODULE_WORKING_DIR$`
4. Click **OK**
5. Now you can run it from the toolbar dropdown

## What Does DevlServer Do?

It starts the Spring Boot application with:
- **Profile**: `local` (uses Railway MySQL from application-local.yml)
- **Profile**: `secret` (loads application-secret.yml if it exists)

This is useful for:
- Testing with production-like database
- Running with secret credentials not in git
- Development without modifying main application

## Profiles Explained

### `local` Profile
Configured in `tc-server/src/main/resources/application-local.yml`:
- Connects to Railway MySQL database
- Uses your development credentials

### `secret` Profile (Optional)
Create `tc-server/src/main/resources/application-secret.yml`:
```yaml
spring:
  mail:
    username: your-email@gmail.com
    password: your-app-password

email:
  recipient: recipient@example.com
```

Add to `.gitignore`:
```
**/application-secret.yml
```

## Troubleshooting

### "Cannot find symbol: class DevlServer"
Run: `./gradlew :tc-server:testClasses`

### "Database connection failed"
Check `application-local.yml` has correct Railway MySQL credentials.

### "Port 8080 already in use"
Stop other Spring Boot instances or change port:
```bash
./gradlew bootRun --args='--spring.profiles.active=local,secret --server.port=8081'
```

## Quick Start

**Easiest way:**
```bash
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```

This runs the same configuration as DevlServer without needing to compile test classes!
