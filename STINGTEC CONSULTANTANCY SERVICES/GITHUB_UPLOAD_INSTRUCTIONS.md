# Uploading Your STINGTEC Website to GitHub

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Log in to your account (kamwilubasi3-gif)
3. Click the green "New" button to create a new repository
4. Enter a repository name (e.g., "stingtec-consultancy-website")
5. Choose "Public" (or "Private" if you prefer)
6. Check "Add a README file"
7. Click "Create repository"

## Step 2: Upload Your Files

### Option A: Drag and Drop Method (Recommended for beginners)

1. Go to your newly created GitHub repository
2. You'll see a section that says "Drag files here to add to your repository"
3. Open File Explorer and navigate to your project folder:
   ```
   c:\Users\Computer\Documents\STINGTEC CONSULTANTANCY SERVICES
   ```
4. Select ALL files and folders in this directory
5. Drag them to the drag-and-drop area on GitHub
6. Wait for the upload to complete
7. Click "Commit changes"

### Option B: Upload ZIP File

1. The ZIP file of your project is located at:
   ```
   c:\Users\Computer\Documents\STINGTEC-CONSULTANTANCY-SERVICES-PROJECT.zip
   ```
2. Go to your GitHub repository
3. Click "Add file" → "Upload files"
4. Drag and drop the ZIP file or click to select it
5. Extract the ZIP file contents and commit the changes

## Step 3: Configure GitHub Pages (Optional)

To make your website live on GitHub:

1. In your repository, go to the "Settings" tab
2. Scroll down to the "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"
6. Wait a few minutes for GitHub Pages to deploy
7. Your site will be available at: `https://kamwilubasi3-gif.github.io/[repository-name]`

## Project Structure

Your project contains:

### Backend (Server-side)
- `backend/app.py` - Flask application server
- `backend/requirements.txt` - Python dependencies
- `backend/stingtec.db` - SQLite database

### Frontend (Client-side)
- `frontend/index.html` - Main website
- `frontend/styles.css` - Styling
- `frontend/app.js` - JavaScript functionality
- `frontend/data.js` - Simple data storage system
- `frontend/simple-app.js` - Simplified application logic
- `frontend/admin-dashboard.html` - Admin dashboard
- `frontend/admin.js` - Admin dashboard functionality
- `frontend/api.js` - API client (legacy)
- `frontend/img*.jpg` - Image files
- `frontend/logo.png` - Logo file

### Other Files
- `README.md` - Project documentation
- `start_application.bat` - Windows startup script
- `setup_env.bat` - Environment setup script

## Features

1. **User Registration & Login** - Secure authentication system
2. **Service Booking System** - Customers can request services
3. **Admin Dashboard** - Manage users, services, and requests
4. **Contact Form** - With message storage
5. **Responsive Design** - Works on desktop and mobile
6. **Official Organization Logos** - Updated with authentic government body logos

## Important Notes

- The backend server runs on port 5000
- Default admin credentials: stingteczambiasales@gmail.com / stingtec1234
- All data is stored in the browser's localStorage in the simplified version
- For production deployment, you'll need to set up a proper web server

## GitHub Repository Best Practices

1. Add a descriptive README.md file (you can use the content below)
2. Include a LICENSE file
3. Add relevant tags and topics
4. Pin the repository to your profile if it's important

---

# STINGTEC BUSINESS CONSULTANTS Website

This is the complete website for STINGTEC BUSINESS CONSULTANTS - Your Partner in Business Growth & Compliance in Zambia.

## Features

- User registration and login system
- Service booking functionality
- Admin dashboard for managing requests
- Responsive design for all devices
- Official government organization logos for each service

## Installation

1. Clone this repository
2. Open `frontend/index.html` in your browser to run the frontend
3. For backend functionality, run `backend/app.py` with Python

## Contributing

Feel free to fork this repository and submit pull requests.

## License

This project is licensed under the MIT License.