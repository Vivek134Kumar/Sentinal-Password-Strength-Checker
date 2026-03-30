from flask import Flask, request, jsonify
from flask_cors import CORS
from zxcvbn import zxcvbn
import hashlib
import requests
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for Chrome Extension requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HIBP_API_URL = "https://api.pwnedpasswords.com/range/"

def check_pwned_api(password):
    """
    Checks the password against the Have I Been Pwned API using k-anonymity.
    Returns the number of times the password has been breached.
    """
    try:
        # Hash the password using SHA-1
        sha1password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
        first5_char = sha1password[:5]
        tail = sha1password[5:]

        # Query the API with the first 5 characters
        response = requests.get(HIBP_API_URL + first5_char, timeout=5)
        if response.status_code != 200:
            logger.error(f"Error fetching from HIBP API: {response.status_code}")
            return 0

        # Scan the response for the matching suffix
        hashes = (line.split(':') for line in response.text.splitlines())
        for h, count in hashes:
            if h == tail:
                return int(count)
        return 0
    except Exception as e:
        logger.error(f"Exception in check_pwned_api: {e}")
        return 0

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data or 'password' not in data:
            return jsonify({'error': 'Password is required'}), 400

        password = data['password']

        # 1. Entropy Analysis using zxcvbn
        results = zxcvbn(password)
        
        # 2. Breach Detection using HIBP
        breach_count = check_pwned_api(password)

        # Construct the response
        response_data = {
            'score': results['score'],  # 0-4
            'crack_time_display': results['crack_times_display']['offline_slow_hashing_1e4_per_second'],
            'feedback': results['feedback'],
            'breach_count': breach_count
        }

        return jsonify(response_data)

    except Exception as e:
        logger.exception("An error occurred during analysis")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Running on 0.0.0.0 to ensure it's accessible (though extension uses 127.0.0.1)
    app.run(debug=True, port=5000)
