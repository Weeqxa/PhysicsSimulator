package com.example.physicssimulator.controller;

import com.example.physicssimulator.dto.UpdateUserProfileDto;
import com.example.physicssimulator.dto.UserProfileDto;
import com.example.physicssimulator.entity.User;
import com.example.physicssimulator.repository.UserRepository;
import com.example.physicssimulator.service.JwtService;
import com.example.physicssimulator.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;

    private static final String AVATAR_DIR = "uploads/avatars/";
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
    );

    private final Pattern emailPattern = Pattern.compile(
            "^[\\w-.]+@[\\w-]+\\.[a-z]{2,}$",
            Pattern.CASE_INSENSITIVE
    );

    public UserController(JwtService jwtService, UserService userService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Файл порожній");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            return ResponseEntity.badRequest().body("Дозволені лише JPG, PNG, WEBP");
        }

        try {
            Files.createDirectories(Paths.get(AVATAR_DIR));

            String oldAvatarUrl = user.getAvatarUrl();

            String originalName = file.getOriginalFilename();
            String extension = getExtension(originalName);
            String filename = UUID.randomUUID() + (extension.isBlank() ? "" : "." + extension);

            Path newFilePath = Paths.get(AVATAR_DIR, filename);
            Files.copy(file.getInputStream(), newFilePath, StandardCopyOption.REPLACE_EXISTING);

            String newAvatarUrl = "/uploads/avatars/" + filename;
            user.setAvatarUrl(newAvatarUrl);
            userRepository.save(user);

            deleteOldAvatar(oldAvatarUrl);

            return ResponseEntity.ok(newAvatarUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Не вдалося завантажити аватар");
        }
    }

    @GetMapping("/me")
    public UserProfileDto getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtService.extractUsername(token);

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileDto(
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getBio(),
                user.getAvatarUrl()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateUserProfileDto dto
    ) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtService.extractUsername(token);

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.name == null || dto.name.isBlank()) {
            return ResponseEntity.badRequest().body("Name is required");
        }

        if (dto.email == null || dto.email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (!emailPattern.matcher(dto.email).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        var existingUserByEmail = userService.findByEmail(dto.email);
        if (existingUserByEmail.isPresent()
                && !existingUserByEmail.get().getUsername().equals(user.getUsername())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        user.setName(dto.name.trim());
        user.setEmail(dto.email.trim());
        user.setBio(dto.bio != null ? dto.bio.trim() : null);

        userRepository.save(user);

        return ResponseEntity.ok(new UserProfileDto(
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getBio(),
                user.getAvatarUrl()
        ));
    }

    private void deleteOldAvatar(String oldAvatarUrl) {
        if (oldAvatarUrl == null || oldAvatarUrl.isBlank()) {
            return;
        }

        if (!oldAvatarUrl.startsWith("/uploads/avatars/")) {
            return;
        }

        try {
            String oldFilename = oldAvatarUrl.replace("/uploads/avatars/", "");
            Path oldFilePath = Paths.get(AVATAR_DIR, oldFilename);
            Files.deleteIfExists(oldFilePath);
        } catch (IOException e) {
            System.err.println("Не вдалося видалити стару аватарку: " + oldAvatarUrl);
            e.printStackTrace();
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}