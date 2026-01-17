package timeclock.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import timeclock.utilities.DateUtility;

import java.time.LocalDate;
import java.util.List;
import java.util.Properties;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;


@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSenderImpl javaMailSender;

    public EmailService(JavaMailSenderImpl javaMailSender) {
        this.javaMailSender = javaMailSender;
        logMailConfiguration();
    }

    private void logMailConfiguration() {
        logger.info("=== EMAIL CONFIGURATION ===");
        logger.info("Host: {}", javaMailSender.getHost());
        logger.info("Port: {}", javaMailSender.getPort());
        logger.info("Username: {}", javaMailSender.getUsername());
        logger.info("Password set: {}", javaMailSender.getPassword() != null && !javaMailSender.getPassword().isEmpty());
        logger.info("Password length: {}", javaMailSender.getPassword() != null ? javaMailSender.getPassword().length() : 0);
        logger.info("Protocol: {}", javaMailSender.getProtocol());
        logger.info("Default Encoding: {}", javaMailSender.getDefaultEncoding());
        
        Properties props = javaMailSender.getJavaMailProperties();
        logger.info("=== MAIL PROPERTIES ===");
        props.forEach((key, value) -> logger.info("{} = {}", key, value));
        logger.info("=========================");
    }

    public void sendWorksheetEmail(ByteArrayResource file, List<String> notes, LocalDate dateOfQuery) {
        logger.info("=== STARTING EMAIL SEND ===");
        logger.info("Date of query: {}", dateOfQuery);
        logger.info("Number of notes: {}", notes.size());
        logger.info("File size: {} bytes", file.contentLength());
        
        String formattedDateString = DateUtility.formatDateForFileName(dateOfQuery);
        logger.info("Formatted date string: {}", formattedDateString);

        String receivingAddress = "bradenborman00@gmail.com";
        logger.info("Recipient: {}", receivingAddress);

        try {
            logger.info("Creating MIME message...");
            MimeMessage message = javaMailSender.createMimeMessage();
            logger.info("MIME message created successfully");
            
            logger.info("Creating MimeMessageHelper...");
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            logger.info("MimeMessageHelper created successfully");
            
            logger.info("Setting recipient to: {}", receivingAddress);
            helper.setTo(receivingAddress);
            
            String subject = formattedDateString + " Timesheet";
            logger.info("Setting subject to: {}", subject);
            helper.setSubject(subject);

            // Build the email body
            logger.info("Building email body...");
            StringBuilder emailBody = new StringBuilder("<p>Attached is today's Time-clock</p>");
            if (!notes.isEmpty()) {
                emailBody.append("<h4>Notes:</h4><ul>");
                for (String note : notes) {
                    emailBody.append("<li>").append(note).append("</li>");
                }
                emailBody.append("</ul>");
            }
            logger.info("Email body built, length: {} characters", emailBody.length());

            logger.info("Setting email text...");
            helper.setText(emailBody.toString(), true);
            
            String attachmentName = formattedDateString + "-timesheet.xlsx";
            logger.info("Adding attachment: {}", attachmentName);
            helper.addAttachment(attachmentName, file);
            logger.info("Attachment added successfully");
            
            logger.info("=== ATTEMPTING TO SEND EMAIL ===");
            logger.info("Mail server: {}:{}", javaMailSender.getHost(), javaMailSender.getPort());
            logger.info("Using username: {}", javaMailSender.getUsername());
            logger.info("TLS enabled: {}", javaMailSender.getJavaMailProperties().getProperty("mail.smtp.starttls.enable"));
            logger.info("Auth enabled: {}", javaMailSender.getJavaMailProperties().getProperty("mail.smtp.auth"));
            
            long startTime = System.currentTimeMillis();
            javaMailSender.send(message);
            long endTime = System.currentTimeMillis();
            
            logger.info("=== EMAIL SENT SUCCESSFULLY ===");
            logger.info("Time taken: {} ms", (endTime - startTime));
            
        } catch (MessagingException e) {
            logger.error("=== MESSAGING EXCEPTION ===");
            logger.error("Error message: {}", e.getMessage());
            logger.error("Exception class: {}", e.getClass().getName());
            logger.error("Stack trace:", e);
            if (e.getCause() != null) {
                logger.error("Cause: {}", e.getCause().getMessage());
                logger.error("Cause class: {}", e.getCause().getClass().getName());
            }
            throw new RuntimeException("Failed to create email message: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("=== GENERAL EXCEPTION ===");
            logger.error("Error message: {}", e.getMessage());
            logger.error("Exception class: {}", e.getClass().getName());
            logger.error("Stack trace:", e);
            if (e.getCause() != null) {
                logger.error("Cause: {}", e.getCause().getMessage());
                logger.error("Cause class: {}", e.getCause().getClass().getName());
                if (e.getCause().getCause() != null) {
                    logger.error("Root cause: {}", e.getCause().getCause().getMessage());
                    logger.error("Root cause class: {}", e.getCause().getCause().getClass().getName());
                }
            }
            
            // Log environment variables (without exposing passwords)
            logger.error("=== ENVIRONMENT CHECK ===");
            logger.error("SPRING_MAIL_USERNAME env var set: {}", System.getenv("SPRING_MAIL_USERNAME") != null);
            logger.error("SPRING_MAIL_PASSWORD env var set: {}", System.getenv("SPRING_MAIL_PASSWORD") != null);
            logger.error("Configured username: {}", javaMailSender.getUsername());
            logger.error("Configured password set: {}", javaMailSender.getPassword() != null && !javaMailSender.getPassword().isEmpty());
            
            throw new RuntimeException("Failed to send email. Check that SPRING_MAIL_USERNAME and SPRING_MAIL_PASSWORD are set. Error: " + e.getMessage(), e);
        }
    }

}