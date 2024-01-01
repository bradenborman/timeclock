package timeclock.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.services.TimeclockService;

import java.util.List;

@RequestMapping("/api")
@RestController
public class ApiController {

    private final TimeclockService timeclockService;

    public ApiController(TimeclockService timeclockService) {
        this.timeclockService = timeclockService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(timeclockService.getAllUsers());
    }

    @PostMapping("/user")
    public ResponseEntity<Void> createUser(@RequestBody User user) {
        timeclockService.insertUser(user);
       return ResponseEntity.ok().build();
    }

    @PostMapping("/clockin")
    public ResponseEntity<Void> clockIn(@RequestParam String userId) {
        timeclockService.clockIn(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/shifts")
    public ResponseEntity<List<Shift>> getAllShiftsStartedByDate(@RequestParam String date) {
        return ResponseEntity.ok(timeclockService.findShiftsByDate(date));
    }

    @PostMapping("/clockout")
    public ResponseEntity<String> clockOut(@RequestBody Shift shift) {
            return ResponseEntity.ok().body(
                    timeclockService.clockOutShift(shift)
            );
    }

}