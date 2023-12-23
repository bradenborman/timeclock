package timeclock.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import timeclock.models.Shift;
import timeclock.utilities.TimeCalculatorUtility;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Random;

@Service
public class ShiftService {

    private static final Logger logger = LoggerFactory.getLogger(ShiftService.class);


    public List<Shift> getAllShiftsStartedByDate(String date) {
        List<Shift> mockShifts = new ArrayList<>();

        for (int i = 1; i <= 25; i++) {
            Shift shift = new Shift();
            shift.setShiftId(i);
            shift.setUserId(i);
            shift.setUserName("Employee " + i);
            shift.setClockIn(getRandomTime());
            shift.setClockOut("");
            mockShifts.add(shift);
        }

        Shift shift = new Shift();
        shift.setShiftId(56);
        shift.setUserId(5);
        shift.setUserName("Employee 5");
        shift.setClockIn("9:00 AM");
        shift.setClockOut("");
        mockShifts.add(shift);

        return mockShifts;
    }

    public String clockOutShift(Shift shift) {
        logger.info("{} is clocking out. Worked [{} - {}]", shift.getUserName(), shift.getClockIn(), shift.getClockOut());
        //TODO -> update DB with clockout time as well as time worked
        String timeWorked = TimeCalculatorUtility.calculateTimeSpent(shift.getClockIn(), shift.getClockOut());

        return timeWorked;
    }


    @Deprecated
    public String getRandomTime() {
        Random random = new Random();

        // Create a Calendar instance and set a random hour (1-11) and minute (0-59)
        Calendar calendar = Calendar.getInstance();
        int randomHour = 1 + random.nextInt(11); // Random hour (1-11)
        int randomMinute = random.nextInt(60); // Random minute (0-59)
        calendar.set(Calendar.HOUR, randomHour);
        calendar.set(Calendar.MINUTE, randomMinute);
        calendar.set(Calendar.AM_PM, random.nextBoolean() ? Calendar.AM : Calendar.PM);

        // Format the calendar time as "H:MM AM/PM"
        SimpleDateFormat dateFormat = new SimpleDateFormat("h:mm a");
        return dateFormat.format(calendar.getTime());
    }


}