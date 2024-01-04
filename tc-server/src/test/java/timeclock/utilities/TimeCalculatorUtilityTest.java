package timeclock.utilities;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TimeCalculatorUtilityTest {

    @Test
    void testCalculateTimeSpent() {
        LocalDateTime clockIn = LocalDateTime.of(2024, 1, 1, 9, 0, 0);  // 9:00:00 AM
        LocalDateTime clockOut = LocalDateTime.of(2024, 1, 1, 17, 30, 0); // 5:30:00 PM

        String timeSpent = TimeCalculatorUtility.calculateTimeSpent(clockIn, clockOut);
        assertEquals("8h 30m", timeSpent, "The calculated time spent should be 8 hours and 30 minutes.");
    }

}