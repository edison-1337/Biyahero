import supabase from "./supabaseClient.js"

export async function registerUser(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  })
  console.log("Signup result:", data)
  if (error) {
    console.error(error.message)
    return null
  }

  return data.user
}

export async function loginWithUsername(username, password) {
  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", username)
    .maybeSingle()

  if (error || !data) {
    console.error("Username not found")
    return null
  }

  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: password
    })

  if (loginError) {
    console.error(loginError.message)
    return null
  }

  return loginData.user
}


export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Session error:", error.message);
    return null;
  }

  if (data.session) {
    console.log("User already logged in:", data.session.user);
    return data.session.user;
  } else {
    console.log("No active session found");
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error.message);
      } else {
        window.location.href = "/login";
      }
    });
  }
});



    export default supabase
////////
    export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error("Password update error:", error.message)
    return null
  }

  console.log("Password updated ✔")
  return data.user
}