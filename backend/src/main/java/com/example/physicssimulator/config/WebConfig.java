package com.example.physicssimulator.config;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// =========================
// Конфігурація веб-шару Spring
// =========================
@Configuration // Позначає клас як конфігураційний для Spring
public class WebConfig {

    // =========================
    // Bean для налаштування CORS
    // =========================
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        // Повертаємо анонімний клас, який реалізує WebMvcConfigurer
        return new WebMvcConfigurer() {

            // Метод для налаштування CORS (Cross-Origin Resource Sharing)
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                // -------------------------
                // Дозволяємо запити до будь-яких endpoint-ів, що починаються з /api/
                // лише з фронтенду, який працює на http://localhost:5173
                // -------------------------
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173");
            }
        };
    }
}