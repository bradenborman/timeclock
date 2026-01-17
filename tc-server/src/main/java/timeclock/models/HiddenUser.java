package timeclock.models;

import java.sql.Timestamp;

public class HiddenUser {
    private String userId;
    private Timestamp dateHidden;
    private String hiddenBy;
    private String reason;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Timestamp getDateHidden() {
        return dateHidden;
    }

    public void setDateHidden(Timestamp dateHidden) {
        this.dateHidden = dateHidden;
    }

    public String getHiddenBy() {
        return hiddenBy;
    }

    public void setHiddenBy(String hiddenBy) {
        this.hiddenBy = hiddenBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
