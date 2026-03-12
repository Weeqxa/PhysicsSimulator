import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/Common.css";
import styles from "../styles/Auth.module.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const result = await registerUser({ username, password, name, email });
            setMessage(result);

            if (result.toLowerCase().includes("success")) {
                setTimeout(() => navigate("/login"), 1000);
            }
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
                <h2>Registrácia</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Používateľské meno"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Celé meno"
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
                        placeholder="Heslo"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn form-btn">Registrovať sa</button>
                </form>

                <div className={styles["form-footer"]}>
                    Už máte účet? <a href="/login">Prihláste sa</a>
                </div>

                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
}