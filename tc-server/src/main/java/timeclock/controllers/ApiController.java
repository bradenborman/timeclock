package timeclock.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.services.UserService;
import timeclock.services.ShiftService;

import java.util.List;

@RequestMapping("/api")
@RestController
public class ApiController {

    private final UserService userService;
    private final ShiftService shiftService;

    public ApiController(UserService userService, ShiftService shiftService) {
        this.userService = userService;
        this.shiftService = shiftService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/shifts")
    public ResponseEntity<List<Shift>> getAllShiftsStartedByDate(@RequestParam(required = false) String date) {
        return ResponseEntity.ok(shiftService.getAllShiftsStartedByDate(date));
    }

    @PostMapping("/clockout")
    public ResponseEntity<String> clockOut(@RequestBody Shift shift) {
            return ResponseEntity.ok().body(
                    shiftService.clockOutShift(shift)
            );
    }

}