package timeclock.utilities;


import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import timeclock.models.UserShiftRow;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class WorkSheetBuilder {

    private final XSSFWorkbook workbook;

    public WorkSheetBuilder() {
        this.workbook = new XSSFWorkbook();
    }

    public WorkSheetBuilder populateWorkbook(List<UserShiftRow> userShiftRows) {
        Sheet sheet = workbook.createSheet("Shifts Summary");
        sheet.setColumnWidth(0, 6000);
        sheet.setColumnWidth(1, 4000);

        // Create a Font for styling header cells
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setFontHeightInPoints((short) 12);

        // Create a CellStyle with the font
        CellStyle headerCellStyle = workbook.createCellStyle();
        headerCellStyle.setFont(headerFont);

        // Create a header Row
        Row headerRow = sheet.createRow(0);

        // Creating header cells and setting the header names
        String[] columns = {"Full Name", "Phone Number", "Email", "Mailing Address", "Clocked In", "Clocked Out", "Time Worked"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerCellStyle);
        }

        // Create Other rows and cells with user data
        int rowNum = 1;
        for (UserShiftRow usr : userShiftRows) {
            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(usr.getName());
            row.createCell(1).setCellValue(usr.getPhoneNumber());
            row.createCell(2).setCellValue(usr.getEmail());
            row.createCell(3).setCellValue(usr.getMailingAddress());
            row.createCell(4).setCellValue(usr.getClockIn());
            row.createCell(5).setCellValue(usr.getClockOut());
            row.createCell(6).setCellValue(usr.getTimeWorked());
        }

        // Resize all columns to fit the content size
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        return this;
    }

    public ByteArrayResource toFile() {
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            workbook.write(bos);
            return new ByteArrayResource(bos.toByteArray());
        } catch (Exception e) {
            return null;
        }
    }

}