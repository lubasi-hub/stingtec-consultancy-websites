// Simple Admin Dashboard
// This replaces the complex admin system

class SimpleAdminDashboard {
    constructor() {
        this.currentTab = 'requests';
    }
    
    init() {
        this.setupEventListeners();
        this.showTab('requests');
        this.loadDashboardData();
    }
    
    setupEventListeners() {
        // Tab switching
        const tabs = document.querySelectorAll('.admin-tab-simple');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = tab.getAttribute('data-tab');
                this.showTab(tabId);
            });
        });
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadDashboardData();
            });
        }
    }
    
    showTab(tabId) {
        this.currentTab = tabId;
        
        // Update active tab
        const tabs = document.querySelectorAll('.admin-tab-simple');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            }
        });
        
        // Show active content
        const contents = document.querySelectorAll('.admin-content-simple');
        contents.forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`${tabId}Tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        // Load data for this tab
        this.loadTabData(tabId);
    }
    
    loadTabData(tabId) {
        switch(tabId) {
            case 'requests':
                this.loadServiceRequests();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'messages':
                this.loadContactMessages();
                break;
        }
    }
    
    loadDashboardData() {
        this.updateStats();
        this.loadTabData(this.currentTab);
    }
    
    updateStats() {
        const requests = dataStore.getAllServiceRequests();
        const users = dataStore.getAllUsers();
        const messages = dataStore.getAllContactMessages();
        
        // Update counts
        const requestCount = document.getElementById('requestCount');
        const userCount = document.getElementById('userCount');
        const messageCount = document.getElementById('messageCount');
        
        if (requestCount) requestCount.textContent = requests.length;
        if (userCount) userCount.textContent = users.length;
        if (messageCount) messageCount.textContent = messages.length;
        
        // Update pending requests
        const pendingRequests = requests.filter(r => r.status === 'pending').length;
        const pendingCount = document.getElementById('pendingCount');
        if (pendingCount) pendingCount.textContent = pendingRequests;
    }
    
    loadServiceRequests() {
        const requests = dataStore.getAllServiceRequests();
        const tbody = document.getElementById('requestsTableBody');
        
        if (!tbody) return;
        
        if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No service requests yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = requests.map(request => {
            const createdAt = new Date(request.created_at).toLocaleString();
            const statusClass = this.getStatusClass(request.status);
            
            return `
                <tr>
                    <td>#${request.id}</td>
                    <td>${request.customer_name}<br><small>${request.customer_email}</small></td>
                    <td>${request.service_name}</td>
                    <td>${request.service_category}</td>
                    <td>${request.customer_phone}</td>
                    <td><span class="status-badge ${statusClass}">${request.status}</span></td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="btn btn-small btn-primary" onclick="adminDashboard.viewRequest(${request.id})">View</button>
                        <button class="btn btn-small btn-warning" onclick="adminDashboard.updateRequestStatus(${request.id})">Update</button>
                        <button class="btn btn-small btn-danger" onclick="adminDashboard.deleteRequest(${request.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    loadUsers() {
        const users = dataStore.getAllUsers();
        const tbody = document.getElementById('usersTableBody');
        
        if (!tbody) return;
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No users registered</td></tr>';
            return;
        }
        
        tbody.innerHTML = users.map(user => {
            const createdAt = new Date(user.created_at).toLocaleDateString();
            const lastLogin = user.last_login ? new Date(user.last_login).toLocaleString() : 'Never';
            const userType = user.is_admin ? 'Admin' : 'User';
            
            return `
                <tr>
                    <td>${user.email}</td>
                    <td>${userType}</td>
                    <td>${createdAt}</td>
                    <td>${lastLogin}</td>
                </tr>
            `;
        }).join('');
    }
    
    loadContactMessages() {
        const messages = dataStore.getAllContactMessages();
        const tbody = document.getElementById('messagesTableBody');
        
        if (!tbody) return;
        
        if (messages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No contact messages</td></tr>';
            return;
        }
        
        tbody.innerHTML = messages.map(message => {
            const createdAt = new Date(message.created_at).toLocaleString();
            
            return `
                <tr>
                    <td>${message.name}</td>
                    <td>${message.email}</td>
                    <td>${message.subject}</td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="btn btn-small btn-primary" onclick="adminDashboard.viewMessage(${message.id})">View</button>
                        <button class="btn btn-small btn-danger" onclick="adminDashboard.deleteMessage(${message.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    getStatusClass(status) {
        switch(status) {
            case 'pending': return 'status-pending';
            case 'in_progress': return 'status-progress';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-pending';
        }
    }
    
    viewRequest(requestId) {
        const requests = dataStore.getAllServiceRequests();
        const request = requests.find(r => r.id === requestId);
        
        if (request) {
            const message = `
                Service Request Details:
                
                ID: #${request.id}
                Customer: ${request.customer_name}
                Email: ${request.customer_email}
                Phone: ${request.customer_phone}
                Service: ${request.service_name}
                Category: ${request.service_category}
                Status: ${request.status}
                Message: ${request.message || 'No additional message'}
                Submitted: ${new Date(request.created_at).toLocaleString()}
            `;
            alert(message);
        }
    }
    
    updateRequestStatus(requestId) {
        const newStatus = prompt('Enter new status (pending, in_progress, completed, cancelled):');
        if (newStatus && ['pending', 'in_progress', 'completed', 'cancelled'].includes(newStatus)) {
            if (dataStore.updateServiceRequestStatus(requestId, newStatus)) {
                alert('Status updated successfully!');
                this.loadServiceRequests();
                this.updateStats();
            } else {
                alert('Failed to update status');
            }
        }
    }
    
    deleteRequest(requestId) {
        if (confirm('Are you sure you want to delete this service request?')) {
            if (dataStore.deleteServiceRequest(requestId)) {
                alert('Request deleted successfully!');
                this.loadServiceRequests();
                this.updateStats();
            } else {
                alert('Failed to delete request');
            }
        }
    }
    
    viewMessage(messageId) {
        const messages = dataStore.getAllContactMessages();
        const message = messages.find(m => m.id === messageId);
        
        if (message) {
            const messageContent = `
                Contact Message:
                
                From: ${message.name} <${message.email}>
                Subject: ${message.subject}
                Message: ${message.message}
                Sent: ${new Date(message.created_at).toLocaleString()}
            `;
            alert(messageContent);
        }
    }
    
    deleteMessage(messageId) {
        if (confirm('Are you sure you want to delete this message?')) {
            const messages = dataStore.getAllContactMessages();
            const index = messages.findIndex(m => m.id === messageId);
            if (index !== -1) {
                messages.splice(index, 1);
                // We need to save the updated messages array
                const data = dataStore.loadData();
                if (data) {
                    data.contact_messages = messages;
                    if (dataStore.saveData(data)) {
                        alert('Message deleted successfully!');
                        this.loadContactMessages();
                        this.updateStats();
                    } else {
                        alert('Failed to delete message');
                    }
                }
            }
        }
    }
}

// Create global admin dashboard instance
const adminDashboard = new SimpleAdminDashboard();