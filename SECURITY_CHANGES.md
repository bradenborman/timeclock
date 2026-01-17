# Security Changes - Credentials Moved Out of Git

## What Changed

### Before ❌
```yaml
# application-local.yml (IN GIT - BAD!)
spring:
  datasource:
    url: jdbc:mysql://caboose.proxy.rlwy.net:25228/railway
    username: root
    password: ZeCXopZwhazUTALHjvYcmzmpxUyoYElB  # EXPOSED!
```

### After ✅
```yaml
# application-local.yml (IN GIT - SAFE!)
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    # Credentials are in application-secret.yml (not in git)

# application-secret.yml (NOT IN GIT - SECURE!)
spring:
  datasource:
    url: jdbc:mysql://caboose.proxy.rlwy.net:25228/railway
    username: root
    password: ZeCXopZwhazUTALHjvYcmzmpxUyoYElB
```

## Files Created

1. **`application-secret.yml`** ❌ NOT in git
   - Contains your actual credentials
   - Already in `.gitignore`
   - Used for local development

2. **`application-secret.template.yml`** ✅ In git
   - Template with placeholders
   - Safe to commit
   - Copy and rename to use

3. **`CREDENTIALS_SETUP.md`** ✅ In git
   - Complete setup guide
   - Instructions for team members

## Files Modified

1. **`application-local.yml`**
   - Removed database credentials
   - Now just references the secret file

2. **`.gitignore`**
   - Already had `application-secret.yml` excluded ✅

## How to Use

### For You (Already Set Up)
Your `application-secret.yml` already exists with your credentials. No action needed!

```bash
# Just run as before:
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```

### For New Team Members

1. Copy the template:
```bash
cp tc-server/src/main/resources/application-secret.template.yml \
   tc-server/src/main/resources/application-secret.yml
```

2. Edit `application-secret.yml` with real credentials

3. Run the app:
```bash
./gradlew bootRun --args='--spring.profiles.active=local,secret'
```

## Production (Railway)

Railway uses **environment variables** instead of files:

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://...
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=...
SPRING_MAIL_USERNAME=...
SPRING_MAIL_PASSWORD=...
```

Set these in Railway dashboard → Variables tab.

## Verification

Check that secrets are NOT in git:

```bash
git status
# Should NOT show application-secret.yml

git ls-files | grep secret
# Should only show application-secret.template.yml
```

## What to Commit

```bash
git add tc-server/src/main/resources/application-local.yml
git add tc-server/src/main/resources/application-secret.template.yml
git add CREDENTIALS_SETUP.md
git add SECURITY_CHANGES.md
git commit -m "Security: Move credentials to application-secret.yml (not in git)"
git push
```

## Important Notes

✅ **Safe to commit:**
- `application-local.yml` (no secrets)
- `application-secret.template.yml` (template only)
- Documentation files

❌ **Never commit:**
- `application-secret.yml` (real credentials)
- Any file with actual passwords

## If You Accidentally Committed Secrets

1. Remove from git (keeps local file):
```bash
git rm --cached tc-server/src/main/resources/application-secret.yml
git commit -m "Remove secrets from git"
git push
```

2. **Immediately rotate all passwords:**
   - Change Railway database password
   - Generate new Gmail app password
   - Update your local `application-secret.yml`

3. Consider using `git filter-branch` or BFG Repo-Cleaner to remove from history

## Summary

- ✅ Credentials moved to `application-secret.yml`
- ✅ File is in `.gitignore`
- ✅ Template provided for team setup
- ✅ Documentation created
- ✅ Production uses environment variables
- ✅ No secrets in git history
