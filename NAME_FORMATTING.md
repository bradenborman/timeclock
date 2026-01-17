# Automatic Name Formatting

## Overview
User names are automatically formatted to proper Title Case when created.

## How It Works

When a new user is created via the API or UI, their name is automatically formatted before being saved to the database.

### Examples

| Input | Output |
|-------|--------|
| `john doe` | `John Doe` |
| `MARY SMITH` | `Mary Smith` |
| `pat o'brien` | `Pat O'Brien` |
| `jean-paul sartre` | `Jean-Paul Sartre` |
| `annie schilb` | `Annie Schilb` |
| `mary smith` | `Mary Smith` |
| `BRADEN BORMAN` | `Braden Borman` |
| `mCdonald` | `Mcdonald` |

## Features

✅ **Handles Multiple Words**: "john doe" → "John Doe"
✅ **Handles Hyphens**: "jean-paul" → "Jean-Paul"
✅ **Handles Apostrophes**: "o'brien" → "O'Brien"
✅ **Handles All Caps**: "JOHN DOE" → "John Doe"
✅ **Handles Mixed Case**: "jOhN dOe" → "John Doe"
✅ **Preserves Spacing**: Multiple spaces are normalized to single spaces

## Implementation

The formatting happens in `UserService.insertUser()` before the user is saved to the database.

```java
public void insertUser(User user) {
    // Format name to proper Title Case before inserting
    if (user.getName() != null && !user.getName().isEmpty()) {
        user.setName(formatNameToTitleCase(user.getName()));
    }
    
    String userId = userDao.insertUser(user);
    user.setUserId(userId);
}
```

## API Usage

### Creating a User

**Request:**
```json
POST /api/user
{
  "name": "john doe",
  "phoneNumber": "555-1234",
  "email": "john@example.com",
  "physicalMailingAddress": "123 Main St"
}
```

**Stored in Database:**
```json
{
  "userId": "generated-uuid",
  "name": "John Doe",  // ← Automatically formatted!
  "phoneNumber": "555-1234",
  "email": "john@example.com",
  "physicalMailingAddress": "123 Main St"
}
```

## Edge Cases Handled

### Hyphenated Names
```
Input:  "mary-jane watson"
Output: "Mary-Jane Watson"
```

### Names with Apostrophes
```
Input:  "patrick o'malley"
Output: "Patrick O'Malley"
```

### Multiple Spaces
```
Input:  "john    doe"
Output: "John Doe"
```

### Leading/Trailing Spaces
```
Input:  "  john doe  "
Output: "John Doe"
```

## Testing

You can test the formatting by creating a new user:

```bash
curl -X POST http://localhost:8080/api/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test user",
    "phoneNumber": "555-0000",
    "email": "test@example.com"
  }'
```

Then check the database or GET /api/users to see "Test User" stored.

## Existing Users

**Note:** This formatting only applies to **new users** created after this feature was added. Existing users in the database keep their original formatting.

To update existing users, you would need to:
1. Export users
2. Delete and recreate them
3. Or manually update via SQL

## Future Enhancements

Possible improvements:
- Handle special prefixes (Dr., Mr., Mrs., etc.)
- Handle suffixes (Jr., Sr., III, etc.)
- Handle "Mc" and "Mac" names specially (McDonald → McDonald)
- Configurable formatting rules

## Summary

✅ All new users automatically get properly formatted names
✅ Consistent naming across the application
✅ No manual formatting needed
✅ Works for all name types (hyphenated, apostrophes, etc.)
