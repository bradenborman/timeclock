package timeclock.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import timeclock.models.Note;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.services.TimeclockService;

import java.util.List;
import java.util.Map;

@RequestMapping("/api")
@RestController
public class ApiController {

    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);
    private final TimeclockService timeclockService;
    
    @Value("${admin.password}")
    private String adminPassword;

    public ApiController(TimeclockService timeclockService) {
        this.timeclockService = timeclockService;
    }

    @PostMapping("/admin/validate")
    public ResponseEntity<Map<String, Boolean>> validateAdminPassword(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        boolean isValid = adminPassword.equals(password);
        return ResponseEntity.ok(Map.of("valid", isValid));
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


    @GetMapping("/email/send")
    public ResponseEntity<Void> sendEmail() {
        logger.info("=== EMAIL SEND REQUEST RECEIVED ===");
        logger.info("Endpoint: GET /api/email/send");
        logger.info("Timestamp: {}", System.currentTimeMillis());
        
        try {
            logger.info("Calling timeclockService.sendDailySummaryEmail()...");
            timeclockService.sendDailySummaryEmail();
            logger.info("=== EMAIL SEND COMPLETED SUCCESSFULLY ===");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("=== EMAIL SEND FAILED IN CONTROLLER ===");
            logger.error("Error: {}", e.getMessage());
            logger.error("Exception:", e);
            throw e;
        }
    }

}