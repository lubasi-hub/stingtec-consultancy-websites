// Simple STINGTEC Application
// This replaces the complex app.js with a simple, reliable system

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('STINGTEC Simple App Loaded');
    
    // Initialize everything
    initNavigation();
    initMobileMenu();
    initAuth();
    initModals();
    initBookingSystem();
    initContactForm();
    
    // Load initial data
    loadServices();
    loadBlogs();
    
    // Check authentication status
    checkAuthStatus();
    
    // Update admin button visibility
    updateAdminAccess();
});

// ==================== NAVIGATION ====================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const pageId = href.replace('#', '');
            showPage(pageId);
        });
    });
    
    const heroButtons = document.querySelectorAll('.hero-buttons a');
    heroButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const pageId = href.replace('#', '');
            showPage(pageId);
        });
    });
}

function showPage(pageId) {
    console.log('Showing page:', pageId);
    
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(function(section) {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    } else {
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.style.display = 'block';
            homeSection.classList.add('active');
        }
    }
    
    const allLinks = document.querySelectorAll('.nav-link, .sidebar-link');
    allLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + pageId) {
            link.classList.add('active');
        }
    });
    
    window.scrollTo(0, 0);
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('overlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (mobileSidebar) mobileSidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            if (mobileSidebar) mobileSidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (mobileSidebar) mobileSidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }
    
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (mobileSidebar) mobileSidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    });
}

// ==================== AUTHENTICATION ====================
function initAuth() {
    const signInBtns = [document.getElementById('signInBtn'), document.getElementById('mobileSignInBtn')];
    signInBtns.forEach(function(btn) {
        if (btn) {
            btn.addEventListener('click', function() {
                openAuthModal('signin');
            });
        }
    });
    
    const signUpBtns = [document.getElementById('signUpBtn'), document.getElementById('mobileSignUpBtn')];
    signUpBtns.forEach(function(btn) {
        if (btn) {
            btn.addEventListener('click', function() {
                openAuthModal('signup');
            });
        }
    });
    
    const signOutBtns = [document.getElementById('signOutBtn'), document.getElementById('mobileSignOutBtn')];
    signOutBtns.forEach(function(btn) {
        if (btn) {
            btn.addEventListener('click', function() {
                auth.logout();
                updateAuthUI(false);
                alert('Signed out successfully!');
                showPage('home');
            });
        }
    });
    
    const adminBtns = [document.getElementById('adminBtn'), document.getElementById('mobileAdminBtn')];
    adminBtns.forEach(function(btn) {
        if (btn) {
            btn.addEventListener('click', function() {
                window.open('admin-dashboard.html', '_blank');
            });
        }
    });
}

function checkAuthStatus() {
    if (auth.isLoggedIn()) {
        updateAuthUI(true);
    }
}

function updateAuthUI(isLoggedIn) {
    const isAdmin = auth.isAdmin();
    
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const adminBtn = document.getElementById('adminBtn');
    const mobileSignInBtn = document.getElementById('mobileSignInBtn');
    const mobileSignUpBtn = document.getElementById('mobileSignUpBtn');
    const mobileSignOutBtn = document.getElementById('mobileSignOutBtn');
    const mobileAdminBtn = document.getElementById('mobileAdminBtn');
    
    if (isLoggedIn) {
        if (signInBtn) signInBtn.classList.add('hidden');
        if (signUpBtn) signUpBtn.classList.add('hidden');
        if (signOutBtn) signOutBtn.classList.remove('hidden');
        if (adminBtn) adminBtn.classList.toggle('hidden', !isAdmin);
        if (mobileSignInBtn) mobileSignInBtn.classList.add('hidden');
        if (mobileSignUpBtn) mobileSignUpBtn.classList.add('hidden');
        if (mobileSignOutBtn) mobileSignOutBtn.classList.remove('hidden');
        if (mobileAdminBtn) mobileAdminBtn.classList.toggle('hidden', !isAdmin);
    } else {
        if (signInBtn) signInBtn.classList.remove('hidden');
        if (signUpBtn) signUpBtn.classList.remove('hidden');
        if (signOutBtn) signOutBtn.classList.add('hidden');
        if (adminBtn) adminBtn.classList.add('hidden');
        if (mobileSignInBtn) mobileSignInBtn.classList.remove('hidden');
        if (mobileSignUpBtn) mobileSignUpBtn.classList.remove('hidden');
        if (mobileSignOutBtn) mobileSignOutBtn.classList.add('hidden');
        if (mobileAdminBtn) mobileAdminBtn.classList.add('hidden');
    }
}

function updateAdminAccess() {
    const adminBtn = document.getElementById('adminBtn');
    const mobileAdminBtn = document.getElementById('mobileAdminBtn');
    
    const isAdmin = auth.isAdmin();
    
    if (adminBtn) {
        adminBtn.classList.toggle('hidden', !isAdmin);
    }
    if (mobileAdminBtn) {
        mobileAdminBtn.classList.toggle('hidden', !isAdmin);
    }
}

// ==================== MODALS ====================
function initModals() {
    const modalClose = document.getElementById('modalClose');
    const authModal = document.getElementById('authModal');
    const switchToSignUp = document.getElementById('switchToSignUp');
    const switchToSignIn = document.getElementById('switchToSignIn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeAuthModal);
    }
    
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
    
    if (switchToSignUp) {
        switchToSignUp.addEventListener('click', function(e) {
            e.preventDefault();
            showSignUpForm();
        });
    }
    
    if (switchToSignIn) {
        switchToSignIn.addEventListener('click', function(e) {
            e.preventDefault();
            showSignInForm();
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const user = auth.login(email, password);
            if (user) {
                alert('Welcome ' + user.email + '!');
                updateAuthUI(true);
                updateAdminAccess();
                closeAuthModal();
                
                if (user.is_admin) {
                    // Optionally open admin dashboard
                    if (confirm('Login successful! Would you like to open the admin dashboard?')) {
                        window.open('admin-dashboard.html', '_blank');
                    }
                }
            } else {
                alert('Login failed: Invalid credentials');
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            const newUser = auth.register(email, password);
            if (newUser) {
                alert('Account created successfully! Please sign in.');
                showSignInForm();
            } else {
                alert('Registration failed: Email already exists or invalid data');
            }
        });
    }
}

function openAuthModal(type) {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.add('active');
        if (type === 'signup') {
            showSignUpForm();
        } else {
            showSignInForm();
        }
    }
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('active');
    }
}

function showSignInForm() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    if (signInForm) signInForm.classList.remove('hidden');
    if (signUpForm) signUpForm.classList.add('hidden');
}

function showSignUpForm() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    if (signInForm) signInForm.classList.add('hidden');
    if (signUpForm) signUpForm.classList.remove('hidden');
}

// ==================== LOAD PUBLIC DATA ====================
function loadServices() {
    // Services are now loaded directly from the HTML
    // This function can be used to dynamically load services if needed
    console.log('Services loaded');
}

function loadBlogs() {
    // Blogs are now loaded directly from the HTML
    // This function can be used to dynamically load blogs if needed
    console.log('Blogs loaded');
}

// ==================== BOOKING SYSTEM ====================
function initBookingSystem() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const bookingData = {
                customer_name: document.getElementById('bookingName').value,
                customer_email: document.getElementById('bookingEmail').value,
                customer_phone: document.getElementById('bookingPhone').value,
                service_category: document.getElementById('bookingServiceCategory').value,
                service_name: document.getElementById('bookingServiceName').value,
                message: document.getElementById('bookingMessage').value
            };
            
            // Validate required fields
            if (!bookingData.customer_name || !bookingData.customer_email || 
                !bookingData.customer_phone || !bookingData.service_category || 
                !bookingData.service_name) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Save to data store
            const result = dataStore.addServiceRequest(bookingData);
            if (result) {
                alert('Your service request has been submitted successfully! We will contact you soon.');
                closeBookingModal();
                bookingForm.reset();
            } else {
                alert('Failed to submit request. Please try again.');
            }
        });
    }
    
    // Setup booking modal close button
    const bookingModalClose = document.getElementById('bookingModalClose');
    if (bookingModalClose) {
        bookingModalClose.addEventListener('click', closeBookingModal);
    }
    
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) {
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });
    }
}

function closeBookingModal() {
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) {
        bookingModal.classList.remove('active');
    }
}

// Global function to open booking modal
window.openBookingModal = function(category, serviceName, evt) {
    console.log('Opening booking modal for:', category, serviceName);
    
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    
    try {
        const bookingModal = document.getElementById('bookingModal');
        const serviceCategoryInput = document.getElementById('bookingServiceCategory');
        const serviceNameInput = document.getElementById('bookingServiceName');
        const serviceDisplay = document.getElementById('bookingServiceDisplay');
        const categoryDisplay = document.getElementById('bookingCategoryDisplay');
        
        if (!bookingModal) {
            alert('Error: Booking modal not found in HTML!');
            return false;
        }
        
        // Set values
        if (serviceCategoryInput) serviceCategoryInput.value = category;
        if (serviceNameInput) serviceNameInput.value = serviceName;
        if (serviceDisplay) serviceDisplay.textContent = serviceName;
        if (categoryDisplay) categoryDisplay.textContent = category;
        
        // Show modal
        bookingModal.classList.add('active');
        
        console.log('Booking modal opened successfully');
        
    } catch (error) {
        console.error('Error opening modal:', error);
        alert('Error opening booking form: ' + error.message);
    }
    
    return false;
};

// ==================== CONTACT FORM ====================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };
            
            // Validate required fields
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Save to data store
            const result = dataStore.addContactMessage(formData);
            if (result) {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
            } else {
                alert('Failed to send message. Please try again.');
            }
        });
    }
}

// ==================== HERO SLIDER ====================
let currentSlide = 0;
let slideInterval;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    if (slides.length === 0) return;
    
    function showSlide(index) {
        slides.forEach(function(slide, i) {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Dot click handlers
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            showSlide(index);
            // Reset interval
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
    
    // Auto-advance slides every 5 seconds
    slideInterval = setInterval(nextSlide, 5000);
}

// Initialize slider
document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
});