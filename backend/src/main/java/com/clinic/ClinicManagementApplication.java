package com.clinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ClinicManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClinicManagementApplication.class, args);
        System.out.println("🏥 Clinic Management System is running on http://localhost:8080");
    }
}
