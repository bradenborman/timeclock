package timeclock.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.services.AdminService;
import timeclock.services.TimeclockService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RequestMapping("/api")
@RestController
public class ApiController {

    private final TimeclockService timeclockService;
    private final AdminService adminService;

    public ApiController(TimeclockService timeclockService, AdminService adminService) {
        this.timeclockService = timeclockService;
        this.adminService = adminService;
    }

    @PostMapping("/admin/validate")
    public ResponseEntity<Map<String, Boolean>> validateAdminPassword(@RequestBody Map<String, String> request) {
        boolean isValid = adminService.validatePassword(request.get("password"));
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(timeclockService.getAllUsers());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        return ResponseEntity.ok(timeclockService.getUserById(userId));
    }

    @PostMapping("/user")
    public ResponseEntity<Void> createUser(@RequestBody User user) {
        timeclockService.insertUser(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user")
    public ResponseEntity<Void> updateUser(@RequestBody User user) {
        timeclockService.updateUser(user);
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
        return ResponseEntity.ok(timeclockService.clockOutShift(shift));
    }

    @DeleteMapping("/shift/{shiftId}")
    public ResponseEntity<Void> removeShift(@PathVariable String shiftId) {
        timeclockService.removeShift(shiftId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/shift")
    public ResponseEntity<String> updateShift(@RequestBody Shift shift) {
        return ResponseEntity.ok(timeclockService.updateShift(shift));
    }

    @GetMapping("/email/send")
    public ResponseEntity<Void> sendEmail() {
        timeclockService.sendDailySummaryEmail();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/spreadsheet/download")
    public ResponseEntity<byte[]> downloadSpreadsheet(@RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        Map<String, Object> result = timeclockService.generateSpreadsheetWithMetadata(localDate);
        
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + result.get("filename") + "\"")
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body((byte[]) result.get("data"));
    }
}
