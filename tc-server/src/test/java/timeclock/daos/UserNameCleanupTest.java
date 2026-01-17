package timeclock.daos;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import timeclock.models.User;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Test to find and fix users with improper name conventions.
 * Proper name convention: "Firstname Lastname" (Title Case with single space)
 * 
 * This test will:
 * 1. Query all users from the database
 * 2. Filter users with improper name formatting
 * 3. Update their names to proper Title Case format
 */
@SpringBootTest
@ActiveProfiles({"local", "secret"})
class UserNameCleanupTest {

    @Autowired
    private UserDao userDao;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Test
    void findAndFixImproperUserNames() {
        // Step 1: Query all users from database
        List<User> allUsers = userDao.selectAllUsers();
        System.out.println("Total users in database: " + allUsers.size());

        // Step 2: Filter users with improper name conventions
        List<User> usersWithImproperNames = allUsers.stream()
                .filter(user -> !hasProperNameConvention(user.getName()))
                .collect(Collectors.toList());

        System.out.println("\n=== Users with improper name conventions ===");
        System.out.println("Found " + usersWithImproperNames.size() + " users with improper names:");
        
        if (usersWithImproperNames.isEmpty()) {
            System.out.println("✓ All users have proper name formatting!");
            return;
        }

        // Display users that need fixing
        List<NameUpdate> updates = new ArrayList<>();
        for (User user : usersWithImproperNames) {
            String oldName = user.getName();
            String newName = formatNameProperly(oldName);
            updates.add(new NameUpdate(user.getUserId(), oldName, newName));
            
            System.out.println(String.format("  User ID: %s", user.getUserId()));
            System.out.println(String.format("    Old: '%s'", oldName));
            System.out.println(String.format("    New: '%s'", newName));
            System.out.println(String.format("    Issues: %s", getNameIssues(oldName)));
            System.out.println();
        }

        // Step 3: Perform updates
        System.out.println("\n=== Performing Updates ===");
        int updatedCount = 0;
        for (NameUpdate update : updates) {
            boolean success = updateUserName(update.userId, update.newName);
            if (success) {
                updatedCount++;
                System.out.println(String.format("✓ Updated: '%s' → '%s'", update.oldName, update.newName));
            } else {
                System.out.println(String.format("✗ Failed to update: '%s'", update.oldName));
            }
        }

        System.out.println(String.format("\n=== Summary ==="));
        System.out.println(String.format("Total users checked: %d", allUsers.size()));
        System.out.println(String.format("Users with improper names: %d", usersWithImproperNames.size()));
        System.out.println(String.format("Successfully updated: %d", updatedCount));
    }

    /**
     * Checks if a name follows proper convention:
     * - Title Case (first letter of each word capitalized)
     * - Single space between first and last name
     * - No leading/trailing spaces
     * - No multiple consecutive spaces
     * - At least 2 words (first and last name)
     */
    private boolean hasProperNameConvention(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }

        // Check for leading/trailing spaces
        if (!name.equals(name.trim())) {
            return false;
        }

        // Check for multiple consecutive spaces
        if (name.contains("  ")) {
            return false;
        }

        // Split into words
        String[] words = name.split(" ");
        
        // Must have at least 2 words (first and last name)
        if (words.length < 2) {
            return false;
        }

        // Check each word is in Title Case
        for (String word : words) {
            if (word.isEmpty()) {
                return false;
            }
            
            // First letter should be uppercase
            if (!Character.isUpperCase(word.charAt(0))) {
                return false;
            }
            
            // Rest of the letters should be lowercase
            for (int i = 1; i < word.length(); i++) {
                if (!Character.isLowerCase(word.charAt(i))) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Formats a name to proper Title Case convention
     */
    private String formatNameProperly(String name) {
        if (name == null || name.trim().isEmpty()) {
            return name;
        }

        // Trim and normalize spaces
        String normalized = name.trim().replaceAll("\\s+", " ");

        // Split into words and apply Title Case
        String[] words = normalized.split(" ");
        StringBuilder formatted = new StringBuilder();

        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            if (!word.isEmpty()) {
                // Capitalize first letter, lowercase the rest
                String titleCaseWord = word.substring(0, 1).toUpperCase() + 
                                      word.substring(1).toLowerCase();
                formatted.append(titleCaseWord);
                
                if (i < words.length - 1) {
                    formatted.append(" ");
                }
            }
        }

        return formatted.toString();
    }

    /**
     * Identifies specific issues with a name
     */
    private String getNameIssues(String name) {
        List<String> issues = new ArrayList<>();

        if (name == null || name.trim().isEmpty()) {
            issues.add("empty or null");
            return String.join(", ", issues);
        }

        if (!name.equals(name.trim())) {
            issues.add("leading/trailing spaces");
        }

        if (name.contains("  ")) {
            issues.add("multiple consecutive spaces");
        }

        String[] words = name.trim().split("\\s+");
        if (words.length < 2) {
            issues.add("missing last name");
        }

        for (String word : words) {
            if (!word.isEmpty()) {
                if (!Character.isUpperCase(word.charAt(0))) {
                    issues.add("not capitalized: '" + word + "'");
                }
                
                for (int i = 1; i < word.length(); i++) {
                    if (Character.isUpperCase(word.charAt(i))) {
                        issues.add("uppercase in middle: '" + word + "'");
                        break;
                    }
                }
            }
        }

        return issues.isEmpty() ? "unknown" : String.join(", ", issues);
    }

    /**
     * Updates a user's name in the database
     */
    private boolean updateUserName(String userId, String newName) {
        try {
            final String sql = "UPDATE Users SET name = :name WHERE userId = :userId";
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("userId", userId);
            params.addValue("name", newName);
            
            int rowsAffected = namedParameterJdbcTemplate.update(sql, params);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.err.println("Error updating user " + userId + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Helper class to store update information
     */
    private static class NameUpdate {
        String userId;
        String oldName;
        String newName;

        NameUpdate(String userId, String oldName, String newName) {
            this.userId = userId;
            this.oldName = oldName;
            this.newName = newName;
        }
    }
}
