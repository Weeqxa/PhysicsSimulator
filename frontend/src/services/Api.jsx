const API_URL = "http://localhost:8080/api/auth"; // Базовий URL мого Spring Boot API

// =========================
// Функція для реєстрації користувача
// =========================
export async function registerUser(userData) {
    try {
        // Виконуємо POST-запит на бекенд
        const response = await fetch(`${API_URL}/register`, {
            method: "POST", // HTTP метод
            headers: {
                "Content-Type": "application/json", // Вказуємо, що надсилаємо JSON
            },
            body: JSON.stringify(userData), // Перетворюємо об'єкт користувача у JSON
        });

        // Якщо сервер повернув код помилки (наприклад, 400)
        if (!response.ok) {
            const errorMessage = await response.text(); // отримуємо текст помилки з відповіді
            throw new Error(errorMessage); // Генеруємо виключення для catch
        }

        // Якщо все успішно, повертаємо текст відповіді (наприклад "User registered successfully.")
        return await response.text();
    } catch (error) {
        // Перехоплюємо помилки (наприклад, сервер недоступний) і передаємо їх далі
        throw error;
    }
}

// =========================
// Функція для логіну користувача
// =========================
export async function loginUser(credentials) {
    try {
        // POST-запит на бекенд для логіну
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(credentials), // Передаємо {username, password}
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage); // Генеруємо помилку, якщо логін неуспішний
        }

        // Повертаємо текст відповіді, наприклад "Logged in successfully."
        return await response.text();
    } catch (error) {
        throw error; // Проброс помилки для обробки у компоненті React
    }
}