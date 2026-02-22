import {useState} from "react";
import {useNavigate} from "react-router-dom"; // Хук для навігації між маршрутами
import {loginUser} from "../services/api"; // Функція для логіну через бекенд
import "../css/authorizationStyle.css"; // Стилі для сторінки авторизації

// =========================
// Компонент Login
// =========================
export default function Login() {
    // -------------------------
    // Станові змінні
    // -------------------------
    const [username, setUsername] = useState(""); // Значення інпуту Username
    const [password, setPassword] = useState(""); // Значення інпуту Password
    const [message, setMessage] = useState("");   // Повідомлення про помилку або успіх
    const navigate = useNavigate();               // Хук для редиректу

    // -------------------------
    // Обробник сабміту форми
    // -------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await loginUser({username, password});

            // Якщо без помилки — редирект
            navigate("/");

        } catch (error) {
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
                    {/* Повернення на головну через звичайне посилання */}
                    <a href="/" className="button home-button">Home</a>
                </div>
            </div>

            {/* =========================
                КОНТЕЙНЕР ФОРМИ
                ========================= */}
            <div className="auth-container">
                <h2>Login</h2>

                {/* Форма для логіну */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="auth-btn form-btn">Login</button>
                </form>

                {/* Посилання на реєстрацію */}
                <div className="form-footer">
                    <span>
                        Don’t have an account? <a href="/register">Register</a>
                    </span>
                </div>

                {/* Повідомлення про помилку або успіх */}
                {message && <p style={{marginTop: "15px", color: "var(--color-accent)"}}>{message}</p>}
            </div>
        </div>
    );
}