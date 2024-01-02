package timeclock.utilities;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class DateUtility {

    public static Timestamp now() {
        return Timestamp.from(ZonedDateTime.now(ZoneId.of("America/Chicago")).toInstant());
    }
}
