package timeclock.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import timeclock.models.Note;
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
    public ResponseEntity<List<Shift>> getAllShiftsStartedByDate() {
        return ResponseEntity.ok(timeclockService.findShiftsByDate());
    }

    @PostMapping("/clockout")
    public ResponseEntity<String> clockOut(@RequestBody Shift shift) {
            return ResponseEntity.ok().body(timeclockService.clockOutShift(shift));
    }

    @PostMapping("/note")
    public ResponseEntity<Void> note(@RequestBody String note) {
        timeclockService.recordNewNote(note);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/notes")
    public ResponseEntity<List<Note>> notes() {
        return ResponseEntity.ok(timeclockService.findAllNotes());
    }

    @DeleteMapping("/shift/{shiftId}")
    public ResponseEntity<Void> removeShift(@PathVariable String shiftId) {
        timeclockService.removeShift(shiftId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/shift")
    public ResponseEntity<String> updateShift(@RequestBody Shift shift) {
        String timeWorked = timeclockService.updateShift(shift);
        return ResponseEntity.ok(timeWorked);
    }

}