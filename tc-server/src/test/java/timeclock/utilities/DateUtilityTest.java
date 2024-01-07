package timeclock.utilities;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class DateUtilityTest {


    @Test
    void timeSpentInMinutesTest() {
       long result = DateUtility.timeSpentInMinutes("12:45 PM", "1:25 PM");
        Assertions.assertEquals(40, result);
    }

    @Test
    void timeSpentInMinutes2Test() {
        long result = DateUtility.timeSpentInMinutes("8:45 AM", "3:55 PM");
        Assertions.assertEquals(430, result);
    }

    @Test
    void timeSpentInMinutes3Test() {
        long result = DateUtility.timeSpentInMinutes("10:31 AM", "1:31 PM");
        Assertions.assertEquals(180, result);
    }

    @Test
    void testFormatTodayDateForFileName() {
        Assertions.assertDoesNotThrow(() -> {
                String result = DateUtility.formatTodayDateForFileName();
                System.out.println(result);
        });
    }


}