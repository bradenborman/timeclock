package timeclock.daos;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import timeclock.models.Shift;
import timeclock.models.User;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class ShiftDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public ShiftDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public List<Shift> selectShiftsByDate(LocalDate date) {
        String sql = "SELECT * FROM Shifts WHERE DATE(clockIn) = :clockInDate";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("clockInDate", date);

        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a");

            Shift shift = new Shift();
            shift.setShiftId(rs.getInt("shiftId"));
            shift.setUserId(rs.getString("userId"));
            shift.setUserName(rs.getString("name"));

            // Define the zone IDs for UTC and Central Time
            ZoneId utcZoneId = ZoneId.of("UTC");
            ZoneId centralZoneId = ZoneId.of("America/Chicago");

            // Convert clockIn from UTC to Central Time
            Timestamp clockInTimestamp = rs.getTimestamp("clockIn");
            if (clockInTimestamp != null) {
                LocalDateTime utcClockIn = clockInTimestamp.toLocalDateTime();
                ZonedDateTime centralClockIn = utcClockIn.atZone(utcZoneId).withZoneSameInstant(centralZoneId);
                shift.setClockIn(centralClockIn.format(formatter));
            }

            // Convert clockOut from UTC to Central Time
            Timestamp clockOutTimestamp = rs.getTimestamp("clockOut");
            if (clockOutTimestamp != null) {
                LocalDateTime utcClockOut = clockOutTimestamp.toLocalDateTime();
                ZonedDateTime centralClockOut = utcClockOut.atZone(utcZoneId).withZoneSameInstant(centralZoneId);
                shift.setClockOut(centralClockOut.format(formatter));
            }

            shift.setTimeWorked(rs.getString("timeWorked"));
            return shift;
        });
    }

    public void insertNewShift(User user) {
        String sql = "INSERT INTO Shifts (userId, name, clockIn, clockOut, timeWorked) " +
                "VALUES (:userId, :name, CURRENT_TIMESTAMP, NULL, NULL)";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("userId", user.getUserId());
        params.addValue("name", user.getName());

        namedParameterJdbcTemplate.update(sql, params);
    }

    public void clockOutShift(int shiftId, Timestamp clockOutTimestamp, String timeWorked) {
        final String sql = "UPDATE Shifts SET clockOut = :clockOut, timeWorked = :timeWorked WHERE shiftId = :shiftId";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("clockOut", clockOutTimestamp);
        params.addValue("timeWorked", timeWorked);
        params.addValue("shiftId", shiftId);

        namedParameterJdbcTemplate.update(sql, params);
    }
}