// STINGTEC Simple API Client
// Self-contained version that works without external backend

// Store token
let authToken = localStorage.getItem('authToken') || null;

// API Helper Functions
function apiRequest(endpoint, options = {}) {
    // This is a mock API request that uses localStorage instead of making server calls
    
    try {
        const method = options.method || 'GET';
        
        if (endpoint === '/auth/register' && method === 'POST') {
            const { email, password } = JSON.parse(options.body);
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('stingtec_users') || '[]');
            if (users.some(user => user.email === email)) {
                throw new Error('User already exists');
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                email,
                password, // In a real app, this would be hashed
                is_admin: false,
                created_at: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('stingtec_users', JSON.stringify(users));
            
            return { message: 'User registered successfully' };
        }
        
        if (endpoint === '/auth/login' && method === 'POST') {
            const { email, password } = JSON.parse(options.body);
            
            const users = JSON.parse(localStorage.getItem('stingtec_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                throw new Error('Invalid credentials');
            }
            
            // Generate a mock token
            const mockToken = btoa(JSON.stringify({ id: user.id, email: user.email, is_admin: user.is_admin }));
            
            // Store token
            authToken = mockToken;
            localStorage.setItem('authToken', mockToken);
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                email: user.email,
                is_admin: user.is_admin
            }));
            
            return {
                access_token: mockToken,
                user: {
                    id: user.id,
                    email: user.email,
                    is_admin: user.is_admin
                }
            };
        }
        
        if (endpoint === '/auth/me') {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser) {
                throw new Error('Not authenticated');
            }
            return { user: currentUser };
        }
        
        if (endpoint === '/users' && method === 'GET') {
            // Only allow if authenticated and admin
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser || !currentUser.is_admin) {
                throw new Error('Admin access required');
            }
            
            const users = JSON.parse(localStorage.getItem('stingtec_users') || '[]');
            return { users };
        }
        
        if (endpoint === '/services' && method === 'GET') {
            const services = JSON.parse(localStorage.getItem('stingtec_services') || '[]');
            return { services };
        }
        
        if (endpoint === '/blogs' && method === 'GET') {
            const blogs = JSON.parse(localStorage.getItem('stingtec_blogs') || '[]');
            return { blogs };
        }
        
        if (endpoint === '/contact' && method === 'POST') {
            const contactData = JSON.parse(options.body);
            
            // Store contact message in localStorage
            const messages = JSON.parse(localStorage.getItem('stingtec_contact_messages') || '[]');
            messages.push({
                id: Date.now(),
                ...contactData,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('stingtec_contact_messages', JSON.stringify(messages));
            
            return { message: 'Message sent successfully' };
        }
        
        if (endpoint === '/bookings' && method === 'POST') {
            const bookingData = JSON.parse(options.body);
            
            // Store booking in localStorage
            const bookings = JSON.parse(localStorage.getItem('stingtec_bookings') || '[]');
            bookings.push({
                id: Date.now(),
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ...bookingData
            });
            localStorage.setItem('stingtec_bookings', JSON.stringify(bookings));
            
            return { message: 'Service request submitted successfully', booking_id: Date.now() };
        }
        
        if (endpoint === '/bookings' && method === 'GET') {
            // Only allow if authenticated and admin
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser || !currentUser.is_admin) {
                throw new Error('Admin access required');
            }
            
            const bookings = JSON.parse(localStorage.getItem('stingtec_bookings') || '[]');
            return bookings;
        }
        
        // Default return for unsupported endpoints
        return {};
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== AUTH API ====================

function registerUser(email, password) {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

function loginUser(email, password) {
    const data = apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    
    // Store token
    if (data.access_token) {
        authToken = data.access_token;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
}

function logoutUser() {
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
    return !!authToken;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.is_admin;
}

// ==================== USERS API ====================

function getUsers() {
    const data = apiRequest('/users');
    return data.users;
}

// ==================== SERVICES API ====================

function getServices() {
    const data = apiRequest('/services');
    return data.services;
}

function createService(serviceData) {
    // In localStorage version, we'll just update the local storage directly
    const services = JSON.parse(localStorage.getItem('stingtec_services') || '[]');
    const newService = {
        id: Date.now(),
        ...serviceData
    };
    services.push(newService);
    localStorage.setItem('stingtec_services', JSON.stringify(services));
    return { message: 'Service created successfully', id: newService.id };
}

function updateService(serviceId, serviceData) {
    const services = JSON.parse(localStorage.getItem('stingtec_services') || '[]');
    const index = services.findIndex(s => s.id === serviceId);
    if (index !== -1) {
        services[index] = { ...services[index], ...serviceData };
        localStorage.setItem('stingtec_services', JSON.stringify(services));
        return { message: 'Service updated successfully' };
    }
    throw new Error('Service not found');
}

function deleteService(serviceId) {
    const services = JSON.parse(localStorage.getItem('stingtec_services') || '[]');
    const filtered = services.filter(s => s.id !== serviceId);
    localStorage.setItem('stingtec_services', JSON.stringify(filtered));
    return { message: 'Service deleted successfully' };
}

// ==================== BLOGS API ====================

function getBlogs() {
    const data = apiRequest('/blogs');
    return data.blogs;
}

function createBlog(blogData) {
    const blogs = JSON.parse(localStorage.getItem('stingtec_blogs') || '[]');
    const newBlog = {
        id: Date.now(),
        ...blogData
    };
    blogs.push(newBlog);
    localStorage.setItem('stingtec_blogs', JSON.stringify(blogs));
    return { message: 'Blog post created successfully', id: newBlog.id };
}

function updateBlog(blogId, blogData) {
    const blogs = JSON.parse(localStorage.getItem('stingtec_blogs') || '[]');
    const index = blogs.findIndex(b => b.id === blogId);
    if (index !== -1) {
        blogs[index] = { ...blogs[index], ...blogData };
        localStorage.setItem('stingtec_blogs', JSON.stringify(blogs));
        return { message: 'Blog post updated successfully' };
    }
    throw new Error('Blog post not found');
}

function deleteBlog(blogId) {
    const blogs = JSON.parse(localStorage.getItem('stingtec_blogs') || '[]');
    const filtered = blogs.filter(b => b.id !== blogId);
    localStorage.setItem('stingtec_blogs', JSON.stringify(filtered));
    return { message: 'Blog post deleted successfully' };
}

// ==================== CONTACT API ====================

function sendContactMessage(contactData) {
    return apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(contactData)
    });
}

// ==================== SERVICE BOOKINGS API ====================

function createBooking(bookingData) {
    return apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
    });
}

function getBookings() {
    return apiRequest('/bookings', {
        method: 'GET'
    });
}

function getBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('stingtec_bookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }
    return booking;
}

function updateBookingStatus(bookingId, status) {
    const bookings = JSON.parse(localStorage.getItem('stingtec_bookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }
    booking.status = status;
    booking.updated_at = new Date().toISOString();
    localStorage.setItem('stingtec_bookings', JSON.stringify(bookings));
    return { message: 'Booking status updated successfully' };
}

function deleteBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('stingtec_bookings') || '[]');
    const filtered = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem('stingtec_bookings', JSON.stringify(filtered));
    return { message: 'Booking deleted successfully' };
}

// Export functions for use in app.js
window.API = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    isLoggedIn,
    isAdmin,
    getUsers,
    getServices,
    createService,
    updateService,
    deleteService,
    getBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    sendContactMessage,
    createBooking,
    getBookings,
    getBooking,
    updateBookingStatus,
    deleteBooking
};