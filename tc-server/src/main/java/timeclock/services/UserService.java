package timeclock.services;

import org.springframework.stereotype.Service;
import timeclock.daos.UserDao;
import timeclock.models.User;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;

@Service
public class UserService {

    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public List<User> getAllUsers() {
        List<User> users = userDao.selectAllUsers();
        users.sort(Comparator.comparing(User::getName));
        return users;
    }

    public void insertUser(User user) {
        // Format name to proper Title Case before inserting
        if (user.getName() != null && !user.getName().isEmpty()) {
            user.setName(formatNameToTitleCase(user.getName()));
        }
        
        String userId = userDao.insertUser(user);
        user.setUserId(userId);
    }

    public User getUserById(String userId) {
         return userDao.getUserById(userId);
    }
    
    /**
     * Converts a name to proper Title Case.
     * Examples:
     *   "john doe" -> "John Doe"
     *   "MARY SMITH" -> "Mary Smith"
     *   "pat o'brien" -> "Pat O'Brien"
     *   "jean-paul" -> "Jean-Paul"
     */
    private String formatNameToTitleCase(String name) {
        if (name == null || name.trim().isEmpty()) {
            return name;
        }
        
        return Arrays.stream(name.trim().split("\\s+"))
            .map(this::capitalizeWord)
            .collect(Collectors.joining(" "));
    }
    
    private String capitalizeWord(String word) {
        if (word == null || word.isEmpty()) {
            return word;
        }
        
        // Handle hyphenated names (e.g., "Jean-Paul")
        if (word.contains("-")) {
            return Arrays.stream(word.split("-"))
                .map(this::capitalizeWord)
                .collect(Collectors.joining("-"));
        }
        
        // Handle names with apostrophes (e.g., "O'Brien")
        if (word.contains("'")) {
            int apostropheIndex = word.indexOf("'");
            String beforeApostrophe = word.substring(0, apostropheIndex + 1);
            String afterApostrophe = word.substring(apostropheIndex + 1);
            
            return capitalizeFirstLetter(beforeApostrophe) + 
                   (afterApostrophe.isEmpty() ? "" : capitalizeFirstLetter(afterApostrophe));
        }
        
        // Standard capitalization
        return capitalizeFirstLetter(word);
    }
    
    private String capitalizeFirstLetter(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}