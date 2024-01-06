package timeclock.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import timeclock.models.Note;
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
import java.util.List;


@Service
public class TimeclockService {

    private static final Logger logger = LoggerFactory.getLogger(TimeclockService.class);

    private final UserService userService;
    private final ShiftService shiftService;
    private final NoteService noteService;
    private final EmailService emailService;

    public TimeclockService(UserService userService, ShiftService shiftService, NoteService noteService, EmailService emailService) {
        this.userService = userService;
        this.shiftService = shiftService;
        this.noteService = noteService;
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

    public List<Shift> findShiftsByDate() {
        LocalDate localDate = DateUtility.todayCentralTime();
        return shiftService.findShiftsByDate(localDate);
    }

    @Transactional
    public String clockOutShift(Shift shift) {
        return shiftService.clockOutShift(shift);
    }

    public void recordNewNote(String note) {
        if(note != null && !note.isEmpty())
            noteService.recordNewNote(note);
    }

    public void removeShift(String shiftId) {
        shiftService.removeShift(shiftId);
    }

    public List<Note> findAllNotes() {
       return noteService.findAllNotes();
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
        List<UserShiftRow> userShifts = shiftService.retrieveUserShiftsToday();
        ByteArrayResource excelDocument = new WorkSheetBuilder().populateWorkbook(userShifts).toFile();
        emailService.sendWorksheetEmail(excelDocument);
        logger.info("Daily Summary Email sent");
    }


}