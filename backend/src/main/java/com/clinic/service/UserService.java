package com.clinic.service;

import com.clinic.dto.AuthRequest;
import com.clinic.dto.AuthResponse;

public interface UserService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request);
}
