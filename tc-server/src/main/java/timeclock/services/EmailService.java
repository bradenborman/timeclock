package timeclock.services;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import timeclock.models.Note;
import timeclock.utilities.DateUtility;

import java.time.LocalDate;
import java.util.List;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;


@Service
public class EmailService {

    private final JavaMailSenderImpl javaMailSender;

    public EmailService(JavaMailSenderImpl javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendWorksheetEmail(ByteArrayResource file, List<Note> notes, LocalDate dateOfQuery) {
        String formattedDateString = DateUtility.formatDateForFileName(dateOfQuery);

        String receivingAddress = "bradenborman00@gmail.com";

        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(receivingAddress);
            helper.setSubject(formattedDateString + " Timesheet");

            // Build the email body
            StringBuilder emailBody = new StringBuilder("<p>Attached is today's Time-clock</p>" +
                    "<h4>Notes:</h4>" +
                    "<ul>");
            for (Note note : notes) {
                emailBody.append("<li>").append(note.getValue()).append("</li>");
            }
            emailBody.append("</ul>");

            helper.setText(emailBody.toString(), true);
            helper.addAttachment(formattedDateString + "-timesheet.xlsx", file);
            
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to create email message: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email. Check that SPRING_MAIL_USERNAME and SPRING_MAIL_PASSWORD are set. Error: " + e.getMessage(), e);
        }
    }

}