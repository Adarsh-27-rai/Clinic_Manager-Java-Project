package com.clinic.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PatientResponse {

    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private String phone;
    private String medicalReason;
    private String medicines;
    private Boolean isDone;
    private LocalDate appointmentDate;
    private LocalDateTime createdAt;

    public PatientResponse() {}

    public PatientResponse(Long id, String name, Integer age, String gender, String phone,
                           String medicalReason, String medicines, Boolean isDone, LocalDate appointmentDate, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.phone = phone;
        this.medicalReason = medicalReason;
        this.medicines = medicines;
        this.isDone = isDone;
        this.appointmentDate = appointmentDate;
        this.createdAt = createdAt;
    }

    public static PatientResponseBuilder builder() { return new PatientResponseBuilder(); }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public String getPhone() { return phone; }
    public String getMedicalReason() { return medicalReason; }
    public String getMedicines() { return medicines; }
    public Boolean getIsDone() { return isDone; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setAge(Integer age) { this.age = age; }
    public void setGender(String gender) { this.gender = gender; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setMedicalReason(String medicalReason) { this.medicalReason = medicalReason; }
    public void setMedicines(String medicines) { this.medicines = medicines; }
    public void setIsDone(Boolean isDone) { this.isDone = isDone; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class PatientResponseBuilder {
        private Long id;
        private String name;
        private Integer age;
        private String gender;
        private String phone;
        private String medicalReason;
        private String medicines;
        private Boolean isDone;
        private LocalDate appointmentDate;
        private LocalDateTime createdAt;

        public PatientResponseBuilder id(Long id) { this.id = id; return this; }
        public PatientResponseBuilder name(String name) { this.name = name; return this; }
        public PatientResponseBuilder age(Integer age) { this.age = age; return this; }
        public PatientResponseBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public PatientResponseBuilder medicalReason(String medicalReason) { this.medicalReason = medicalReason; return this; }
        public PatientResponseBuilder medicines(String medicines) { this.medicines = medicines; return this; }
        public PatientResponseBuilder isDone(Boolean isDone) { this.isDone = isDone; return this; }
        public PatientResponseBuilder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public PatientResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public PatientResponse build() {
            return new PatientResponse(id, name, age, gender, phone, medicalReason, medicines, isDone, appointmentDate, createdAt);
        }
    }
}
