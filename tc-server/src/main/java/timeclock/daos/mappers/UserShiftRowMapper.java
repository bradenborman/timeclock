package timeclock.daos.mappers;

import org.springframework.jdbc.core.RowMapper;
import timeclock.models.UserShiftRow;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class UserShiftRowMapper implements RowMapper<UserShiftRow> {
    
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a");
    
    @Override
    public UserShiftRow mapRow(ResultSet rs, int rowNum) throws SQLException {
        UserShiftRow shift = new UserShiftRow();
        shift.setShiftId(rs.getInt("shiftId"));
        shift.setUserId(rs.getString("userId"));
        shift.setName(rs.getString("name"));

        // User fields
        shift.setPhoneNumber(rs.getString("phoneNumber"));
        shift.setEmail(rs.getString("email"));
        shift.setMailingAddress(rs.getString("physicalMailingAddress"));

        // Shift times
        Timestamp clockInTimestamp = rs.getTimestamp("clockIn");
        if (clockInTimestamp != null) {
            LocalDateTime clockIn = clockInTimestamp.toLocalDateTime();
            shift.setClockIn(clockIn.format(TIME_FORMATTER));
        }

        Timestamp clockOutTimestamp = rs.getTimestamp("clockOut");
        if (clockOutTimestamp != null) {
            LocalDateTime clockOut = clockOutTimestamp.toLocalDateTime();
            shift.setClockOut(clockOut.format(TIME_FORMATTER));
        }

        shift.setTimeWorked(rs.getString("timeWorked"));
        return shift;
    }
}
