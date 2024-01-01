package timeclock.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import timeclock.daos.ShiftDao;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.utilities.TimeCalculatorUtility;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class ShiftService {

    private static final Logger logger = LoggerFactory.getLogger(ShiftService.class);

    private final ShiftDao shiftDao;

    public ShiftService(ShiftDao shiftDao) {
        this.shiftDao = shiftDao;
    }

    public List<Shift> findShiftsByDate(LocalDate date) {
        return shiftDao.selectShiftsByDate(date);
    }

    public String clockOutShift(Shift shift) {
        logger.info("{} is clocking out. Worked [{} - {}]", shift.getUserName(), shift.getClockIn(), shift.getClockOut());
        String timeWorked = TimeCalculatorUtility.calculateTimeSpent(shift.getClockIn(), shift.getClockOut());
        shiftDao.clockOutShift(shift.getShiftId(), getTimestamp(shift), timeWorked);

        return timeWorked;
    }

    private static Timestamp getTimestamp(Shift shift) {
        try {
            Instant instant = new SimpleDateFormat("h:mm a").parse(shift.getClockOut()).toInstant();

            ZonedDateTime centralClockOut = instant.atZone(ZoneId.of("America/Chicago"));
            ZonedDateTime utcClockOut = centralClockOut.withZoneSameInstant(ZoneId.of("UTC"));
            return Timestamp.from(utcClockOut.toInstant());
        } catch (Exception e) {
            return Timestamp.from(Instant.now());
        }
    }

    public void startNewShift(User user) {
        shiftDao.insertNewShift(user);
    }
}