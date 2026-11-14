const AUTH_API_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorDiv = document.getElementById('login-error');

      try {
        const response = await fetch(`${AUTH_API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Store user info in localStorage
          localStorage.setItem('user', JSON.stringify({
            id: data.userId,
            username: data.username
          }));
          window.location.href = 'index.html';
        } else {
          errorDiv.textContent = data.message || 'Login failed';
          errorDiv.style.display = 'block';
        }
      } catch (error) {
        errorDiv.textContent = 'Network error. Please try again later.';
        errorDiv.style.display = 'block';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value;
      const password = document.getElementById('reg-password').value;
      const errorDiv = document.getElementById('register-error');

      try {
        const response = await fetch(`${AUTH_API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Store user info in localStorage
          localStorage.setItem('user', JSON.stringify({
            id: data.userId,
            username: data.username
          }));
          window.location.href = 'index.html';
        } else {
          errorDiv.textContent = data.message || 'Registration failed';
          errorDiv.style.display = 'block';
        }
      } catch (error) {
        errorDiv.textContent = 'Network error. Please try again later.';
        errorDiv.style.display = 'block';
      }
    });
  }
});

// Utility to get current logged in user
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Utility to logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Auth Guard: Protect routes and update UI
document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  const currentPath = window.location.pathname;
  const isAuthPage = currentPath.endsWith('login.html') || currentPath.endsWith('register.html');

  // If on a protected page and not logged in, redirect to login
  if (!user && !isAuthPage) {
    window.location.href = 'login.html';
    return;
  }

  // If on an auth page and logged in, redirect to dashboard
  if (user && isAuthPage) {
    window.location.href = 'index.html';
    return;
  }

  // Update navbar dynamically if not on an auth page
  if (user && !isAuthPage) {
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
      // Add user greeting and logout button
      const userSpan = document.createElement('span');
      userSpan.className = 'nav-link';
      userSpan.style.color = 'var(--slate-800)';
      userSpan.textContent = `Hi, ${user.username}`;
      
      const logoutBtn = document.createElement('a');
      logoutBtn.href = '#';
      logoutBtn.className = 'nav-link';
      logoutBtn.style.color = 'var(--red-500)';
      logoutBtn.textContent = 'Logout';
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        logout();
      };
      
      navLinksContainer.appendChild(userSpan);
      navLinksContainer.appendChild(logoutBtn);
    }
  }
});

// UI Utility to toggle password visibility
window.togglePassword = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;
  }
};
