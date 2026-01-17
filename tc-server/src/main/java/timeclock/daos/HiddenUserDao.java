package timeclock.daos;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import timeclock.models.HiddenUser;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class HiddenUserDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public HiddenUserDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public void hideUser(String userId, String hiddenBy, String reason) {
        final String sql = "INSERT INTO HiddenUsers (userId, dateHidden, hiddenBy, reason) " +
                "VALUES (:userId, :dateHidden, :hiddenBy, :reason)";
        
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("userId", userId);
        params.addValue("dateHidden", new Timestamp(System.currentTimeMillis()));
        params.addValue("hiddenBy", hiddenBy);
        params.addValue("reason", reason);
        
        namedParameterJdbcTemplate.update(sql, params);
    }

    public boolean isUserHidden(String userId) {
        final String sql = "SELECT COUNT(*) FROM HiddenUsers WHERE userId = :userId";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("userId", userId);
        
        Integer count = namedParameterJdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public void unhideUser(String userId) {
        final String sql = "DELETE FROM HiddenUsers WHERE userId = :userId";
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("userId", userId);
        
        namedParameterJdbcTemplate.update(sql, params);
    }

    public List<String> getAllHiddenUserIds() {
        final String sql = "SELECT userId FROM HiddenUsers";
        return namedParameterJdbcTemplate.queryForList(sql, new MapSqlParameterSource(), String.class);
    }
}
