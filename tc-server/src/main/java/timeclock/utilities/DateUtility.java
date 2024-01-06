package timeclock.utilities;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtility {

    public static Timestamp now() {
        return Timestamp.from(ZonedDateTime.now(ZoneId.of("America/Chicago")).toInstant());
    }

    public static LocalDate todayCentralTime() {
        return ZonedDateTime.now(ZoneId.of("America/Chicago")).toLocalDate();
    }


    public static String formatTodayDateForFileName() {
        LocalDate now = todayCentralTime();
        return now.format(DateTimeFormatter.ofPattern("MMM")) + getDayOfMonthSuffix(now.getDayOfMonth()) + now.format(DateTimeFormatter.ofPattern("yyyy"));
    }

    private static String getDayOfMonthSuffix(int day) {
        if (day >= 11 && day <= 13) {
            return day + "th";
        }
        switch (day % 10) {
            case 1:
                return day + "st";
            case 2:
                return day + "nd";
            case 3:
                return day + "rd";
            default:
                return day + "th";
        }
    }

}
