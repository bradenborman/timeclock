package timeclock.services;

import org.springframework.stereotype.Service;
import timeclock.models.User;

import java.util.Arrays;
import java.util.List;

@Service
public class UserService {


    public List<User> getAllUsers() {
        User user1 = new User();
        user1.setUserName("Braden Borman");
        user1.setUserId("1");

        User user2 = new User();
        user2.setUserName("Albert Teddy");
        user2.setUserId("2");


        return Arrays.asList(user1, user2);
    }
}