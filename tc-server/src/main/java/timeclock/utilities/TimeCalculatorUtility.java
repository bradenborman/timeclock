package timeclock.utilities;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;

public class TimeCalculatorUtility {

    public static String calculateTimeSpent(String startTime, String endTime) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("h:mm a");
        try {
            Date start = dateFormat.parse(startTime);
            Date end = dateFormat.parse(endTime);

            // Calculate the time difference in milliseconds
            long difference = end.getTime() - start.getTime();
            if (difference < 0) {
                // If the end time is before the start time, assume it's the next day
                difference += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
            }

            // Convert the difference back into hours and minutes
            long diffHours = difference / (60 * 60 * 1000);
            long diffMinutes = (difference / (60 * 1000)) % 60;

            return String.format("%dh %02dm", diffHours, diffMinutes);
        } catch (ParseException e) {
            e.printStackTrace();
            return "Invalid time format";
        }
    }

    public static String calculateTimeSpent(LocalDateTime clockInTimeUpdated, LocalDateTime clockOutTimeUpdated) {
        if(clockOutTimeUpdated == null)
            return "";

        if(clockInTimeUpdated.isBefore(clockOutTimeUpdated)) {
            Duration duration = Duration.between(clockInTimeUpdated, clockOutTimeUpdated);
            long diffHours = duration.toHours();
            long diffMinutes = duration.toMinutes() % 60;
            return String.format("%dh %02dm", diffHours, diffMinutes);
        }

        throw new RuntimeException("Invalid - Clock out before clock in");
    }
}