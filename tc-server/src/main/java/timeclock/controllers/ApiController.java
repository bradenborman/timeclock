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

    @GetMapping("/users/all")
    public ResponseEntity<List<User>> getAllUsersIncludingHidden() {
        return ResponseEntity.ok(timeclockService.getAllUsersIncludingHidden());
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

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String userId) {
        Map<String, Object> result = timeclockService.safeDeleteUser(userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/user/{userId}/unhide")
    public ResponseEntity<Void> unhideUser(@PathVariable String userId) {
        timeclockService.unhideUser(userId);
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
        try {
            LocalDate localDate = LocalDate.parse(date);
            Map<String, Object> result = timeclockService.generateSpreadsheetWithMetadata(localDate);
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + result.get("filename") + "\"")
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .body((byte[]) result.get("data"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/shifts/prior-to/count")
    public ResponseEntity<Map<String, Object>> countShiftsPriorToDate(@RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        int count = timeclockService.countShiftsPriorToDate(localDate);
        
        return ResponseEntity.ok(Map.of(
                "count", count,
                "date", date
        ));
    }

    @DeleteMapping("/shifts/prior-to")
    public ResponseEntity<Map<String, Object>> deleteShiftsPriorToDate(
            @RequestParam String date,
            @RequestParam String confirmation) {
        
        if (!"delete".equalsIgnoreCase(confirmation)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Confirmation word must be 'delete'"));
        }
        
        LocalDate localDate = LocalDate.parse(date);
        int deletedCount = timeclockService.deleteShiftsPriorToDate(localDate);
        
        return ResponseEntity.ok(Map.of(
                "deletedCount", deletedCount,
                "date", date,
                "message", "Successfully deleted " + deletedCount + " shifts prior to " + date
        ));
    }
}
