package timeclock.daos.mappers;

import org.springframework.jdbc.core.RowMapper;
import timeclock.models.User;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<User> {
    
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setUserId(rs.getString("userId"));
        user.setName(rs.getString("name"));
        user.setPhoneNumber(rs.getString("phoneNumber"));
        user.setEmail(rs.getString("email"));
        user.setPhysicalMailingAddress(rs.getString("physicalMailingAddress"));
        user.setYearVerified(rs.getObject("yearVerified", Integer.class));
        return user;
    }
}
