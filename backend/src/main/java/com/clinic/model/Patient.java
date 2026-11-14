package com.clinic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String phone;

    @Column(name = "medical_reason", columnDefinition = "TEXT")
    private String medicalReason;

    @Column(name = "medicines", columnDefinition = "TEXT")
    private String medicines;

    @Column(name = "is_done", nullable = false)
    private Boolean isDone = false;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.isDone == null) this.isDone = false;
    }

    public Patient() {}

    public Patient(Long id, String name, Integer age, String gender, String phone,
                   String medicalReason, String medicines, Boolean isDone, LocalDate appointmentDate, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.phone = phone;
        this.medicalReason = medicalReason;
        this.medicines = medicines;
        this.isDone = isDone != null ? isDone : false;
        this.appointmentDate = appointmentDate;
        this.createdAt = createdAt;
    }

    public static PatientBuilder builder() { return new PatientBuilder(); }

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
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static class PatientBuilder {
        private Long id;
        private String name;
        private Integer age;
        private String gender;
        private String phone;
        private String medicalReason;
        private String medicines;
        private Boolean isDone = false;
        private LocalDate appointmentDate;
        private LocalDateTime createdAt;

        public PatientBuilder id(Long id) { this.id = id; return this; }
        public PatientBuilder name(String name) { this.name = name; return this; }
        public PatientBuilder age(Integer age) { this.age = age; return this; }
        public PatientBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientBuilder phone(String phone) { this.phone = phone; return this; }
        public PatientBuilder medicalReason(String medicalReason) { this.medicalReason = medicalReason; return this; }
        public PatientBuilder medicines(String medicines) { this.medicines = medicines; return this; }
        public PatientBuilder isDone(Boolean isDone) { this.isDone = isDone; return this; }
        public PatientBuilder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public PatientBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Patient build() {
            return new Patient(id, name, age, gender, phone, medicalReason, medicines, isDone, appointmentDate, createdAt);
        }
    }
}
