package com.walmartprep.controller;

import com.walmartprep.dto.AuthResponse;
import com.walmartprep.dto.LoginRequest;
import com.walmartprep.dto.RegisterRequest;
import com.walmartprep.entity.User;
import com.walmartprep.repository.UserRepository;
import com.walmartprep.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<com.walmartprep.dto.ApiResponse<String>> registerUser(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(com.walmartprep.dto.ApiResponse.error("Email is already in use!"));
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        userRepository.save(user);

        return ResponseEntity.ok(com.walmartprep.dto.ApiResponse.success(null, "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<com.walmartprep.dto.ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User Not Found."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(com.walmartprep.dto.ApiResponse.error("Invalid password."));
        }

        String jwt = jwtUtils.generateJwtToken(user.getEmail());

        AuthResponse authResponse = AuthResponse.builder()
                .token(jwt)
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .targetCompany(user.getTargetCompany())
                .build();

        return ResponseEntity.ok(com.walmartprep.dto.ApiResponse.success(authResponse, "Login successful"));
    }
}
