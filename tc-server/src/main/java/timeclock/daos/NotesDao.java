package timeclock.daos;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import timeclock.models.Note;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

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

    public List<Note> selectAllNotes() {
        String sql = "SELECT * FROM Notes";
        return namedParameterJdbcTemplate.query(sql, new RowMapper<Note>() {
            @Override
            public Note mapRow(ResultSet rs, int rowNum) throws SQLException {
                Note note = new Note();
                note.setValue(rs.getString("value"));
                note.setInsertTime(rs.getTimestamp("dateSubmitted"));
                return note;
            }
        });
    }

    public List<Note> selectAllNotes(LocalDate today) {
        Timestamp startOfDay = Timestamp.valueOf(today.atStartOfDay());
        Timestamp startOfNextDay = Timestamp.valueOf(today.plusDays(1).atStartOfDay());

        String sql = "SELECT * FROM Notes WHERE dateSubmitted >= :startOfDay AND dateSubmitted < :startOfNextDay";

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("startOfDay", startOfDay);
        params.addValue("startOfNextDay", startOfNextDay);

        return namedParameterJdbcTemplate.query(sql, params, new RowMapper<Note>() {
            @Override
            public Note mapRow(ResultSet rs, int rowNum) throws SQLException {
                Note note = new Note();
                note.setValue(rs.getString("value"));
                note.setInsertTime(rs.getTimestamp("dateSubmitted"));
                return note;
            }
        });
    }


}