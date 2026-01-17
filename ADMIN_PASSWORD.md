# Admin Password Configuration

## Overview
The admin password is now configured in `application.yml` and validated by the backend API.

## Configuration

### Local Development
Edit `tc-server/src/main/resources/application.yml`:

```yaml
admin:
  password: cherry
```

**Default password:** `cherry`

### Production (Railway)
Set as an environment variable:

```bash
ADMIN_PASSWORD=your-secure-password
```

In Railway dashboard:
1. Go to your app service
2. Click **"Variables"** tab
3. Add new variable:
   - Name: `ADMIN_PASSWORD`
   - Value: `your-secure-password`

## How It Works

### Backend
New API endpoint: `POST /api/admin/validate`

**Request:**
```json
{
  "password": "cherry"
}
```

**Response:**
```json
{
  "valid": true
}
```

### Frontend
The admin page now calls the backend to validate the password instead of checking it in JavaScript.

**Before (Insecure):**
```typescript
if (password === 'cherry') {  // ❌ Password visible in frontend code
    setIsAuthenticated(true);
}
```

**After (Secure):**
```typescript
axios.post('/api/admin/validate', { password })
    .then(response => {
        if (response.data.valid) {
            setIsAuthenticated(true);
        }
    });
```

## Security Improvements

✅ **Password not in frontend code** - Can't be seen by viewing source
✅ **Centralized configuration** - Change password in one place
✅ **Environment-specific** - Different passwords for dev/prod
✅ **Backend validation** - Password never leaves the server

## Changing the Password

### Local Development
1. Edit `application.yml`
2. Change `admin.password: cherry` to your new password
3. Restart the server

### Production (Railway)
1. Go to Railway dashboard
2. Update `ADMIN_PASSWORD` variable
3. Railway will automatically redeploy

## Usage

1. Navigate to `/admin`
2. Enter password
3. Click "Submit"
4. If valid, you'll see the admin panel

## Recommendations

### For Production
Use a strong password:
- At least 12 characters
- Mix of letters, numbers, symbols
- Not a dictionary word

Example: `Ch3rry!2024$Secure`

### Future Enhancements
Consider adding:
- **Session management** - Stay logged in
- **Multiple admin users** - Different usernames/passwords
- **Password hashing** - Don't store plain text
- **Rate limiting** - Prevent brute force attacks
- **2FA** - Two-factor authentication
- **JWT tokens** - Stateless authentication

## Testing

### Test the API directly:
```bash
# Valid password
curl -X POST http://localhost:8080/api/admin/validate \
  -H "Content-Type: application/json" \
  -d '{"password":"cherry"}'
# Response: {"valid":true}

# Invalid password
curl -X POST http://localhost:8080/api/admin/validate \
  -H "Content-Type: application/json" \
  -d '{"password":"wrong"}'
# Response: {"valid":false}
```

## Current Limitations

⚠️ **No session management** - Must re-enter password on page refresh
⚠️ **No rate limiting** - Could be brute-forced
⚠️ **Plain text password** - Stored unencrypted in config
⚠️ **Single password** - Everyone uses the same password

These are acceptable for a small internal app but should be improved for production use.

## Summary

- ✅ Password moved from frontend to backend
- ✅ Configurable via `application.yml` or environment variable
- ✅ Default password: `cherry`
- ✅ Backend validates all login attempts
- ✅ More secure than hardcoded frontend password
