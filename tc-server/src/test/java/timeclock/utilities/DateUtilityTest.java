package timeclock.utilities;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class DateUtilityTest {

    @Test
    void testFormatTodayDateForFileName() {

        Assertions.assertDoesNotThrow(() -> {
                String result = DateUtility.formatTodayDateForFileName();
                System.out.println(result);
        });
    }


}