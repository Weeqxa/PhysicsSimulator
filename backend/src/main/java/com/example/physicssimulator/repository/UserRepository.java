package com.example.physicssimulator.repository;

import com.example.physicssimulator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// =========================
// Репозиторій для роботи з користувачами
// =========================
public interface UserRepository extends JpaRepository<User, Long> {

    // -------------------------
    // Знаходить користувача за username
    // -------------------------
    // Optional<User> означає, що користувач може бути відсутній
    // Spring Data автоматично реалізує цей метод за назвою
    Optional<User> findByUsername(String username);
}