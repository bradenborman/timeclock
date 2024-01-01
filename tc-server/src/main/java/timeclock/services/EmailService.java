package timeclock.services;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSenderImpl javaMailSender;

    public EmailService(JavaMailSenderImpl javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendWorksheetEmail(ByteArrayResource file) {
        String[] receivingAddress =  new String[] {"bradenborman00@gmail.com",
//                "amyatkinson19@hotmail.com", "mike@thecandyfactory.biz"
        };
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(receivingAddress);
            helper.setSubject("Today's Timesheet [DRY RUN]");
            helper.setText("<p>This is just a test to verify email account connection</p>", true);
            helper.addAttachment("todaystimesheet.xlsx", file);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email!", e);
        }

        javaMailSender.send(message);
    }

}