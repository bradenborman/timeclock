package timeclock.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import timeclock.daos.UserDao;
import timeclock.models.User;

import java.util.List;

@Service
public class UserService {

    private final UserDao userDao;
    private final ShiftService shiftService;

    public UserService(UserDao userDao, ShiftService shiftService) {
        this.userDao = userDao;
        this.shiftService = shiftService;
    }

    public List<User> getAllUsers() {
        return userDao.selectAllUsers();
    }

    @Transactional
    public void insertUser(User user) {
        String userId = userDao.insertUser(user);
        user.setUserId(userId);
        shiftService.startNewShift(user);
    }

}