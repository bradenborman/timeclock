package timeclock.utilities;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class DateUtility {

    public static Timestamp now() {
        return Timestamp.from(ZonedDateTime.now(ZoneId.of("America/Chicago")).toInstant());
    }

    public static LocalDate todayCentralTime() {
        return ZonedDateTime.now(ZoneId.of("America/Chicago")).toLocalDate();
    }

}
