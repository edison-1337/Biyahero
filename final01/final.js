import supabase from "./auth.js";

// ============================================================
// SECTION 1 — FARE MATRIX POPUP
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
    const btn     = document.getElementById("viewFareBtn");
    const popup   = document.getElementById("farePopup");
    const closeBtn = document.querySelector(".close-icon");

    if (btn && popup) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            popup.style.display = "block";
            document.body.style.overflow = "hidden";
        });

        closeBtn.onclick = function () {
            popup.style.display = "none";
            document.body.style.overflow = "auto";
        };

        window.addEventListener("click", function (event) {
            if (event.target === popup) {
                popup.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }
});

// ============================================================
// GLOBAL FIX — RECOVERY DETECTION (ADDED, SAFE)
// ============================================================

const isRecovery =
    window.location.hash.includes("access_token");

// ============================================================
// SECTION 2 — LOGIN / REGISTER WRAPPER TOGGLE
// ============================================================

const wrapper      = document.querySelector(".wrapper");
const registerLink = document.querySelector(".register-link");
const loginLink    = document.querySelector(".login-link");

if (registerLink) registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.add('active');
});

if (loginLink) loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.remove('active');
});

// ============================================================
// SECTION 3 — PASSWORD VISIBILITY TOGGLES
// ============================================================

function setupToggle(inputId, toggleId) {
    const passwordField = document.getElementById(inputId);
    const toggleIcon    = document.getElementById(toggleId);
    if (!passwordField || !toggleIcon) return;

    toggleIcon.onclick = function () {
        const isHidden = passwordField.type === "password";
        passwordField.type = isHidden ? "text" : "password";
        toggleIcon.classList.toggle("bx-hide",  !isHidden);
        toggleIcon.classList.toggle("bx-show",   isHidden);
    };
}

setupToggle("loginPassword",    "toggleLoginPassword");
setupToggle("registerPassword", "toggleRegisterPassword");

// ============================================================
// SECTION 4 — LOGIN POPUP
// ============================================================

const loginBtn  = document.getElementById("loginBtn");
const logPopup  = document.getElementById("loginPopup");
const logClose  = document.querySelector(".close-login");

if (loginBtn && logPopup) {
    loginBtn.onclick = function (e) {
        e.preventDefault();
        logPopup.style.display = "block";
        document.body.style.overflow = "hidden";
    };

    logClose.onclick = function () {
        logPopup.style.display = "none";
        document.body.style.overflow = "auto";
    };

    window.addEventListener("click", function (event) {
        if (event.target === logPopup) {
            logPopup.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
}

// ============================================================
// SECTION 5 — DARK MODE
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("darkToggle");
    if (!toggle) return;

    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
        const enabled = toggle.checked;
        document.body.classList.toggle("dark-mode", enabled);
        localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
    });
});

// ============================================================
// SECTION 6 — MOBILE MENU
// ============================================================

const menuToggle = document.getElementById("menuToggle");
const navGroup   = document.getElementById("navGroup");

if (menuToggle && navGroup) {
    menuToggle.addEventListener("click", () => {
        navGroup.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        if (icon) {
            icon.classList.toggle("bx-menu");
            icon.classList.toggle("bx-x");
        }
    });
}

// ============================================================
// SECTION 7 — AUTH STATE (FIXED)
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
    const loginBtn  = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    if (!loginBtn || !logoutBtn) return;

    const { data: { user } } = await supabase.auth.getUser();

    loginBtn.style.display  = user ? "none"  : "block";
    logoutBtn.style.display = user ? "block" : "none";

    logoutBtn.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    });
});

// ============================================================
// SECTION 8 — ROUTE INFO VISIBILITY
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const routeInfo = document.getElementById("routeInfo");
    if (!routeInfo) return;

    const observer = new MutationObserver(() => {
        routeInfo.style.display =
            routeInfo.innerHTML.trim() !== "" ? "block" : "none";
    });

    observer.observe(routeInfo, {
        childList: true,
        subtree: true,
        characterData: true
    });

    document.getElementById("exitBtn")?.addEventListener("click", () => {
        routeInfo.innerHTML = "";
        routeInfo.style.display = "none";
    });
});

// ============================================================
// SECTION 9 — FORGOT PASSWORD
// ============================================================

const forgotLink  = document.getElementById("forgotPasswordLink");
const forgotModal = document.getElementById("forgotModal");
const closeModal  = document.querySelector(".close-modal");

if (forgotLink && forgotModal) {
    forgotLink.addEventListener("click", (e) => {
        e.preventDefault();
        forgotModal.classList.add("active");
    });

    closeModal.addEventListener("click", () => {
        forgotModal.classList.remove("active");
    });

    document.getElementById("sendResetLink").addEventListener("click", async () => {
        const email = document.getElementById("resetEmail").value.trim();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/index.html?action=reset-password`
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Password reset link sent!");
        forgotModal.classList.remove("active");
    });
}

// ============================================================
// SECTION 10 — PASSWORD TOGGLE (RESET MODAL)
// ============================================================

document.querySelectorAll(".toggle-password").forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const input  = toggle.parentElement.querySelector("input");
        if (!input) return;

        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";

        toggle.classList.toggle("bx-hide", !isHidden);
        toggle.classList.toggle("bx-show", isHidden);
    });
});

// ============================================================
// SECTION 11 — RECOVERY FLOW (FIXED — CORE BUG FIX HERE)
// ============================================================

async function handleRecovery() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");

    if (!access_token || !refresh_token) return;

    const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token
    });

    if (error) {
        console.error("Session error:", error.message);
        return;
    }

    // 🔥 FIX: prevents session re-trigger on refresh
    window.history.replaceState({}, document.title, "/index.html");

    const modal = document.getElementById("resetPasswordModal");
    if (modal) modal.style.display = "flex";

    const form = document.getElementById("resetForm");
    const passwordInput = document.getElementById("newPassword");
    const confirmInput = document.getElementById("confirmPassword");
    const messageBox = document.getElementById("message");

    if (!form.dataset.bound) {
        form.dataset.bound = "true";

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const newPassword = passwordInput.value;
            const confirmPassword = confirmInput.value;

            if (newPassword !== confirmPassword) {
                messageBox.textContent = "Passwords do not match.";
                return;
            }

            try {
                const { updatePassword } = await import("./auth.js");

                const result = await updatePassword(newPassword);

                if (result) {
                    await supabase.auth.signOut({ scope: "global" });

                    alert("Password updated successfully ✔");

                    window.location.href = "/index.html";
                }
            } catch (err) {
                console.error(err);
                messageBox.textContent = "Something went wrong.";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", handleRecovery);