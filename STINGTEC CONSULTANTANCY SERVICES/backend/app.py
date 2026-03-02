# STINGTEC Backend API
# Flask backend with SQLite database

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import sqlite3
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'stingtec-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
jwt = JWTManager(app)

DATABASE = 'stingtec.db'

# Admin credentials (in production, store hashed in database)
ADMIN_EMAIL = 'stingteczambiasales@gmail.com'
ADMIN_PASSWORD_HASH = generate_password_hash('stingtec 1234')

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DATABASE):
        conn = get_db()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        ''')
        
        # Services table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                icon TEXT DEFAULT 'fa-star',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Blogs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Service Bookings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS service_bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                customer_email TEXT NOT NULL,
                customer_phone TEXT NOT NULL,
                service_category TEXT NOT NULL,
                service_name TEXT NOT NULL,
                message TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insert default admin user
        cursor.execute('''
            INSERT INTO users (email, password_hash, is_admin)
            VALUES (?, ?, 1)
        ''', (ADMIN_EMAIL, ADMIN_PASSWORD_HASH))
        
        # Insert sample services
        sample_services = [
            ('Business Strategy', 'Strategic planning and business development services to help you achieve your goals.', 'fa-chess'),
            ('Financial Advisory', 'Expert financial guidance and planning for sustainable business growth.', 'fa-coins'),
            ('Technology Solutions', 'Digital transformation and technology implementation for modern businesses.', 'fa-laptop-code'),
            ('Marketing Consultancy', 'Effective marketing strategies to boost your brand presence and reach.', 'fa-bullhorn')
        ]
        cursor.executemany('''
            INSERT INTO services (title, description, icon)
            VALUES (?, ?, ?)
        ''', sample_services)
        
        # Insert sample blog
        cursor.execute('''
            INSERT INTO blogs (title, content)
            VALUES (?, ?)
        ''', ('Welcome to Our Blog', 'Stay tuned for upcoming articles and insights from our consultancy experts.'))
        
        conn.commit()
        conn.close()
        print("Database initialized successfully!")

# Initialize database on startup
init_db()

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'User already exists'}), 409
    
    # Create new user
    password_hash = generate_password_hash(password)
    cursor.execute('''
        INSERT INTO users (email, password_hash, is_admin)
        VALUES (?, ?, 0)
    ''', (email, password_hash))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    
    if not user or not check_password_hash(user['password_hash'], password):
        conn.close()
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Update last login
    cursor.execute('''
        UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
    ''', (user['id'],))
    conn.commit()
    
    # Create access token
    access_token = create_access_token(identity={
        'id': user['id'],
        'email': user['email'],
        'is_admin': bool(user['is_admin'])
    })
    
    conn.close()
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'is_admin': bool(user['is_admin'])
        }
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user = get_jwt_identity()
    return jsonify({'user': current_user}), 200

# ==================== USERS ROUTES ====================

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()
    
    # Only admin can see all users
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, email, is_admin, created_at, last_login 
        FROM users ORDER BY created_at DESC
    ''')
    users = cursor.fetchall()
    conn.close()
    
    return jsonify({
        'users': [dict(user) for user in users]
    }), 200

# ==================== SERVICES ROUTES ====================

@app.route('/api/services', methods=['GET'])
def get_services():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM services ORDER BY created_at DESC')
    services = cursor.fetchall()
    conn.close()
    
    return jsonify({
        'services': [dict(service) for service in services]
    }), 200

@app.route('/api/services', methods=['POST'])
@jwt_required()
def create_service():
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    icon = data.get('icon', 'fa-star')
    
    if not title or not description:
        return jsonify({'error': 'Title and description are required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO services (title, description, icon)
        VALUES (?, ?, ?)
    ''', (title, description, icon))
    
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'message': 'Service created successfully',
        'id': new_id
    }), 201

@app.route('/api/services/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    icon = data.get('icon')
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE services 
        SET title = ?, description = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (title, description, icon, service_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Service updated successfully'}), 200

@app.route('/api/services/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM services WHERE id = ?', (service_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Service deleted successfully'}), 200

# ==================== BLOGS ROUTES ====================

@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM blogs ORDER BY created_at DESC')
    blogs = cursor.fetchall()
    conn.close()
    
    return jsonify({
        'blogs': [dict(blog) for blog in blogs]
    }), 200

@app.route('/api/blogs', methods=['POST'])
@jwt_required()
def create_blog():
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    image_url = data.get('image_url')
    
    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO blogs (title, content, image_url)
        VALUES (?, ?, ?)
    ''', (title, content, image_url))
    
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'message': 'Blog post created successfully',
        'id': new_id
    }), 201

@app.route('/api/blogs/<int:blog_id>', methods=['PUT'])
@jwt_required()
def update_blog(blog_id):
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    image_url = data.get('image_url')
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE blogs 
        SET title = ?, content = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (title, content, image_url, blog_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Blog post updated successfully'}), 200

@app.route('/api/blogs/<int:blog_id>', methods=['DELETE'])
@jwt_required()
def delete_blog(blog_id):
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM blogs WHERE id = ?', (blog_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Blog post deleted successfully'}), 200

# ==================== CONTACT ROUTE ====================

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')
    
    if not all([name, email, subject, message]):
        return jsonify({'error': 'All fields are required'}), 400
    
    # Send email notification
    try:
        # Email configuration - in production, use environment variables
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        sender_email = os.getenv('SENDER_EMAIL', 'stingteczambiasales@gmail.com')
        sender_password = os.getenv('SENDER_PASSWORD', 'your_app_password_here')
        
        # Skip email sending if using default credentials
        if sender_password == 'your_app_password_here':
            print(f"Contact form submission from {name} ({email}): {subject} - EMAIL SKIPPED (set SENDER_PASSWORD to enable)")
            print("INFO: To enable email notifications, set environment variables:")
            print("  - SENDER_EMAIL: your email address")
            print("  - SENDER_PASSWORD: your app password (not account password)")
            print("  - SMTP_SERVER: your SMTP server (default: smtp.gmail.com)")
            print("  - SMTP_PORT: your SMTP port (default: 587)")
        else:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = sender_email  # Send to the business email
            msg['Subject'] = f"New Contact Form Submission: {subject}"
            
            # Email body
            body = f"""\
            New contact form submission received:
            
            Name: {name}
            Email: {email}
            Subject: {subject}
            Message: {message}
            
            Sent on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Connect to server and send email
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()  # Enable encryption
            server.login(sender_email, sender_password)
            text = msg.as_string()
            server.sendmail(sender_email, sender_email, text)
            server.quit()
            
            print(f"Contact form submission from {name} ({email}): {subject} - EMAIL SENT SUCCESSFULLY")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        # Continue anyway - don't fail the request if email fails
    
    return jsonify({'message': 'Message sent successfully'}), 200

# ==================== SERVICE BOOKINGS ROUTES ====================

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    customer_phone = data.get('customer_phone')
    service_category = data.get('service_category')
    service_name = data.get('service_name')
    message = data.get('message', '')
    
    if not all([customer_name, customer_email, customer_phone, service_category, service_name]):
        return jsonify({'error': 'All required fields must be provided'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO service_bookings (customer_name, customer_email, customer_phone, service_category, service_name, message, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
    ''', (customer_name, customer_email, customer_phone, service_category, service_name, message))
    conn.commit()
    booking_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'message': 'Service request submitted successfully', 'booking_id': booking_id}), 201

@app.route('/api/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM service_bookings ORDER BY created_at DESC')
    bookings = cursor.fetchall()
    conn.close()
    
    bookings_list = []
    for booking in bookings:
        bookings_list.append({
            'id': booking['id'],
            'customer_name': booking['customer_name'],
            'customer_email': booking['customer_email'],
            'customer_phone': booking['customer_phone'],
            'service_category': booking['service_category'],
            'service_name': booking['service_name'],
            'message': booking['message'],
            'status': booking['status'],
            'created_at': booking['created_at'],
            'updated_at': booking['updated_at']
        })
    
    return jsonify(bookings_list), 200

@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM service_bookings WHERE id = ?', (booking_id,))
    booking = cursor.fetchone()
    conn.close()
    
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    return jsonify({
        'id': booking['id'],
        'customer_name': booking['customer_name'],
        'customer_email': booking['customer_email'],
        'customer_phone': booking['customer_phone'],
        'service_category': booking['service_category'],
        'service_name': booking['service_name'],
        'message': booking['message'],
        'status': booking['status'],
        'created_at': booking['created_at'],
        'updated_at': booking['updated_at']
    }), 200

@app.route('/api/bookings/<int:booking_id>', methods=['PUT'])
@jwt_required()
def update_booking_status(booking_id):
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    status = data.get('status')
    
    if status not in ['pending', 'in_progress', 'completed', 'cancelled']:
        return jsonify({'error': 'Invalid status'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE service_bookings 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (status, booking_id))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Booking status updated successfully'}), 200

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def delete_booking(booking_id):
    current_user = get_jwt_identity()
    
    if not current_user.get('is_admin'):
        return jsonify({'error': 'Admin access required'}), 403
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM service_bookings WHERE id = ?', (booking_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Booking deleted successfully'}), 200

# Test endpoint for debugging
@app.route('/api/test-auth', methods=['GET'])
def test_auth():
    try:
        current_user = get_jwt_identity()
        return jsonify({'message': 'Auth working', 'user': current_user}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 401

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
