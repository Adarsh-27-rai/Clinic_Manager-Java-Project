package com.clinic.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class PatientRequest {

    @NotBlank(message = "Patient name is required")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be 0 or more")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Medical reason is required")
    private String medicalReason;

    private String medicines;

    private Boolean isDone = false;

    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;

    public PatientRequest() {}

    public String getName() { return name; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public String getPhone() { return phone; }
    public String getMedicalReason() { return medicalReason; }
    public String getMedicines() { return medicines; }
    public Boolean getIsDone() { return isDone; }
    public LocalDate getAppointmentDate() { return appointmentDate; }

    public void setName(String name) { this.name = name; }
    public void setAge(Integer age) { this.age = age; }
    public void setGender(String gender) { this.gender = gender; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setMedicalReason(String medicalReason) { this.medicalReason = medicalReason; }
    public void setMedicines(String medicines) { this.medicines = medicines; }
    public void setIsDone(Boolean isDone) { this.isDone = isDone; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
}
