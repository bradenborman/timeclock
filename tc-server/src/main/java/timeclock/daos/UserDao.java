package timeclock.daos;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import timeclock.models.User;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Repository
public class UserDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public UserDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public String insertUser(User user) {
        String uuid = UUID.randomUUID().toString();
        user.setUserId(uuid);

        final String sql = "INSERT INTO Users (userId, name, phoneNumber, email, physicalMailingAddress) " +
                "VALUES (:userId, :name, :phoneNumber, :email, :physicalMailingAddress)";

        namedParameterJdbcTemplate.update(sql, new BeanPropertySqlParameterSource(user));

        return uuid;
    }

    public List<User> selectAllUsers() {
        return namedParameterJdbcTemplate.query("SELECT * FROM Users", (rs, rowNum) -> {
            User user = new User();
            user.setUserId(rs.getString("userId"));
            user.setName(rs.getString("name"));
            user.setPhoneNumber(rs.getString("phoneNumber"));
            user.setEmail(rs.getString("email"));
            user.setPhysicalMailingAddress(rs.getString("physicalMailingAddress"));
            return user;
        });
    }

    public User getUserById(String userId) {
        final String sql = "SELECT * FROM Users WHERE userId = :userId";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("userId", userId);
        return namedParameterJdbcTemplate.queryForObject(sql, params, new RowMapper<User>() {
            @Override
            public User mapRow(ResultSet rs, int rowNum) throws SQLException {
                User user = new User();
                user.setUserId(rs.getString("userId"));
                user.setName(rs.getString("name"));
                user.setPhoneNumber(rs.getString("phoneNumber"));
                user.setEmail(rs.getString("email"));
                user.setPhysicalMailingAddress(rs.getString("physicalMailingAddress"));
                return user;
            }
        });
    }
}