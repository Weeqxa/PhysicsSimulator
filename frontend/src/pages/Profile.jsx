import { useEffect, useMemo, useState } from "react";
import { getProfile, uploadAvatar, getAvatarUrl, updateProfile } from "../services/api";
import styles from "../styles/Profile.module.css";
import "../styles/Common.css";

export default function Profile() {
    const [user, setUser] = useState(null);

    const [isAvatarEditing, setIsAvatarEditing] = useState(false);
    const [newAvatar, setNewAvatar] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        bio: ""
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getProfile();
                setUser(data);
                setForm({
                    name: data.name || "",
                    email: data.email || "",
                    bio: data.bio || ""
                });
            } catch (error) {
                console.error("PROFILE ERROR:", error);
                alert("Nepodarilo sa načítať profil");
            }
        };

        loadProfile();
    }, []);

    const previewUrl = useMemo(() => {
        if (!newAvatar) return null;
        return URL.createObjectURL(newAvatar);
    }, [newAvatar]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSaveAvatar = async () => {
        if (!newAvatar) {
            alert("Vyberte súbor pre avatar!");
            return;
        }

        setAvatarLoading(true);
        try {
            const avatarPath = await uploadAvatar(newAvatar);
            setUser({ ...user, avatarUrl: avatarPath });
            setIsAvatarEditing(false);
            setNewAvatar(null);
        } catch (err) {
            console.error(err);
            alert("Chyba pri nahrávaní avatara");
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setProfileLoading(true);
        try {
            const updatedUser = await updateProfile(form);
            setUser(updatedUser);
            setForm({
                name: updatedUser.name || "",
                email: updatedUser.email || "",
                bio: updatedUser.bio || ""
            });
            setIsProfileEditing(false);
        } catch (err) {
            console.error(err);
            alert(err.message || "Nepodarilo sa aktualizovať profil");
        } finally {
            setProfileLoading(false);
        }
    };

    const handleCancelProfileEdit = () => {
        setForm({
            name: user?.name || "",
            email: user?.email || "",
            bio: user?.bio || ""
        });
        setIsProfileEditing(false);
    };

    if (!user) {
        return <p style={{ textAlign: "center", marginTop: "100px" }}>Načítava sa...</p>;
    }

    const currentAvatarSrc = getAvatarUrl(user.avatarUrl);
    const avatarSrc = previewUrl || currentAvatarSrc;

    return (
        <div>
            <div className="top-bar">
                <div className="logo">Fyzikálne simulácie</div>
                <div className="top-right-buttons">
                    <a href="/" className="btn">Domov</a>
                </div>
            </div>

            <div className={styles["profile-container"]}>
                <h2>Profil</h2>

                {avatarSrc ? (
                    <img
                        src={avatarSrc}
                        alt="Avatar"
                        className={styles["profile-avatar"]}
                    />
                ) : (
                    <div className={styles["profile-avatar-placeholder"]}>
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                )}

                {!isAvatarEditing ? (
                    <button className="btn" onClick={() => setIsAvatarEditing(true)}>
                        {user.avatarUrl ? "Upraviť avatar" : "Pridať avatar"}
                    </button>
                ) : (
                    <div className={styles["avatar-edit-block"]}>
                        <label className={styles["file-upload-label"]}>
                            Vybrať avatar
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className={styles["file-input-hidden"]}
                                onChange={(e) => setNewAvatar(e.target.files?.[0] || null)}
                            />
                        </label>

                        <span className={styles["file-name"]}>
                            {newAvatar ? newAvatar.name : "Nie je vybraný žiadny súbor"}
                        </span>

                        <button className="btn" onClick={handleSaveAvatar} disabled={avatarLoading}>
                            {avatarLoading ? "Nahráva sa..." : "Uložiť avatar"}
                        </button>

                        <button
                            className="btn"
                            onClick={() => {
                                setIsAvatarEditing(false);
                                setNewAvatar(null);
                            }}
                        >
                            Zrušiť
                        </button>
                    </div>
                )}

                {!isProfileEditing ? (
                    <>
                        <div className={styles["profile-info"]}>
                            <div className={styles["profile-field"]}>
                                <span className={styles["profile-label"]}>Používateľské meno</span>
                                <span className={styles["profile-value"]}>{user.username}</span>
                            </div>
                            <div className={styles["profile-field"]}>
                                <span className={styles["profile-label"]}>Meno</span>
                                <span className={styles["profile-value"]}>{user.name || "-"}</span>
                            </div>
                            <div className={styles["profile-field"]}>
                                <span className={styles["profile-label"]}>E-mail</span>
                                <span className={styles["profile-value"]}>{user.email || "-"}</span>
                            </div>
                            <div className={styles["profile-field-bio"]}>
                                <span className={styles["profile-label"]}>O mne</span>
                                <span className={styles["profile-bio-text"]}>{user.bio || "Žiadny popis"}</span>
                            </div>
                        </div>

                        <button className="btn" onClick={() => setIsProfileEditing(true)}>
                            Upraviť profil
                        </button>
                    </>
                ) : (
                    <div className={styles["profile-form"]}>
                        <label className={styles["profile-form-group"]}>
                            <span>Meno</span>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </label>

                        <label className={styles["profile-form-group"]}>
                            <span>E-mail</span>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </label>

                        <label className={styles["profile-form-group"]}>
                            <span>O mne</span>
                            <textarea
                                rows="4"
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            />
                        </label>

                        <div className={styles["profile-form-buttons"]}>
                            <button className="btn" onClick={handleSaveProfile} disabled={profileLoading}>
                                {profileLoading ? "Ukladá sa..." : "Uložiť profil"}
                            </button>
                            <button className="btn" onClick={handleCancelProfileEdit} type="button">
                                Zrušiť
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}