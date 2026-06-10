import supabase from "../supabaseClient.js";
import { loginWithUsername, registerUser } from "./auth.js";

// ============================================================
// RECOVERY DETECT (IMPORTANT)
// ============================================================

const isRecovery = window.location.hash.includes("access_token");

// ============================================================
// TOGGLE UI
// ============================================================

const wrapper = document.querySelector(".wrapper");
const registerLink = document.querySelector(".register-link");
const loginLink = document.querySelector(".login-link");

registerLink?.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper?.classList.add("active");
});

loginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper?.classList.remove("active");
});

// ============================================================
// LOGIN
// ============================================================

document.getElementById("LoginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const user = await loginWithUsername(username, password);

    if (user) {
        alert("Login successful");

        // FIXED redirect (no origin spam)
        window.location.href = "/index.html";
    } else {
        alert("Invalid login");
    }
});

// ============================================================
// REGISTER
// ============================================================

document.querySelector(".RegisterForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const user = await registerUser(email, password, username);

    if (user) {
        alert("Check email for verification");
    }
});

// ============================================================
// LOGOUT
// ============================================================

export async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/index.html";
}