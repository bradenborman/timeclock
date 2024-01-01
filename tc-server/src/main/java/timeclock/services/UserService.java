package timeclock.services;

import org.springframework.stereotype.Service;
import timeclock.daos.UserDao;
import timeclock.models.User;

import java.util.List;

@Service
public class UserService {

    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public List<User> getAllUsers() {
        return userDao.selectAllUsers();
    }

    public void insertUser(User user) {
        userDao.insertUser(user);
    }

}