package timeclock.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.models.UserShiftRow;
import timeclock.utilities.DateUtility;
import timeclock.utilities.TimeCalculatorUtility;
import timeclock.utilities.WorkSheetBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;


@Service
public class TimeclockService {

    private static final Logger logger = LoggerFactory.getLogger(TimeclockService.class);

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

    public List<User> getAllUsersIncludingHidden() {
        return userService.getAllUsersIncludingHidden();
    }

    public User getUserById(String userId) {
        return userService.getUserById(userId);
    }

    @Transactional
    public void insertUser(User user) {
       userService.insertUser(user);
       shiftService.startNewShift(user);
    }

    @Transactional
    public void updateUser(User user) {
        userService.updateUser(user);
    }

    public Map<String, Object> safeDeleteUser(String userId) {
        boolean hasShifts = shiftService.hasShifts(userId);
        
        if (!hasShifts) {
            // No shift history - safe to delete completely
            userService.deleteUser(userId);
            return Map.of(
                "deleted", true,
                "hidden", false,
                "reason", "User deleted (no shift history)",
                "shiftCount", 0
            );
        } else {
            // Has shifts - must hide to preserve data integrity
            userService.hideUser(userId, "admin", "Has shift history - soft delete");
            return Map.of(
                "deleted", false,
                "hidden", true,
                "reason", "User has shift history and was hidden to preserve data integrity",
                "shiftCount", -1
            );
        }
    }

    public void unhideUser(String userId) {
        userService.unhideUser(userId);
    }

    public int deleteShiftsPriorToDate(LocalDate date) {
        return shiftService.deleteShiftsPriorToDate(date);
    }

    @Transactional
    public void clockIn(String userId) {
        User user = userService.getUserById(userId);
        shiftService.startNewShift(user);
    }

    public List<Shift> findShiftsByDate() {
        LocalDate localDate = DateUtility.todayCentralTime();
        return shiftService.findShiftsByDate(localDate);
    }

    @Transactional
    public String clockOutShift(Shift shift) {
        return shiftService.clockOutShift(shift);
    }

    public void removeShift(String shiftId) {
        shiftService.removeShift(shiftId);
    }

    public String updateShift(Shift shift) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a");

        LocalDateTime clockInTimeUpdated = LocalDateTime.of(DateUtility.todayCentralTime(), LocalTime.parse(shift.getClockIn().trim(), formatter));
        LocalDateTime clockOutTimeUpdated = shift.getClockOut() != null && !shift.getClockOut().isEmpty() ?
                LocalDateTime.of(DateUtility.todayCentralTime(), LocalTime.parse(shift.getClockOut().trim(), formatter)) : null;

        String timeWorked = TimeCalculatorUtility.calculateTimeSpent(clockInTimeUpdated, clockOutTimeUpdated);

        shiftService.updateShift(clockInTimeUpdated, clockOutTimeUpdated, timeWorked, shift.getShiftId());

        return timeWorked;
    }


    public void sendDailySummaryEmail() {
        LocalDate today = DateUtility.todayCentralTime();
        List<UserShiftRow> userShifts = shiftService.retrieveUserShiftsToday();
        ByteArrayResource excelDocument = new WorkSheetBuilder().populateWorkbook(userShifts).toFile();
        emailService.sendWorksheetEmail(excelDocument, Collections.emptyList(), today);
        logger.info("Daily Summary Email sent");
    }

    public void sendDailySummaryEmail(LocalDate localDate) {
        List<UserShiftRow> userShifts = shiftService.retrieveUserShifts(localDate);
        ByteArrayResource excelDocument = new WorkSheetBuilder().populateWorkbook(userShifts).toFile();
        emailService.sendWorksheetEmail(excelDocument, Collections.emptyList(), localDate);
        logger.info("Summary Email sent for {}", localDate.format(DateTimeFormatter.ISO_DATE));
    }

    public byte[] generateSpreadsheet(LocalDate localDate) {
        logger.info("Generating spreadsheet for date: {}", localDate);
        List<UserShiftRow> userShifts = shiftService.retrieveUserShifts(localDate);
        ByteArrayResource excelDocument = new WorkSheetBuilder().populateWorkbook(userShifts).toFile();
        try {
            return excelDocument.getByteArray();
        } catch (Exception e) {
            logger.error("Error converting spreadsheet to byte array", e);
            throw new RuntimeException("Failed to generate spreadsheet", e);
        }
    }

    public Map<String, Object> generateSpreadsheetWithMetadata(LocalDate localDate) {
        logger.info("Generating spreadsheet with metadata for date: {}", localDate);
        List<UserShiftRow> userShifts = shiftService.retrieveUserShifts(localDate);
        
        if (userShifts.isEmpty()) {
            throw new IllegalStateException("No shifts found for date: " + localDate);
        }
        
        ByteArrayResource excelDocument = new WorkSheetBuilder().populateWorkbook(userShifts).toFile();
        byte[] data;
        try {
            data = excelDocument.getByteArray();
        } catch (Exception e) {
            logger.error("Error converting spreadsheet to byte array", e);
            throw new RuntimeException("Failed to generate spreadsheet", e);
        }
        
        String filename = DateUtility.formatDateForFileName(localDate) + "-timesheet.xlsx";
        
        return Map.of(
            "data", data,
            "filename", filename
        );
    }

    public int countShiftsPriorToDate(LocalDate date) {
        return shiftService.countShiftsPriorToDate(date);
    }


}