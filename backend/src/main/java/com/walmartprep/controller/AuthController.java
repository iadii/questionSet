package com.walmartprep.controller;

import com.walmartprep.dto.AuthResponse;
import com.walmartprep.dto.LoginRequest;
import com.walmartprep.dto.RegisterRequest;
import com.walmartprep.entity.User;
import com.walmartprep.repository.UserRepository;
import com.walmartprep.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import java.security.Key;

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

        return ResponseEntity.ok(com.walmartprep.dto.ApiResponse.success(null, "User registered successfully! Please log in."));
    }

    @PostMapping("/login")
    public ResponseEntity<com.walmartprep.dto.ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User Not Found."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(com.walmartprep.dto.ApiResponse.error("Invalid password."));
        }

        String accessToken = jwtUtils.generateJwtToken(user.getEmail());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(false) // Use true in production
                .path("/")
                .maxAge(3600) // 1 hour
                .build();
                
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(604800) // 7 days
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .targetCompany(user.getTargetCompany())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(com.walmartprep.dto.ApiResponse.success(authResponse, "Login successful"));
    }
    
    @Value("${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String jwtSecret;

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    @PostMapping("/refresh")
    public ResponseEntity<com.walmartprep.dto.ApiResponse<String>> refreshToken(HttpServletRequest request) {
        String refreshToken = jwtUtils.getRefreshTokenFromCookies(request);
        
        if (refreshToken != null) {
            try {
                io.jsonwebtoken.Claims claims = Jwts.parser().verifyWith((javax.crypto.SecretKey) key()).build()
                        .parseSignedClaims(refreshToken).getPayload();
                        
                if ("refresh".equals(claims.get("type", String.class))) {
                    String email = claims.getSubject();
                    
                    String newAccessToken = jwtUtils.generateJwtToken(email);
                    String newRefreshToken = jwtUtils.generateRefreshToken(email);
                    
                    ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                            .httpOnly(true).path("/").maxAge(3600).build();
                    ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newRefreshToken)
                            .httpOnly(true).path("/").maxAge(604800).build();
                            
                    return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                            .body(com.walmartprep.dto.ApiResponse.success(null, "Token refreshed successfully"));
                }
            } catch (Exception e) {
                // Invalid token
            }
        }
        
        return ResponseEntity.status(401).body(com.walmartprep.dto.ApiResponse.error("Refresh token invalid or expired"));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<com.walmartprep.dto.ApiResponse<String>> logout() {
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true).path("/").maxAge(0).build();
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true).path("/").maxAge(0).build();
                
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(com.walmartprep.dto.ApiResponse.success(null, "Logged out successfully"));
    }
}
