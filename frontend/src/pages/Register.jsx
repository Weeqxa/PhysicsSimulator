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
                <div className="logo">Physical Simulations</div>
                <div className={styles["top-right-buttons"]}>
                    <a href="/" className="btn">Home</a>
                </div>
            </div>

            {/* ========================= КОНТЕЙНЕР ФОРМИ ========================= */}
            <div className={styles["auth-container"]}>
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
                    <button type="submit" className="btn form-btn">Register</button>
                </form>

                <div className={styles["form-footer"]}>
                    Already have an account? <a href="/login">Login</a>
                </div>

                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
}