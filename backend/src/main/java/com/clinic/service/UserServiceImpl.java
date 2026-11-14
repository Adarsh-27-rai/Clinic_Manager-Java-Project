package com.clinic.service;

import com.clinic.dto.AuthRequest;
import com.clinic.dto.AuthResponse;
import com.clinic.model.User;
import com.clinic.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
        User user = new User(request.getUsername(), hashedPassword);
        User savedUser = userRepository.save(user);

        return new AuthResponse("User registered successfully", savedUser.getId(), savedUser.getUsername());
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (BCrypt.checkpw(request.getPassword(), user.getPassword())) {
                return new AuthResponse("Login successful", user.getId(), user.getUsername());
            }
        }
        throw new RuntimeException("Invalid username or password");
    }
}
