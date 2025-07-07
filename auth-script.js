// Authentication Script for MindMate

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupPasswordStrength();
    checkExistingSession();
});

// Initialize authentication system
function initializeAuth() {
    console.log('🔐 MindMate Authentication System Initialized');
    
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser && isOnLoginPage()) {
        redirectToDashboard();
    }
    
    // Add input event listeners
    setupInputValidation();
}

// Check if user is on login page
function isOnLoginPage() {
    return window.location.pathname.includes('login.html') || window.location.pathname === '/';
}

// Get current user from sessionStorage only (no persistent login)
function getCurrentUser() {
    try {
        // Only check sessionStorage for temporary sessions
        const userData = sessionStorage.getItem('mindmate_user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Check existing session - sessions only last for current browser session
function checkExistingSession() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        // Session exists in sessionStorage, user is logged in for this browser session
        console.log('User session found:', currentUser.email);
    } else {
        // No session found, user needs to log in
        console.log('No active session found');
    }
}

// Form switching functions
function switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    
    // Clear form inputs
    clearFormInputs('loginForm');
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    
    // Clear form inputs
    clearFormInputs('registerForm');
}

// Clear form inputs
function clearFormInputs(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type !== 'checkbox') {
                input.value = '';
            } else {
                input.checked = false;
            }
        });
        
        // Reset password strength indicator
        if (formId === 'registerForm') {
            resetPasswordStrength();
        }
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.nextElementSibling;
    const icon = toggleBtn.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Setup password strength indicator
function setupPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
}

// Update password strength
function updatePasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        resetPasswordStrength();
        return;
    }
    
    const strength = calculatePasswordStrength(password);
    
    // Remove existing classes
    strengthFill.className = 'strength-fill';
    
    switch (strength.level) {
        case 1:
            strengthFill.classList.add('weak');
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#e74c3c';
            break;
        case 2:
            strengthFill.classList.add('fair');
            strengthText.textContent = 'Fair password';
            strengthText.style.color = '#f39c12';
            break;
        case 3:
            strengthFill.classList.add('good');
            strengthText.textContent = 'Good password';
            strengthText.style.color = '#f1c40f';
            break;
        case 4:
            strengthFill.classList.add('strong');
            strengthText.textContent = 'Strong password';
            strengthText.style.color = '#27ae60';
            break;
        default:
            resetPasswordStrength();
    }
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');
    
    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Include lowercase letters');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Include uppercase letters');
    
    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push('Include numbers');
    
    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    else feedback.push('Include special characters');
    
    return {
        level: Math.min(score, 4),
        feedback: feedback
    };
}

// Reset password strength indicator
function resetPasswordStrength() {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (strengthFill && strengthText) {
        strengthFill.className = 'strength-fill';
        strengthText.textContent = 'Password strength';
        strengthText.style.color = '#666';
    }
}

// Setup input validation
function setupInputValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
    });
    
    // Password confirmation validation
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('blur', validatePasswordMatch);
    }
}

// Validate email format
function validateEmail(event) {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showInputError(event.target, 'Please enter a valid email address');
    } else {
        clearInputError(event.target);
    }
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showInputError(document.getElementById('confirmPassword'), 'Passwords do not match');
    } else {
        clearInputError(document.getElementById('confirmPassword'));
    }
}

// Show input error
function showInputError(input, message) {
    clearInputError(input);
    
    input.style.borderColor = '#e74c3c';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 12px;
        margin-top: 5px;
        animation: slideDown 0.3s ease;
    `;
    
    input.parentNode.parentNode.appendChild(errorDiv);
}

// Clear input error
function clearInputError(input) {
    input.style.borderColor = '#e1e5e9';
    const errorDiv = input.parentNode.parentNode.querySelector('.input-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    // Remove rememberMe functionality - no persistent sessions
    
    // Show loading state
    const submitBtn = event.target.querySelector('.auth-btn');
    showLoadingState(submitBtn);
    
    // Validate inputs
    if (!email || !password) {
        hideLoadingState(submitBtn);
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate authentication delay
    setTimeout(() => {
        const success = authenticateUser(email, password);
        hideLoadingState(submitBtn);
        
        if (success) {
            showNotification('Welcome back! Redirecting to your dashboard...', 'success');
            setTimeout(() => {
                redirectToDashboard();
            }, 1500);
        } else {
            showNotification('Invalid email or password', 'error');
        }
    }, 1500);
    sessionStorage.setItem('mindmate_user', JSON.stringify(user));

}

// Handle registration form submission
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Show loading state
    const submitBtn = event.target.querySelector('.auth-btn');
    showLoadingState(submitBtn);
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        hideLoadingState(submitBtn);
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        hideLoadingState(submitBtn);
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        hideLoadingState(submitBtn);
        showNotification('Please agree to the Terms of Service', 'error');
        return;
    }
    
    const strength = calculatePasswordStrength(password);
    if (strength.level < 2) {
        hideLoadingState(submitBtn);
        showNotification('Please choose a stronger password', 'error');
        return;
    }
    
    // Simulate registration delay
    setTimeout(() => {
        const success = registerUser(name, email, password);
        hideLoadingState(submitBtn);
        
        if (success) {
            showSuccessModal();
        } else {
            showNotification('Email already exists. Please use a different email.', 'error');
        }
    }, 2000);
}

// Authenticate user (simulate API call) - temporary session only
function authenticateUser(email, password) {
    // Get stored users
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    
    if (user && user.password === hashPassword(password)) {
        // Create temporary session in sessionStorage only
        const sessionData = {
            id: user.id,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString()
        };
        
        // Store session only in sessionStorage - expires when browser closes
        sessionStorage.setItem('mindmate_user', JSON.stringify(sessionData));
        
        return true;
    }
    
    return false;
}

// Register new user (simulate API call)
function registerUser(name, email, password) {
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return false;
    }
    
    // Create new user
    const newUser = {
        id: generateUserId(),
        name: name,
        email: email,
        password: hashPassword(password),
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('mindmate_users', JSON.stringify(users));
    
    // Auto-login after registration - temporary session only
    const sessionData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        loginTime: new Date().toISOString()
    };
    
    // Store session only in sessionStorage - expires when browser closes
    sessionStorage.setItem('mindmate_user', JSON.stringify(sessionData));
    
    return true;
}

// Get stored users
function getStoredUsers() {
    try {
        const users = localStorage.getItem('mindmate_users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error getting stored users:', error);
        return [];
    }
}

// Simple password hashing (for demo purposes - use proper hashing in production)
function hashPassword(password) {
    // This is a simple hash for demo purposes
    // In production, use proper password hashing like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}

// Generate unique user ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Show loading state
function showLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
    const span = button.querySelector('span');
    if (span) {
        span.textContent = 'Please wait...';
    }
}

// Hide loading state
function hideLoadingState(button) {
    button.classList.remove('loading');
    button.disabled = false;
    const span = button.querySelector('span');
    if (span) {
        // Restore original text
        if (button.closest('#loginForm')) {
            span.textContent = 'Sign In';
        } else {
            span.textContent = 'Create Account';
        }
    }
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
            redirectToDashboard();
        }, 3000);
    }
}

// Redirect to dashboard
function redirectToDashboard() {
    // Check if we have index.html (main dashboard)
    if (window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    } else {
        // If no index.html, create a simple redirect
        window.location.href = 'index.html';
    }
}

// Social login simulation
function socialLogin(provider) {
    showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'info');
}

// Logout function
function logout() {
    // Only need to clear sessionStorage since we don't use persistent sessions
    sessionStorage.removeItem('mindmate_user');
    window.location.href = 'login.html';
}

// Show notification
function showNotification(message, type = 'info', duration = 4000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.auth-notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.textContent = message;
    
    // Notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(45deg, #f39c12, #e67e22)';
            break;
        default:
            notification.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // Enter key on form elements
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT') {
            const form = activeElement.closest('form');
            if (form) {
                const submitBtn = form.querySelector('.auth-btn[type="submit"]');
                if (submitBtn) {
                    submitBtn.click();
                }
            }
        }
    }
    
    // Escape key to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('successModal');
        if (modal && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
});

// Initialize demo users (for testing)
function initializeDemoUsers() {
    const users = getStoredUsers();
    if (users.length === 0) {
        const demoUsers = [
            {
                id: 'demo_user_1',
                name: 'Demo User',
                email: 'demo@mindmate.com',
                password: hashPassword('password123'),
                registrationDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('mindmate_users', JSON.stringify(demoUsers));
        console.log('📝 Demo users initialized. Login with: demo@mindmate.com / password123');
    }
}

// Initialize demo users on first load
initializeDemoUsers();

console.log(`
🧠 MindMate Authentication Ready!

Demo Account:
📧 Email: demo@mindmate.com
🔑 Password: password123

Features:
✨ User registration & login
🔐 Session management
💪 Password strength validation
📱 Responsive design
🎨 Smooth animations
`);
