// ===============================
// LOGIN FORM HANDLING
// ===============================
function showForm(type) {
    document.getElementById("loginSelection").classList.add("d-none");
    document.querySelectorAll(".login-form").forEach(f => f.classList.add("d-none"));
    document.getElementById(type + "Form").classList.remove("d-none");
}

function backToSelection() {
    document.getElementById("loginSelection").classList.remove("d-none");
    document.querySelectorAll(".login-form").forEach(f => f.classList.add("d-none"));
}

// ===============================
// SIGNUP FORM HANDLING
// ===============================
function showSignupForm(type) {
    document.getElementById("signupSelection").classList.add("d-none");
    document.querySelectorAll(".signup-form").forEach(f => f.classList.add("d-none"));
    document.getElementById(`signup${type.charAt(0).toUpperCase() + type.slice(1)}Form`).classList.remove("d-none");
}

function backToSignupSelection() {
    document.getElementById("signupSelection").classList.remove("d-none");
    document.querySelectorAll(".signup-form").forEach(f => f.classList.add("d-none"));
}

// ===============================
// SIGNUP HANDLER (Local Storage)
// ===============================
function handleSignup(role, form) {
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();
    const details = Array.from(form.querySelectorAll('input')).map(i => i.value.trim());

    if (!email || !password) {
        alert("Please fill all fields!");
        return;
    }

    const userData = {
        role,
        details,
        email,
        password
    };

    localStorage.setItem(role + "_" + email, JSON.stringify(userData));
    console.log("Signup key:", role + "_" + email, userData);


    alert(`${role.charAt(0).toUpperCase() + role.slice(1)} signup successful!`);
    $('#signupModal').modal('hide');
    $('#loginModal').modal('show');
}

// Attach signup events
document.getElementById("signupUserForm").addEventListener("submit", e => {
    e.preventDefault();
    handleSignup("user", e.target);
});

document.getElementById("signupNgoForm").addEventListener("submit", e => {
    e.preventDefault();
    handleSignup("ngo", e.target);
});

document.getElementById("signupAdminForm").addEventListener("submit", e => {
    e.preventDefault();
    handleSignup("admin", e.target);
});

// ===============================
// LOGIN HANDLER
// ===============================
function handleLogin(role, form) {
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();
let data = localStorage.getItem(role + "_" + email);

if (!data) {
    alert("No account found! Please sign up first.");
    return;
}

const user = JSON.parse(data);
console.log("Login key:", role + "_" + email, user); // ✅ move after parsing

if (user.password === password && user.role === role) {
    alert("Login successful!");
    localStorage.setItem("loggedUser", JSON.stringify(user));
    localStorage.setItem("userRole", role);

    $('#loginModal').modal('hide');

    if (role === "admin") window.location.href = "admin-dashboard.html";
    else if (role === "ngo") window.location.href = "ngo-dashboard.html";
    else window.location.href = "user-dashboard.html";
} else {
    alert("Invalid credentials!");
}
}
// Attach login events
document.getElementById("userForm").addEventListener("submit", e => {
    e.preventDefault();
    handleLogin("user", e.target);
});

document.getElementById("ngoForm").addEventListener("submit", e => {
    e.preventDefault();
    handleLogin("ngo", e.target);
});

// ===============================
// ADMIN FIXED LOGIN HANDLER
// ===============================
function loginAdmin(event) {
    event.preventDefault();

    const adminId = document.getElementById("adminId").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    const correctAdminId = "admin123";
    const correctPassword = "admin@123";

    if (adminId === correctAdminId && password === correctPassword) {
        alert("Admin Login Successful!");
        localStorage.setItem("loggedUser", JSON.stringify({ role: "admin", email: adminId }));
        localStorage.setItem("userRole", "admin");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid Admin Credentials!");
    }
}

// ===============================
// LOGOUT FUNCTION
// ===============================
function logout() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
}

// ===============================
// DASHBOARD POPULATION
// ===============================
function populateDashboard(role) {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser || loggedUser.role !== role) {
        window.location.href = "index.html";
        return;
    }

    if (role === "user") {
        document.getElementById("userName").value = loggedUser.details[0];
        document.getElementById("userEmail").value = loggedUser.email;
    } else if (role === "ngo") {
        document.getElementById("ngoName").value = loggedUser.details[0];
        document.getElementById("ngoEmail").value = loggedUser.email;
    } else if (role === "admin") {
        document.getElementById("adminIdDisplay").value = loggedUser.email;
    }
}

// Auto call populateDashboard based on page
if (window.location.pathname.toLowerCase().includes("user-dashboard.html")) populateDashboard("user");
if (window.location.pathname.includes("ngo-dashboard.html")) populateDashboard("ngo");
if (window.location.pathname.includes("admin-dashboard.html")) populateDashboard("admin");
