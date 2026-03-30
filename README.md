# Sentinel: Secure Password Audit

A Chrome Extension for analyzing password strength and checking if it has been exposed in data breaches. It consists of a frontend Chrome Extension and a Python backend server.

## Why it might not be working initially
For this project to work, **both the backend server must be running and the extension must be loaded in Chrome**.
If you only try opening `popup.html` or loading the extension without the Python server, it will say "Backend offline. Please start the Python server."

## Setup Instructions

### 1. Start the Python Backend Server
The extension relies on a local Python server to do the heavy lifting of entropy calculation and checking the Have I Been Pwned API.

1. Open your terminal in this project's root folder (`SIC_Project_Password-Strength-Checker`).
2. Activate the virtual environment (if you are using Mac/Linux):
   ```bash
   source .venv/bin/activate
   ```
   *(If you are on Windows, use `.venv\Scripts\activate`)*
3. Install the required dependencies (if you haven't already):
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Start the server:
   ```bash
   python backend/server.py
   ```
   You should see output saying `* Running on http://127.0.0.1:5000`. Keep this terminal window open!

### 2. Load the Extension in Chrome
1. Open Google Chrome and go to the extensions page by typing `chrome://extensions/` in the URL bar.
2. Turn on **Developer mode** using the toggle switch in the top right corner.
3. Click the **Load unpacked** button.
4. Select the `extension` folder found inside this project folder (`SIC_Project_Password-Strength-Checker/extension`).
5. The extension "Sentinel: Secure Password Audit" will now appear in your list.
6. Click on the extension icon in the Chrome toolbar. Type a password and click **Analyze Password**.

**Note:** The extension is now correctly configured to talk to your local backend server!
