package timeclock.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import timeclock.daos.ShiftDao;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.utilities.TimeCalculatorUtility;

import java.sql.Timestamp;
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
        shiftDao.clockOutShift(shift.getShiftId(), now(), timeWorked);
        return timeWorked;
    }

    public void startNewShift(User user) {
        shiftDao.insertNewShift(user, now());
    }

    private Timestamp now() {
        return Timestamp.from(ZonedDateTime.now(ZoneId.of("America/Chicago")).toInstant());
    }

}