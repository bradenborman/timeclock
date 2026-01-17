package timeclock.models;

public class User {

    private String userId;
    private String name;
    private String phoneNumber;
    private String email;
    private String physicalMailingAddress;
    private Integer yearVerified;

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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhysicalMailingAddress() {
        return physicalMailingAddress;
    }

    public void setPhysicalMailingAddress(String physicalMailingAddress) {
        this.physicalMailingAddress = physicalMailingAddress;
    }

    public Integer getYearVerified() {
        return yearVerified;
    }

    public void setYearVerified(Integer yearVerified) {
        this.yearVerified = yearVerified;
    }
}