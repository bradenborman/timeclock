package timeclock.services;

import org.springframework.stereotype.Service;
import timeclock.daos.NotesDao;
import timeclock.models.Note;
import timeclock.utilities.DateUtility;

import java.time.LocalDate;
import java.util.List;

@Service
public class NoteService {

    private final NotesDao notesDao;

    public NoteService(NotesDao notesDao) {
        this.notesDao = notesDao;
    }

    public void recordNewNote(String note) {
        notesDao.insertNewNote(note, DateUtility.now());
    }

    public List<Note> findAllNotes() {
        return notesDao.selectAllNotes();
    }

    public List<Note> findAllNotes(LocalDate today) {
        return notesDao.selectAllNotes(today);
    }
}