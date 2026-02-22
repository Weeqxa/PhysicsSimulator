package com.example.physicssimulator.controller;

import com.example.physicssimulator.entity.User;
import com.example.physicssimulator.service.JwtService;
import com.example.physicssimulator.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.regex.Pattern;

// =========================
// Контролер для авторизації користувачів
// =========================
@RestController // Позначає цей клас як REST-контролер, методи повертають JSON/текст
@RequestMapping("/api/auth") // Базовий шлях для всіх методів цього контролера
@CrossOrigin(origins = "http://localhost:5173") // Дозволяє запити з фронтенду на localhost:5173
public class AuthController {

    private final UserService userService; // Сервіс для роботи з користувачами (збереження, пошук)
    private final PasswordEncoder passwordEncoder; // Для хешування та перевірки паролів

    private final JwtService jwtService;


    // Конструктор для впровадження залежностей через Spring
    public AuthController(UserService userService,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // Regex для базової перевірки email
    // =========================
    private final Pattern emailPattern = Pattern.compile(
            "^[\\w-.]+@[\\w-]+\\.[a-z]{2,}$", Pattern.CASE_INSENSITIVE
    );

    // =========================
    // Метод реєстрації користувача
    // =========================
    @PostMapping("/register") // Приймає POST-запит на /api/auth/register
    public ResponseEntity<String> register(@RequestBody User user) {
        // -------------------------
        // Перевірка на порожні поля
        // -------------------------
        if (user.getUsername() == null || user.getUsername().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()
                || user.getName() == null || user.getName().isBlank()) {
            // Повертає 400 Bad Request з повідомленням
            return ResponseEntity.badRequest().body("All fields are required");
        }

        // -------------------------
        // Перевірка формату email
        // -------------------------
        if (!emailPattern.matcher(user.getEmail()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        // -------------------------
        // Перевірка довжини пароля
        // -------------------------
        if (user.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters");
        }

        // -------------------------
        // Перевірка чи існує користувач з таким username
        // -------------------------
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // -------------------------
        // Збереження користувача в базі
        // -------------------------
        // Тут можна додати passwordEncoder.encode(user.getPassword()), якщо ще не закодовано
        userService.save(user);

        // -------------------------
        // Повернення успішної відповіді
        // -------------------------
        return ResponseEntity.ok("User registered successfully.");
    }

    // =========================
    // Метод логіну користувача
    // =========================
    @PostMapping("/login") // Приймає POST-запит на /api/auth/login
    public ResponseEntity<String> login(@RequestBody User loginRequest) {

        // -------------------------
        // Перевірка порожніх полів
        // -------------------------
        if (loginRequest.getUsername() == null || loginRequest.getUsername().isBlank()
                || loginRequest.getPassword() == null || loginRequest.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        // -------------------------
        // Пошук користувача по username
        // -------------------------
        Optional<User> userOptional = userService.findByUsername(loginRequest.getUsername());

        // Якщо користувача немає → неправильний логін
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }

        User user = userOptional.get();

        // -------------------------
        // Перевірка пароля
        // -------------------------
        // passwordEncoder.matches() порівнює введений пароль з хешованим у базі
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }

        // -------------------------
        // Успішний логін
        // -------------------------
        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok(token);
    }

}