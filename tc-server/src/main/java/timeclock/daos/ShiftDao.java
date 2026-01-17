package timeclock.daos;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import timeclock.models.Shift;
import timeclock.models.User;
import timeclock.models.UserShiftRow;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
            shift.setName(rs.getString("name"));

            Timestamp clockInTimestamp = rs.getTimestamp("clockIn");
            if (clockInTimestamp != null) {
                LocalDateTime clockIn = clockInTimestamp.toLocalDateTime();
                shift.setClockIn(clockIn.format(formatter));
            }

            Timestamp clockOutTimestamp = rs.getTimestamp("clockOut");
            if (clockOutTimestamp != null) {
                LocalDateTime clockOut = clockOutTimestamp.toLocalDateTime();
                shift.setClockOut(clockOut.format(formatter));
            }

            shift.setTimeWorked(rs.getString("timeWorked"));
            return shift;
        });
    }

    public void insertNewShift(User user, Timestamp clockInTimestamp) {
        String sql = "INSERT INTO Shifts (userId, name, clockIn, clockOut, timeWorked) " +
                "VALUES (:userId, :name, :clockIn, NULL, NULL)";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("userId", user.getUserId());
        params.addValue("name", user.getName());
        params.addValue("clockIn", clockInTimestamp);

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

    public void removeShift(String shiftId) {
        String deleteSql = "DELETE FROM Shifts WHERE shiftId = :shiftId";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("shiftId", shiftId);
        namedParameterJdbcTemplate.update(deleteSql, parameters);
    }

    public void updateShift(int shiftId, Timestamp clockInTimestamp, Timestamp clockOutTimestamp, String timeWorked) {
        final String sql = "UPDATE Shifts SET clockIn =:clockIn, clockOut = :clockOut, timeWorked = :timeWorked " +
                "WHERE shiftId = :shiftId";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("clockIn", clockInTimestamp);
        params.addValue("clockOut", clockOutTimestamp);
        params.addValue("timeWorked", timeWorked);
        params.addValue("shiftId", shiftId);

        namedParameterJdbcTemplate.update(sql, params);
    }

    public List<UserShiftRow> selectUserShiftRowsByDate(LocalDate date) {
        String sql = "SELECT Shifts.*, Users.phoneNumber, Users.email, Users.physicalMailingAddress " +
                "FROM Shifts " +
                "JOIN Users ON Shifts.userId = Users.userId " +
                "WHERE DATE(Shifts.clockIn) = :clockInDate";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("clockInDate", date);

        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a");
            UserShiftRow shift = new UserShiftRow();
            shift.setShiftId(rs.getInt("shiftId"));
            shift.setUserId(rs.getString("userId"));
            shift.setName(rs.getString("name"));

            // Retrieve and set additional fields from the Users table
            shift.setPhoneNumber(rs.getString("phoneNumber"));
            shift.setEmail(rs.getString("email"));
            shift.setMailingAddress(rs.getString("physicalMailingAddress"));

            Timestamp clockInTimestamp = rs.getTimestamp("clockIn");
            if (clockInTimestamp != null) {
                LocalDateTime clockIn = clockInTimestamp.toLocalDateTime();
                shift.setClockIn(clockIn.format(formatter));
            }

            Timestamp clockOutTimestamp = rs.getTimestamp("clockOut");
            if (clockOutTimestamp != null) {
                LocalDateTime clockOut = clockOutTimestamp.toLocalDateTime();
                shift.setClockOut(clockOut.format(formatter));
            }

            shift.setTimeWorked(rs.getString("timeWorked"));
            return shift;
        });
    }

    public int countShiftsByUserId(String userId) {
        String sql = "SELECT COUNT(*) FROM Shifts WHERE userId = :userId";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("userId", userId);
        Integer count = namedParameterJdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null ? count : 0;
    }

    public int deleteShiftsPriorToDate(LocalDate date) {
        String sql = "DELETE FROM Shifts WHERE DATE(clockIn) < :date";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("date", date);
        return namedParameterJdbcTemplate.update(sql, params);
    }

}