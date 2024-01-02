package timeclock.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import timeclock.models.Shift;
import timeclock.models.User;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TimeclockService {

    private final UserService userService;
    private final ShiftService shiftService;
    private final EmailService emailService;

    public TimeclockService(UserService userService, ShiftService shiftService, EmailService emailService) {
        this.userService = userService;
        this.shiftService = shiftService;
        this.emailService = emailService;
    }

    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @Transactional
    public void insertUser(User user) {
       userService.insertUser(user);
       shiftService.startNewShift(user);
    }

    @Transactional
    public void clockIn(String userId) {
        User user = userService.getUserById(userId);
        shiftService.startNewShift(user);
    }

    public List<Shift> findShiftsByDate(String date) {
        // Parse the date normally first
        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
        ZonedDateTime utcDateTime = localDate.atStartOfDay(ZoneId.of("UTC"));
        ZonedDateTime centralDateTime = utcDateTime.withZoneSameInstant(ZoneId.of("America/Chicago"));
        LocalDate centralDate = centralDateTime.toLocalDate();
        return shiftService.findShiftsByDate(centralDate);
    }

    @Transactional
    public String clockOutShift(Shift shift) {
        return shiftService.clockOutShift(shift);
    }
}