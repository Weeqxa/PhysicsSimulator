import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/Common.css";       // глобальні змінні та базові стилі
import styles from "../styles/Auth.module.css"; // специфічні стилі авторизації

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await loginUser({ username, password });
            navigate("/");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div>
            {/* ========================= ВЕРХНЯ ПАНЕЛЬ ========================= */}
            <div className="top-bar">
                <div className="logo">Fyzikálne simulácie</div>
                <div className={styles["top-right-buttons"]}>
                    <a href="/" className="btn">Domov</a>
                </div>
            </div>

            {/* ========================= КОНТЕЙНЕР ФОРМИ ========================= */}
            <div className={styles["auth-container"]}>
                <h2>Prihlásenie</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Používateľské meno"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Heslo"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn form-btn">Prihlásiť sa</button>
                </form>

                <div className={styles["form-footer"]}>
                    Nemáte účet? <a href="/register">Zaregistrujte sa</a>
                </div>

                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
}