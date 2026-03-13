const AUTH_API_URL = "http://localhost:8080/api/auth";
const USERS_API_URL = "http://localhost:8080/api/users";
const BACKEND_URL = "http://localhost:8080";

export async function registerUser(userData) {
    const response = await fetch(`${AUTH_API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return await response.text();
}

export async function loginUser(credentials) {
    const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    const token = await response.text();
    localStorage.setItem("token", token);

    return token;
}

export async function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
    };

    return fetch(url, {
        ...options,
        headers,
    });
}

export async function getProfile() {
    const response = await authFetch(`${USERS_API_URL}/me`);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return response.json();
}

export async function updateProfile(profileData) {
    const response = await authFetch(`${USERS_API_URL}/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return response.json();
}

export async function uploadAvatar(file) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${USERS_API_URL}/avatar`, {
        method: "POST",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to upload avatar");
    }

    return await res.text();
}

export function getAvatarUrl(avatarPath) {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
        return avatarPath;
    }
    return `${BACKEND_URL}${avatarPath}`;
}

export function logoutUser() {
    localStorage.removeItem("token");
}