package timeclock.models;

public class Shift {

    private int shiftId;
    private String userId;
    private String name;
    private String clockIn;
    private String clockOut;
    private String timeWorked;

    public int getShiftId() {
        return shiftId;
    }

    public void setShiftId(int shiftId) {
        this.shiftId = shiftId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClockIn() {
        return clockIn;
    }

    public void setClockIn(String clockIn) {
        this.clockIn = clockIn;
    }

    public String getClockOut() {
        return clockOut;
    }

    public void setClockOut(String clockOut) {
        this.clockOut = clockOut;
    }

    public String getTimeWorked() {
        return timeWorked;
    }

    public void setTimeWorked(String timeWorked) {
        this.timeWorked = timeWorked;
    }

}