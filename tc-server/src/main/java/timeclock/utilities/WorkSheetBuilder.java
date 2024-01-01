package timeclock.utilities;


import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;

import java.io.ByteArrayOutputStream;

public class WorkSheetBuilder {

    private final XSSFWorkbook workbook;

    public WorkSheetBuilder() {
        this.workbook = new XSSFWorkbook();
    }

    public WorkSheetBuilder populateWorkbook() {

            Sheet sheet = workbook.createSheet("Persons");
            sheet.setColumnWidth(0, 6000);
            sheet.setColumnWidth(1, 4000);

            Row header = sheet.createRow(0);

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            XSSFFont font = workbook.createFont();
            font.setFontName("Arial");
            font.setFontHeightInPoints((short) 16);
            font.setBold(true);
            headerStyle.setFont(font);

            Cell headerCell = header.createCell(0);
            headerCell.setCellValue("Name");
            headerCell.setCellStyle(headerStyle);

            headerCell = header.createCell(1);
            headerCell.setCellValue("Age");
            headerCell.setCellStyle(headerStyle);

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