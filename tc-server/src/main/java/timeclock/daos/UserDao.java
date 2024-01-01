package timeclock.daos;

import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import timeclock.models.User;

import java.util.List;

@Repository
public class UserDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public UserDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public void insertUser(User user) {
        final String sql = "INSERT INTO Users (name, phoneNumber, email, paymentMethod) " +
                "VALUES (UUID(), :name, :phoneNumber, :email, :paymentMethod)";

        namedParameterJdbcTemplate.update(sql, new BeanPropertySqlParameterSource(user));
    }

    public List<User> selectAllUsers() {
        return namedParameterJdbcTemplate.query("SELECT * FROM Users", (rs, rowNum) -> {
            User user = new User();
            user.setUserId(rs.getString("userId"));
            user.setName(rs.getString("name"));
            user.setPhoneNumber(rs.getString("phoneNumber"));
            user.setEmail(rs.getString("email"));
            user.setPaymentMethod(rs.getString("paymentMethod"));
            return user;
        });
    }
}