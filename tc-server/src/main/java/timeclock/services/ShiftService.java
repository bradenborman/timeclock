package timeclock.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import timeclock.daos.ShiftDao;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.models.UserShiftRow;
import timeclock.utilities.DateUtility;
import timeclock.utilities.TimeCalculatorUtility;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
        logger.info("{} is clocking out. Worked [{} - {}]", shift.getName(), shift.getClockIn(), shift.getClockOut());
        String timeWorked = TimeCalculatorUtility.calculateTimeSpent(shift.getClockIn(), shift.getClockOut());
        shiftDao.clockOutShift(shift.getShiftId(), DateUtility.now(), timeWorked);
        return timeWorked;
    }

    public void startNewShift(User user) {
        shiftDao.insertNewShift(user, DateUtility.now());
    }


    public void removeShift(String shiftId) {
        logger.info("Deleting shift: {}", shiftId);
        shiftDao.removeShift(shiftId);
    }

    public void updateShift(LocalDateTime clockInTimeUpdated, LocalDateTime clockOutTimeUpdated, String timeWorked, int shiftId) {
        shiftDao.updateShift(
                shiftId,
                Timestamp.valueOf(clockInTimeUpdated),
                clockOutTimeUpdated != null ? Timestamp.valueOf(clockOutTimeUpdated) : null,
                timeWorked
        );
    }

    public List<UserShiftRow> retrieveUserShiftsToday() {
       return shiftDao.selectUserShiftRowsByDate(DateUtility.todayCentralTime());
    }

    public List<UserShiftRow> retrieveUserShifts(LocalDate localDate) {
        return shiftDao.selectUserShiftRowsByDate(localDate);
    }

    public boolean hasShifts(String userId) {
        return shiftDao.countShiftsByUserId(userId) > 0;
    }

    public int deleteShiftsPriorToDate(LocalDate date) {
        logger.info("Deleting all shifts prior to: {}", date);
        return shiftDao.deleteShiftsPriorToDate(date);
    }
}