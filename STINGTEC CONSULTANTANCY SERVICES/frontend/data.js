// Simple file-based data storage system
// This replaces the complex database and JWT system

class SimpleDataStore {
    constructor() {
        this.dataFile = 'stingtec_data.json';
        this.initData();
    }
    
    initData() {
        // Initialize with default admin user if file doesn't exist
        if (!this.fileExists()) {
            const defaultData = {
                users: [
                    {
                        id: 1,
                        email: 'stingteczambiasales@gmail.com',
                        password: 'stingtec1234', // In production, this should be hashed
                        is_admin: true,
                        created_at: new Date().toISOString(),
                        last_login: null
                    }
                ],
                service_requests: [],
                contact_messages: []
            };
            this.saveData(defaultData);
        }
    }
    
    fileExists() {
        try {
            const data = localStorage.getItem(this.dataFile);
            return data !== null;
        } catch (e) {
            return false;
        }
    }
    
    loadData() {
        try {
            const data = localStorage.getItem(this.dataFile);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading data:', e);
            return null;
        }
    }
    
    saveData(data) {
        try {
            localStorage.setItem(this.dataFile, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    }
    
    // User functions
    getAllUsers() {
        const data = this.loadData();
        return data ? data.users : [];
    }
    
    getUserByEmail(email) {
        const users = this.getAllUsers();
        return users.find(user => user.email === email);
    }
    
    addUser(userData) {
        const data = this.loadData();
        if (!data) return false;
        
        // Check if user already exists
        if (this.getUserByEmail(userData.email)) {
            return false;
        }
        
        const newUser = {
            id: Date.now(), // Simple ID generation
            ...userData,
            created_at: new Date().toISOString(),
            last_login: null
        };
        
        data.users.push(newUser);
        return this.saveData(data) ? newUser : false;
    }
    
    updateUserLogin(email) {
        const data = this.loadData();
        if (!data) return false;
        
        const user = data.users.find(u => u.email === email);
        if (user) {
            user.last_login = new Date().toISOString();
            return this.saveData(data);
        }
        return false;
    }
    
    // Service request functions
    getAllServiceRequests() {
        const data = this.loadData();
        return data ? data.service_requests : [];
    }
    
    addServiceRequest(requestData) {
        const data = this.loadData();
        if (!data) return false;
        
        const newRequest = {
            id: Date.now(),
            ...requestData,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        data.service_requests.push(newRequest);
        return this.saveData(data) ? newRequest : false;
    }
    
    updateServiceRequestStatus(requestId, status) {
        const data = this.loadData();
        if (!data) return false;
        
        const request = data.service_requests.find(r => r.id === requestId);
        if (request) {
            request.status = status;
            request.updated_at = new Date().toISOString();
            return this.saveData(data);
        }
        return false;
    }
    
    deleteServiceRequest(requestId) {
        const data = this.loadData();
        if (!data) return false;
        
        const index = data.service_requests.findIndex(r => r.id === requestId);
        if (index !== -1) {
            data.service_requests.splice(index, 1);
            return this.saveData(data);
        }
        return false;
    }
    
    // Contact message functions
    getAllContactMessages() {
        const data = this.loadData();
        return data ? data.contact_messages : [];
    }
    
    addContactMessage(messageData) {
        const data = this.loadData();
        if (!data) return false;
        
        const newMessage = {
            id: Date.now(),
            ...messageData,
            created_at: new Date().toISOString()
        };
        
        data.contact_messages.push(newMessage);
        return this.saveData(data) ? newMessage : false;
    }
}

// Create global instance
const dataStore = new SimpleDataStore();

// Simple authentication system
class SimpleAuth {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }
    
    loadCurrentUser() {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
        }
    }
    
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('current_user');
        }
    }
    
    login(email, password) {
        const user = dataStore.getUserByEmail(email);
        if (user && user.password === password) { // In production, use proper password hashing
            this.currentUser = {
                id: user.id,
                email: user.email,
                is_admin: user.is_admin
            };
            dataStore.updateUserLogin(email);
            this.saveCurrentUser();
            return this.currentUser;
        }
        return false;
    }
    
    register(email, password) {
        const userData = {
            email: email,
            password: password, // In production, hash this
            is_admin: false
        };
        return dataStore.addUser(userData);
    }
    
    logout() {
        this.currentUser = null;
        this.saveCurrentUser();
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    isAdmin() {
        return this.currentUser && this.currentUser.is_admin;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
}

// Create global auth instance
const auth = new SimpleAuth();