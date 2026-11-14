package com.clinic.controller;

import com.clinic.dto.PatientRequest;
import com.clinic.dto.PatientResponse;
import com.clinic.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody PatientRequest request) {
        PatientResponse response = patientService.createPatient(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PatientResponse>> getAllPatients(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(patientService.getAllPatients(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getPatientById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientResponse> updatePatient(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody PatientRequest request) {
        return ResponseEntity.ok(patientService.updatePatient(id, request, userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PatientResponse> toggleStatus(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        Boolean isDone = body.get("isDone");
        return ResponseEntity.ok(patientService.toggleDoneStatus(id, isDone, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        patientService.deletePatient(id, userId);
        return ResponseEntity.noContent().build();
    }
}
