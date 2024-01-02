package timeclock.services;

import org.springframework.stereotype.Service;
import timeclock.daos.NotesDao;
import timeclock.utilities.DateUtility;

@Service
public class NoteService {

    private final NotesDao notesDao;

    public NoteService(NotesDao notesDao) {
        this.notesDao = notesDao;
    }

    public void recordNewNote(String note) {
        notesDao.insertNewNote(note, DateUtility.now());
    }

}