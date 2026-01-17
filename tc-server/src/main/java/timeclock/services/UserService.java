package timeclock.services;

import org.springframework.stereotype.Service;
import timeclock.daos.HiddenUserDao;
import timeclock.daos.UserDao;
import timeclock.models.User;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;

@Service
public class UserService {

    private final UserDao userDao;
    private final HiddenUserDao hiddenUserDao;

    public UserService(UserDao userDao, HiddenUserDao hiddenUserDao) {
        this.userDao = userDao;
        this.hiddenUserDao = hiddenUserDao;
    }

    public List<User> getAllUsers() {
        List<User> users = userDao.selectAllUsers();
        List<String> hiddenUserIds = hiddenUserDao.getAllHiddenUserIds();
        
        // Filter out hidden users
        users = users.stream()
                .filter(user -> !hiddenUserIds.contains(user.getUserId()))
                .sorted(Comparator.comparing(User::getName))
                .collect(Collectors.toList());
        
        return users;
    }

    public List<User> getAllUsersIncludingHidden() {
        List<User> users = userDao.selectAllUsers();
        List<String> hiddenUserIds = hiddenUserDao.getAllHiddenUserIds();
        
        // Mark hidden users
        users.forEach(user -> user.setHidden(hiddenUserIds.contains(user.getUserId())));
        
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

    public void updateUser(User user) {
        // Format name to proper Title Case before updating
        if (user.getName() != null && !user.getName().isEmpty()) {
            user.setName(formatNameToTitleCase(user.getName()));
        }
        
        userDao.updateUser(user);
    }

    public User getUserById(String userId) {
         return userDao.getUserById(userId);
    }

    public boolean isUserHidden(String userId) {
        return hiddenUserDao.isUserHidden(userId);
    }

    public void hideUser(String userId, String hiddenBy, String reason) {
        hiddenUserDao.hideUser(userId, hiddenBy, reason);
    }

    public void unhideUser(String userId) {
        hiddenUserDao.unhideUser(userId);
    }
    
    public void deleteUser(String userId) {
        userDao.deleteUser(userId);
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