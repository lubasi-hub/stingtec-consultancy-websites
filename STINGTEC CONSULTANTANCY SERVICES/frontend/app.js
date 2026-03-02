// STINGTEC Website - Frontend with Backend API
// This version connects to the Python Flask backend

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('STINGTEC Website Loaded');
    console.log('Connecting to API at: http://localhost:5000/api');
    
    // Test API connection
    fetch('http://localhost:5000/api/health')
        .then(response => response.json())
        .then(data => {
            console.log('API Connection Status: OK', data);
        })
        .catch(error => {
            console.warn('API Connection Warning: Could not connect to backend. Please ensure the Flask server is running on http://localhost:5000');
        });
    
    // Initialize everything
    initNavigation();
    initMobileMenu();
    initAuth();
    initModals();
    initAdminDashboard();
    
    // Load public data
    loadServices();
    loadBlogs();
    
    // Check if user is already logged in
    checkAuthStatus();
});

// ==================== NAVIGATION ====================
function initNavigation() {
    var navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            var pageId = href.replace('#', '');
            showPage(pageId);
        });
    });
    
    var heroButtons = document.querySelectorAll('.hero-buttons a');
    heroButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            var pageId = href.replace('#', '');
            showPage(pageId);
        });
    });
}

function showPage(pageId) {
    console.log('Showing page:', pageId);
    
    var sections = document.querySelectorAll('.page-section');
    sections.forEach(function(section) {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    var targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    } else {
        var homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.style.display = 'block';
            homeSection.classList.add('active');
        }
    }
    
    var allLinks = document.querySelectorAll('.nav-link, .sidebar-link');
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
    var menuToggle = document.getElementById('menuToggle');
    var closeSidebar = document.getElementById('closeSidebar');
    var mobileSidebar = document.getElementById('mobileSidebar');
    var overlay = document.getElementById('overlay');
    
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
    
    var sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (mobileSidebar) mobileSidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    });
}

// ==================== AUTHENTICATION ====================
function initAuth() {
    var signInBtns = [document.getElementById('signInBtn'), document.getElementById('mobileSignInBtn')];
    signInBtns.forEach(function(btn) {
        if (btn) {
            btn.addEventListener('click', function() {
                openAuthModal('signin');
            });
        }
    });
    
    var signUpBtns = [document.getElementById('signUpBtn'), document.getElementById('mobileSignUpBtn')];
    signUpBtns.forEach(function(btn) {
        if (btn) {
            btn.addEventListener('click', function() {
                openAuthModal('signup');
            });
        }
    });
    
    var signOutBtns = [document.getElementById('signOutBtn'), document.getElementById('mobileSignOutBtn')];
    signOutBtns.forEach(function(btn) {
        if (btn) {
            btn.addEventListener('click', function() {
                API.logoutUser();
                updateAuthUI(false);
                alert('Signed out successfully!');
                showPage('home');
            });
        }
    });
    
    var adminBtns = [document.getElementById('adminBtn'), document.getElementById('mobileAdminBtn')];
    adminBtns.forEach(function(btn) {
        if (btn) {
            btn.addEventListener('click', function() {
                showPage('admin');
            });
        }
    });
}

function checkAuthStatus() {
    if (API.isLoggedIn()) {
        updateAuthUI(true);
    }
}

function updateAuthUI(isLoggedIn) {
    var user = API.getCurrentUser();
    var isAdmin = user && user.is_admin;
    
    var signInBtn = document.getElementById('signInBtn');
    var signUpBtn = document.getElementById('signUpBtn');
    var signOutBtn = document.getElementById('signOutBtn');
    var adminBtn = document.getElementById('adminBtn');
    var mobileSignInBtn = document.getElementById('mobileSignInBtn');
    var mobileSignUpBtn = document.getElementById('mobileSignUpBtn');
    var mobileSignOutBtn = document.getElementById('mobileSignOutBtn');
    var mobileAdminBtn = document.getElementById('mobileAdminBtn');
    
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

// ==================== MODALS ====================
function initModals() {
    var modalClose = document.getElementById('modalClose');
    var authModal = document.getElementById('authModal');
    var switchToSignUp = document.getElementById('switchToSignUp');
    var switchToSignIn = document.getElementById('switchToSignIn');
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    
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
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            var email = document.getElementById('loginEmail').value;
            var password = document.getElementById('loginPassword').value;
            
            try {
                const data = await API.loginUser(email, password);
                alert('Welcome ' + data.user.email + '!');
                updateAuthUI(true);
                closeAuthModal();
                
                if (data.user.is_admin) {
                    showPage('admin');
                }
            } catch (error) {
                alert('Login failed: ' + error.message);
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            var email = document.getElementById('registerEmail').value;
            var password = document.getElementById('registerPassword').value;
            
            try {
                await API.registerUser(email, password);
                alert('Account created! Please sign in.');
                showSignInForm();
            } catch (error) {
                alert('Registration failed: ' + error.message);
            }
        });
    }
    
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            var formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };
            
            try {
                await API.sendContactMessage(formData);
                alert('Thank you! Your message has been sent.');
                contactForm.reset();
            } catch (error) {
                alert('Failed to send message: ' + error.message);
            }
        });
    }
}

function openAuthModal(type) {
    var authModal = document.getElementById('authModal');
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
    var authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('active');
    }
}

function showSignInForm() {
    var signInForm = document.getElementById('signInForm');
    var signUpForm = document.getElementById('signUpForm');
    if (signInForm) signInForm.classList.remove('hidden');
    if (signUpForm) signUpForm.classList.add('hidden');
}

function showSignUpForm() {
    var signInForm = document.getElementById('signInForm');
    var signUpForm = document.getElementById('signUpForm');
    if (signInForm) signInForm.classList.add('hidden');
    if (signUpForm) signUpForm.classList.remove('hidden');
}

// ==================== LOAD PUBLIC DATA ====================

async function loadServices() {
    try {
        const services = await API.getServices();
        var grid = document.getElementById('servicesGrid');
        if (grid && services) {
            grid.innerHTML = services.map(function(service) {
                return '<div class="service-card">' +
                    '<div class="service-icon"><i class="fas ' + service.icon + '"></i></div>' +
                    '<h3>' + service.title + '</h3>' +
                    '<p>' + service.description + '</p>' +
                '</div>';
            }).join('');
        }
    } catch (error) {
        console.error('Failed to load services:', error);
    }
}

async function loadBlogs() {
    try {
        const blogs = await API.getBlogs();
        var grid = document.getElementById('blogGrid');
        if (grid && blogs) {
            grid.innerHTML = blogs.map(function(blog) {
                return '<div class="blog-card">' +
                    '<div class="blog-image">' +
                        '<div class="placeholder-image">Blog Image</div>' +
                    '</div>' +
                    '<div class="blog-content">' +
                        '<span class="blog-date">' + new Date(blog.created_at).toLocaleDateString() + '</span>' +
                        '<h3>' + blog.title + '</h3>' +
                        '<p>' + blog.content.substring(0, 100) + '...</p>' +
                        '<a href="#" class="read-more">Read More &rarr;</a>' +
                    '</div>' +
                '</div>';
            }).join('');
        }
    } catch (error) {
        console.error('Failed to load blogs:', error);
    }
}

// ==================== ADMIN DASHBOARD ====================

function initAdminDashboard() {
    var adminTabs = document.querySelectorAll('.admin-tab');
    adminTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var tabId = this.getAttribute('data-tab');
            switchAdminTab(tabId);
            if (tabId === 'users') loadUsersTable();
            if (tabId === 'services') loadServicesTable();
            if (tabId === 'blogs') loadBlogsTable();
            if (tabId === 'bookings') loadBookingsTable();
        });
    });
    
    var addServiceBtn = document.getElementById('addServiceBtn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function() {
            openServiceModal();
        });
    }
    
    var addBlogBtn = document.getElementById('addBlogBtn');
    if (addBlogBtn) {
        addBlogBtn.addEventListener('click', function() {
            openBlogModal();
        });
    }
    
    var serviceModalClose = document.getElementById('serviceModalClose');
    if (serviceModalClose) {
        serviceModalClose.addEventListener('click', function() {
            closeModal('serviceModal');
        });
    }
    
    var blogModalClose = document.getElementById('blogModalClose');
    if (blogModalClose) {
        blogModalClose.addEventListener('click', function() {
            closeModal('blogModal');
        });
    }
    
    var serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveService();
        });
    }
    
    var blogForm = document.getElementById('blogForm');
    if (blogForm) {
        blogForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveBlog();
        });
    }
    
    var serviceModal = document.getElementById('serviceModal');
    var blogModal = document.getElementById('blogModal');
    
    if (serviceModal) {
        serviceModal.addEventListener('click', function(e) {
            if (e.target === serviceModal) {
                closeModal('serviceModal');
            }
        });
    }
    
    if (blogModal) {
        blogModal.addEventListener('click', function(e) {
            if (e.target === blogModal) {
                closeModal('blogModal');
            }
        });
    }
}

function switchAdminTab(tabId) {
    var tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        }
    });
    
    var contents = document.querySelectorAll('.admin-content');
    contents.forEach(function(content) {
        content.classList.remove('active');
    });
    
    var targetContent = document.getElementById(tabId + 'Tab');
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

async function loadUsersTable() {
    var tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    try {
        console.log('Loading users...');
        const users = await API.getUsers();
        console.log('Users loaded:', users);
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No users found</td></tr>';
            return;
        }
        tbody.innerHTML = users.map(function(user) {
            return '<tr>' +
                '<td>' + user.email + '</td>' +
                '<td>' + new Date(user.created_at).toLocaleDateString() + '</td>' +
                '<td>' + (user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never') + '</td>' +
            '</tr>';
        }).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = '<tr><td colspan="3">Error loading users: ' + error.message + '</td></tr>';
    }
}

async function loadServicesTable() {
    var tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;
    
    try {
        const services = await API.getServices();
        tbody.innerHTML = services.map(function(service) {
            return '<tr>' +
                '<td>' + service.title + '</td>' +
                '<td>' + service.description.substring(0, 50) + '...</td>' +
                '<td>' +
                    '<button class="btn btn-outline action-btn" onclick="window.editService(' + service.id + ')">Edit</button>' +
                    '<button class="btn btn-outline action-btn" onclick="window.deleteService(' + service.id + ')">Delete</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="3">Error loading services</td></tr>';
    }
}

async function loadBlogsTable() {
    var tbody = document.getElementById('blogsTableBody');
    if (!tbody) return;
    
    try {
        const blogs = await API.getBlogs();
        tbody.innerHTML = blogs.map(function(blog) {
            return '<tr>' +
                '<td>' + blog.title + '</td>' +
                '<td>' + new Date(blog.created_at).toLocaleDateString() + '</td>' +
                '<td>' +
                    '<button class="btn btn-outline action-btn" onclick="window.editBlog(' + blog.id + ')">Edit</button>' +
                    '<button class="btn btn-outline action-btn" onclick="window.deleteBlog(' + blog.id + ')">Delete</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="3">Error loading blogs</td></tr>';
    }
}

var currentEditServiceId = null;
var currentEditBlogId = null;

function openServiceModal(serviceId) {
    var modal = document.getElementById('serviceModal');
    var title = document.getElementById('serviceModalTitle');
    var serviceTitle = document.getElementById('serviceTitle');
    var serviceDescription = document.getElementById('serviceDescription');
    var serviceIcon = document.getElementById('serviceIcon');
    
    currentEditServiceId = serviceId || null;
    
    if (serviceId) {
        API.getServices().then(function(services) {
            var service = services.find(function(s) { return s.id === serviceId; });
            if (service) {
                title.textContent = 'Edit Service';
                serviceTitle.value = service.title;
                serviceDescription.value = service.description;
                serviceIcon.value = service.icon;
            }
        });
    } else {
        title.textContent = 'Add Service';
        serviceTitle.value = '';
        serviceDescription.value = '';
        serviceIcon.value = 'fa-star';
    }
    
    if (modal) modal.classList.add('active');
}

function openBlogModal(blogId) {
    var modal = document.getElementById('blogModal');
    var title = document.getElementById('blogModalTitle');
    var blogTitleInput = document.getElementById('blogTitleInput');
    var blogContentInput = document.getElementById('blogContentInput');
    var blogImageInput = document.getElementById('blogImageInput');
    
    currentEditBlogId = blogId || null;
    
    if (blogId) {
        API.getBlogs().then(function(blogs) {
            var blog = blogs.find(function(b) { return b.id === blogId; });
            if (blog) {
                title.textContent = 'Edit Blog Post';
                blogTitleInput.value = blog.title;
                blogContentInput.value = blog.content;
                blogImageInput.value = blog.image_url || '';
            }
        });
    } else {
        title.textContent = 'Add Blog Post';
        blogTitleInput.value = '';
        blogContentInput.value = '';
        blogImageInput.value = '';
    }
    
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

async function saveService() {
    var title = document.getElementById('serviceTitle').value;
    var description = document.getElementById('serviceDescription').value;
    var icon = document.getElementById('serviceIcon').value;
    
    try {
        if (currentEditServiceId) {
            await API.updateService(currentEditServiceId, { title, description, icon });
        } else {
            await API.createService({ title, description, icon });
        }
        
        closeModal('serviceModal');
        await loadServicesTable();
        await loadServices();
        alert('Service saved successfully!');
    } catch (error) {
        alert('Failed to save service: ' + error.message);
    }
}

async function saveBlog() {
    var title = document.getElementById('blogTitleInput').value;
    var content = document.getElementById('blogContentInput').value;
    var image_url = document.getElementById('blogImageInput').value;
    
    try {
        if (currentEditBlogId) {
            await API.updateBlog(currentEditBlogId, { title, content, image_url });
        } else {
            await API.createBlog({ title, content, image_url });
        }
        
        closeModal('blogModal');
        await loadBlogsTable();
        await loadBlogs();
        alert('Blog post saved successfully!');
    } catch (error) {
        alert('Failed to save blog: ' + error.message);
    }
}

window.editService = function(id) {
    openServiceModal(id);
};

window.deleteService = async function(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        try {
            await API.deleteService(id);
            await loadServicesTable();
            await loadServices();
            alert('Service deleted!');
        } catch (error) {
            alert('Failed to delete service: ' + error.message);
        }
    }
};

window.editBlog = function(id) {
    openBlogModal(id);
};

window.deleteBlog = async function(id) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        try {
            await API.deleteBlog(id);
            await loadBlogsTable();
            await loadBlogs();
            alert('Blog post deleted!');
        } catch (error) {
            alert('Failed to delete blog: ' + error.message);
        }
    }
};

// ==================== HERO SLIDER ====================
let currentSlide = 0;
let slideInterval;

function initHeroSlider() {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.slider-dots .dot');
    
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
        var next = (currentSlide + 1) % slides.length;
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

// Initialize slider after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
});

// ==================== SERVICE BOOKING MODAL ====================

function initBookingModal() {
    var bookingModal = document.getElementById('bookingModal');
    var bookingModalClose = document.getElementById('bookingModalClose');
    var bookingForm = document.getElementById('bookingForm');
    
    if (bookingModalClose) {
        bookingModalClose.addEventListener('click', function() {
            bookingModal.classList.remove('active');
        });
    }
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            var bookingData = {
                customer_name: document.getElementById('bookingName').value,
                customer_email: document.getElementById('bookingEmail').value,
                customer_phone: document.getElementById('bookingPhone').value,
                service_category: document.getElementById('bookingServiceCategory').value,
                service_name: document.getElementById('bookingServiceName').value,
                message: document.getElementById('bookingMessage').value
            };
            
            try {
                await API.createBooking(bookingData);
                alert('Your service request has been submitted successfully! We will contact you soon.');
                bookingModal.classList.remove('active');
                bookingForm.reset();
            } catch (error) {
                alert('Failed to submit request: ' + error.message);
            }
        });
    }
}

// Global function to open booking modal
window.openBookingModal = function(category, serviceName, evt) {
    console.log('Opening booking modal for:', category, serviceName);
    
    // Prevent default and bubbling
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    
    try {
        var bookingModal = document.getElementById('bookingModal');
        var serviceCategoryInput = document.getElementById('bookingServiceCategory');
        var serviceNameInput = document.getElementById('bookingServiceName');
        var serviceDisplay = document.getElementById('bookingServiceDisplay');
        var categoryDisplay = document.getElementById('bookingCategoryDisplay');
        
        console.log('Modal element:', bookingModal);
        
        if (!bookingModal) {
            alert('Error: Booking modal not found in HTML!');
            return false;
        }
        
        // Set values
        if (serviceCategoryInput) serviceCategoryInput.value = category;
        if (serviceNameInput) serviceNameInput.value = serviceName;
        if (serviceDisplay) serviceDisplay.textContent = serviceName;
        if (categoryDisplay) categoryDisplay.textContent = category;
        
        // Show modal - force display
        bookingModal.style.display = 'flex';
        bookingModal.style.visibility = 'visible';
        bookingModal.style.opacity = '1';
        bookingModal.classList.add('active');
        
        console.log('Modal should now be visible');
        
    } catch (error) {
        console.error('Error opening modal:', error);
        alert('Error opening booking form: ' + error.message);
    }
    
    return false;
};

// Initialize booking modal on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initBookingModal();
});

// ==================== ADMIN BOOKINGS MANAGEMENT ====================

async function loadBookingsTable() {
    try {
        console.log('Loading bookings...');
        var bookings = await API.getBookings();
        console.log('Bookings loaded:', bookings);
        var tbody = document.getElementById('bookingsTableBody');
        if (!tbody) {
            console.error('bookingsTableBody not found');
            return;
        }
        
        if (!bookings || bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No service requests yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = bookings.map(function(booking) {
            var statusClass = 'status-' + booking.status;
            return '<tr>' +
                '<td>#' + booking.id + '</td>' +
                '<td>' + booking.customer_name + '<br><small>' + booking.customer_email + '</small></td>' +
                '<td>' + booking.service_name + '</td>' +
                '<td>' + booking.service_category + '</td>' +
                '<td>' + booking.customer_phone + '</td>' +
                '<td><span class="booking-status ' + statusClass + '">' + booking.status + '</span></td>' +
                '<td>' + new Date(booking.created_at).toLocaleDateString() + '</td>' +
                '<td>' +
                    '<button class="btn btn-small btn-primary" onclick="viewBooking(' + booking.id + ')">View</button> ' +
                    '<button class="btn btn-small" onclick="updateBookingStatusPrompt(' + booking.id + ', \'' + booking.status + '\')">Update</button> ' +
                    '<button class="btn btn-small btn-danger" onclick="deleteBooking(' + booking.id + ')">Delete</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    } catch (error) {
        console.error('Failed to load bookings:', error);
    }
}

window.viewBooking = async function(id) {
    try {
        var booking = await API.getBooking(id);
        var message = 'Customer: ' + booking.customer_name + '\n' +
                      'Email: ' + booking.customer_email + '\n' +
                      'Phone: ' + booking.customer_phone + '\n' +
                      'Service: ' + booking.service_name + '\n' +
                      'Category: ' + booking.service_category + '\n' +
                      'Status: ' + booking.status + '\n' +
                      'Message: ' + (booking.message || 'No message') + '\n' +
                      'Submitted: ' + new Date(booking.created_at).toLocaleString();
        alert(message);
    } catch (error) {
        alert('Failed to load booking: ' + error.message);
    }
};

window.updateBookingStatusPrompt = async function(id, currentStatus) {
    var newStatus = prompt('Update status (pending, in_progress, completed, cancelled):', currentStatus);
    if (newStatus && newStatus !== currentStatus) {
        try {
            await API.updateBookingStatus(id, newStatus);
            await loadBookingsTable();
            alert('Status updated!');
        } catch (error) {
            alert('Failed to update status: ' + error.message);
        }
    }
};

window.deleteBooking = async function(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            await API.deleteBooking(id);
            await loadBookingsTable();
            alert('Booking deleted!');
        } catch (error) {
            alert('Failed to delete booking: ' + error.message);
        }
    }
};

// Load bookings when bookings tab is clicked
document.addEventListener('DOMContentLoaded', function() {
    var bookingsTab = document.querySelector('.admin-tab[data-tab="bookings"]');
    if (bookingsTab) {
        bookingsTab.addEventListener('click', function() {
            loadBookingsTable();
        });
    }
});
