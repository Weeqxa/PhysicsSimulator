package com.example.physicssimulator.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// =========================
// Конфігурація безпечних бінів для Spring Security
// =========================
@Configuration // Позначає клас як конфігураційний для Spring
public class SecurityBeansConfig {

    // =========================
    // Bean для кодування паролів
    // =========================
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCryptPasswordEncoder — сучасний і безпечний спосіб хешування паролів
        // Spring Security буде використовувати цей бін для хешування пароля при реєстрації
        // і для перевірки пароля при логіні
        return new BCryptPasswordEncoder();

    }
}