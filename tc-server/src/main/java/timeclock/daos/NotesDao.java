package timeclock.daos;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

@Repository
public class NotesDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public NotesDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public void insertNewNote(String note, Timestamp timestamp) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("note", note);
        params.addValue("timestamp", timestamp);
        String sql = "INSERT INTO Notes (value, dateSubmitted) VALUES (:note, :timestamp)";
        namedParameterJdbcTemplate.update(sql, params);
    }

}