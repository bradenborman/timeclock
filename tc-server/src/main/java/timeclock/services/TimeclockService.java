package timeclock.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import timeclock.models.Note;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.utilities.DateUtility;

import java.time.LocalDate;
import java.util.List;

@Service
public class TimeclockService {

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

    public List<Shift> findShiftsByDate(String date) {
//        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
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
}