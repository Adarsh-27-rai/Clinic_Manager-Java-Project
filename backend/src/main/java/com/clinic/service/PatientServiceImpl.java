package com.clinic.service;

import com.clinic.dto.PatientRequest;
import com.clinic.dto.PatientResponse;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.model.Patient;
import com.clinic.model.User;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientServiceImpl(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    @Override
    public PatientResponse createPatient(PatientRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Patient patient = Patient.builder()
                .name(request.getName())
                .age(request.getAge())
                .gender(request.getGender())
                .phone(request.getPhone())
                .medicalReason(request.getMedicalReason())
                .medicines(request.getMedicines())
                .isDone(request.getIsDone() != null ? request.getIsDone() : false)
                .appointmentDate(request.getAppointmentDate())
                .build();
        
        patient.setUser(user);

        Patient saved = patientRepository.save(patient);
        return toResponse(saved);
    }

    @Override
    public List<PatientResponse> getAllPatients(Long userId) {
        return patientRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PatientResponse getPatientById(Long id, Long userId) {
        Patient patient = patientRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return toResponse(patient);
    }

    @Override
    public PatientResponse updatePatient(Long id, PatientRequest request, Long userId) {
        Patient patient = patientRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        patient.setName(request.getName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setMedicalReason(request.getMedicalReason());
        patient.setMedicines(request.getMedicines());
        patient.setIsDone(request.getIsDone() != null ? request.getIsDone() : patient.getIsDone());
        patient.setAppointmentDate(request.getAppointmentDate());

        Patient updated = patientRepository.save(patient);
        return toResponse(updated);
    }

    @Override
    public PatientResponse toggleDoneStatus(Long id, Boolean isDone, Long userId) {
        Patient patient = patientRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patient.setIsDone(isDone);
        Patient updated = patientRepository.save(patient);
        return toResponse(updated);
    }

    @Override
    public void deletePatient(Long id, Long userId) {
        Patient patient = patientRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patientRepository.delete(patient);
    }

    private PatientResponse toResponse(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .name(patient.getName())
                .age(patient.getAge())
                .gender(patient.getGender())
                .phone(patient.getPhone())
                .medicalReason(patient.getMedicalReason())
                .medicines(patient.getMedicines())
                .isDone(patient.getIsDone())
                .appointmentDate(patient.getAppointmentDate())
                .createdAt(patient.getCreatedAt())
                .build();
    }
}
