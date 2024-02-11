package timeclock.services;

import org.springframework.stereotype.Service;
import timeclock.daos.UserDao;
import timeclock.models.User;

import java.util.Comparator;
import java.util.List;

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
        String userId = userDao.insertUser(user);
        user.setUserId(userId);
    }

    public User getUserById(String userId) {
         return userDao.getUserById(userId);
    }
}