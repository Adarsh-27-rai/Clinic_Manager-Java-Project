package com.clinic.service;

import com.clinic.dto.PatientRequest;
import com.clinic.dto.PatientResponse;

import java.util.List;

public interface PatientService {

    PatientResponse createPatient(PatientRequest request, Long userId);

    List<PatientResponse> getAllPatients(Long userId);

    PatientResponse getPatientById(Long id, Long userId);

    PatientResponse updatePatient(Long id, PatientRequest request, Long userId);

    PatientResponse toggleDoneStatus(Long id, Boolean isDone, Long userId);

    void deletePatient(Long id, Long userId);
}
