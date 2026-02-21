import {useState} from "react";
import {useNavigate} from "react-router-dom"; // хук для програмної навігації
import {registerUser} from "../services/api"; // функція для реєстрації через бекенд
import "../css/authorizationStyle.css"; // стилі для сторінки

export default function Register() {
    // -------------------------
    // Станові змінні
    // -------------------------
    const [username, setUsername] = useState(""); // значення поля username
    const [password, setPassword] = useState(""); // значення поля password
    const [name, setName] = useState("");         // значення поля full name
    const [email, setEmail] = useState("");       // значення поля email
    const [message, setMessage] = useState("");   // повідомлення про успіх або помилку

    const navigate = useNavigate(); // створюємо навігатор для редиректів

    // -------------------------
    // Обробник сабміту форми
    // -------------------------
    const handleSubmit = async (e) => {
        e.preventDefault(); // зупиняємо стандартну поведінку форми
        setMessage("");     // очищаємо попередні повідомлення

        try {
            // Виконуємо запит на бекенд для реєстрації користувача
            const result = await registerUser({username, password, name, email});

            // Відображаємо повідомлення від сервера
            setMessage(result);

            // -------------------------
            // Редирект на сторінку логіну після успішної реєстрації
            // -------------------------
            // Трохи затримуємо, щоб користувач побачив повідомлення
            if (result.toLowerCase().includes("success")) {
                setTimeout(() => {
                    navigate("/login"); // редирект на логін
                }, 1000);
            }
        } catch (error) {
            // Перехоплюємо помилки (наприклад, сервер недоступний або username зайнятий)
            setMessage(error.message);
        }
    };

    return (
        <div>
            {/* =========================
                ВЕРХНЯ ПАНЕЛЬ
                ========================= */}
            <div className="top-bar">
                <div className="logo">Physical Simulations</div>
                <div className="top-right-buttons">
                    <a href="/" className="button home-button">Home</a>
                </div>
            </div>

            {/* =========================
                КОНТЕЙНЕР ФОРМИ
                ========================= */}
            <div className="auth-container">
                <h2>Register</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-btn form-btn">Register</button>
                </form>

                {/* Посилання на логін */}
                <div className="form-footer">
                    <span>
                        Already have an account? <a href="/login">Login</a>
                    </span>
                </div>

                {/* Повідомлення про успіх або помилку */}
                {message && <p style={{marginTop: "15px", color: "var(--color-accent)"}}>{message}</p>}
            </div>
        </div>
    );
}