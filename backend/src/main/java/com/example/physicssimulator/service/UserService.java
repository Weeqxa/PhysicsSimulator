package com.example.physicssimulator.service;

import com.example.physicssimulator.entity.User;
import com.example.physicssimulator.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

// =========================
// Сервіс для роботи з користувачами
// =========================
@Service // Позначає клас як сервіс Spring (для бізнес-логіки)
public class UserService {

    private final UserRepository userRepository; // Для доступу до БД
    private final PasswordEncoder passwordEncoder; // Для хешування паролів

    // =========================
    // Конструктор з DI (Dependency Injection)
    // =========================
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // Збереження користувача
    // =========================
    public User save(User user) {
        // Хешуємо пароль перед збереженням у БД
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Зберігаємо користувача через репозиторій
        return userRepository.save(user);
    }

    // =========================
    // Пошук користувача за username
    // =========================
    public Optional<User> findByUsername(String username) {
        // Повертаємо Optional, щоб показати, що користувача може не бути
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }



}