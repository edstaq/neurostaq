
const errorMessage = document.getElementById('error-message');
const loginButton = document.querySelector('button');
const studentIdInput = document.getElementById('studentid');
const passwordInput = document.getElementById('password');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    loginButton.disabled = false;
    loginButton.textContent = 'Login';
}

function hideError() {
    errorMessage.style.display = 'none';
}

async function handleLogin() {
    hideError();

    const studentId = studentIdInput.value.toUpperCase().trim();
    const password = passwordInput.value.trim();

    if (!studentId || !password) {
        showError("Please enter both your Student ID and Password.");
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = 'Verifying...';

    const apiUrl = `https://script.google.com/macros/s/AKfycbzoJwXHj0blX8HwU9GzNzTEoSOvFDbExIVNZPeVlDsQA-muaS8dwbDUXvD6EPiQsDYy/exec?StudentID=${studentId}&Password=${password}`;

    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.status === 'success') {
            localStorage.setItem('studentId', studentId);
            window.location.href = "tracker.html";
        } else {
            showError(result.message || "Invalid credentials. Please check your ID and password.");
        }
    } catch (error) {
        console.error('Login API error:', error);
        showError("An error occurred. Please try again later.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }

    passwordInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            handleLogin();
        }
    });

    studentIdInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            handleLogin();
        }
    });
});
