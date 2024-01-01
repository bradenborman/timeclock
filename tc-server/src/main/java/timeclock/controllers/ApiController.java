package timeclock.controllers;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.services.EmailService;
import timeclock.services.UserService;
import timeclock.services.ShiftService;
import timeclock.utilities.WorkSheetBuilder;

import java.time.LocalDate;
import java.util.List;

@RequestMapping("/api")
@RestController
public class ApiController {

    private final UserService userService;
    private final ShiftService shiftService;

    private final EmailService emailService;

    public ApiController(UserService userService, ShiftService shiftService, EmailService emailService) {
        this.userService = userService;
        this.shiftService = shiftService;
        this.emailService = emailService;
    }

    @GetMapping("/email")
    public ResponseEntity<Void> email() {
        ByteArrayResource document = new WorkSheetBuilder().populateWorkbook().toFile();
        emailService.sendWorksheetEmail(document);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/user")
    public ResponseEntity<Void> createUser(@RequestBody User user) {
        userService.insertUser(user);
       return ResponseEntity.ok().build();
    }

    @GetMapping("/shifts")
    public ResponseEntity<List<Shift>> getAllShiftsStartedByDate(@RequestParam String date) {
        return ResponseEntity.ok(shiftService.findShiftsByDate(LocalDate.parse(date)));
    }

    @PostMapping("/clockout")
    public ResponseEntity<String> clockOut(@RequestBody Shift shift) {
            return ResponseEntity.ok().body(
                    shiftService.clockOutShift(shift)
            );
    }

}