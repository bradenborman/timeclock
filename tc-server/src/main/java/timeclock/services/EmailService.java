package timeclock.services;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import timeclock.models.Note;
import timeclock.utilities.DateUtility;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.List;

@Service
public class EmailService {

    private final JavaMailSenderImpl javaMailSender;

    public EmailService(JavaMailSenderImpl javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendWorksheetEmail(ByteArrayResource file, List<Note> notes) {
        String[] receivingAddress =  new String[] {
                "bradenborman00@gmail.com",
                "amyatkinson19@hotmail.com",
                "mike@thecandyfactory.biz"
        };

        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(receivingAddress);
            helper.setSubject(DateUtility.formatTodayDateForFileName() + " Timesheet");

            // Build the email body
            StringBuilder emailBody = new StringBuilder("<p>Attached is today's Time-clock</p>" +
                    "<h4>Notes:</h4>" +
                    "<ul>");
            for (Note note : notes) {
                emailBody.append("<li>").append(note.getValue()).append("</li>");
            }
            emailBody.append("</ul>");

            helper.setText(emailBody.toString(), true);
            helper.addAttachment(DateUtility.formatTodayDateForFileName() + "-timesheet.xlsx", file);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email!", e);
        }

        javaMailSender.send(message);
    }

}