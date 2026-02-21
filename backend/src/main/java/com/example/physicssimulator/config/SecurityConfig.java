package com.example.physicssimulator.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

// =========================
// Конфігурація безпеки Spring Security
// =========================
@Configuration // Позначає клас як конфігураційний для Spring
public class SecurityConfig {

    // =========================
    // SecurityFilterChain Bean
    // =========================
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {

        http
                // -------------------------
                // Вимикаємо CSRF (Cross-Site Request Forgery) для REST API
                // -------------------------
                // Для фронтенду React з REST API часто вимикають CSRF,
                // бо інакше потрібно надсилати токен CSRF в кожному POST/PUT/DELETE запиті.
                // Використання AbstractHttpConfigurer::disable – сучасний і компактний синтаксис.
                .csrf(AbstractHttpConfigurer::disable)

                // -------------------------
                // Вмикаємо базову HTTP-авторизацію (Basic Auth)
                // -------------------------
                // Тут поки порожній, але можна додати конфігурацію basic auth
                .httpBasic(httpBasic -> {
                })

                // -------------------------
                // Налаштування доступу до URL
                // -------------------------
                .authorizeHttpRequests(auth -> auth
                        // Дозволяємо доступ до реєстрації без логіну
                        .requestMatchers("/api/auth/register").permitAll()
                        // Дозволяємо доступ до логіну без логіну
                        .requestMatchers("/api/auth/login").permitAll()
                        // Для всіх інших запитів потрібна аутентифікація
                        .anyRequest().authenticated()
                );

        // Повертаємо побудований SecurityFilterChain
        return http.build();
    }
}