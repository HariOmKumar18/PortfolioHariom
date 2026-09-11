import os
import re
import requests

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

# --------------------------------------------------
# CORS
# --------------------------------------------------

CORS(
    app,
    resources={
        r"/send-message": {
            "origins": [
                "https://hariomkumar18.github.io",
                "http://127.0.0.1:5500",
                "http://localhost:5500"
            ]
        }
    }
)

# --------------------------------------------------
# Brevo Configuration
# --------------------------------------------------

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL")
EMAIL_TO = os.getenv("EMAIL_TO")

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


# --------------------------------------------------
# Email Validation
# --------------------------------------------------

def is_valid_email(email):
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(pattern, email) is not None


# --------------------------------------------------
# Home
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "online",
        "service": "Hari Om Kumar Portfolio Contact API"
    })


# --------------------------------------------------
# Send Contact Message
# --------------------------------------------------

@app.route("/send-message", methods=["POST"])
def send_message():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        # Validate name
        if not name:
            return jsonify({
                "success": False,
                "message": "Name is required."
            }), 400

        # Validate email
        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400

        if not is_valid_email(email):
            return jsonify({
                "success": False,
                "message": "Please enter a valid email address."
            }), 400

        # Validate message
        if not message:
            return jsonify({
                "success": False,
                "message": "Message is required."
            }), 400

        # Check Brevo configuration
        if not BREVO_API_KEY:
            print("ERROR: BREVO_API_KEY is missing")
            return jsonify({
                "success": False,
                "message": "Email service is not configured."
            }), 500

        if not BREVO_SENDER_EMAIL:
            print("ERROR: BREVO_SENDER_EMAIL is missing")
            return jsonify({
                "success": False,
                "message": "Sender email is not configured."
            }), 500

        if not EMAIL_TO:
            print("ERROR: EMAIL_TO is missing")
            return jsonify({
                "success": False,
                "message": "Recipient email is not configured."
            }), 500

        # --------------------------------------------------
        # Create email
        # --------------------------------------------------

        subject = f"New Portfolio Message from {name}"

        text_content = f"""
You received a new message from your portfolio website.

Name:
{name}

Email:
{email}

Message:
{message}

--------------------------------
Hari Om Kumar Portfolio
"""

        payload = {
            "sender": {
                "name": "Hari Om Kumar Portfolio",
                "email": BREVO_SENDER_EMAIL
            },
            "to": [
                {
                    "email": EMAIL_TO,
                    "name": "Hari Om Kumar"
                }
            ],
            "replyTo": {
                "email": email,
                "name": name
            },
            "subject": subject,
            "textContent": text_content
        }

        headers = {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        }

        # --------------------------------------------------
        # Send through Brevo HTTPS API
        # --------------------------------------------------

        response = requests.post(
            BREVO_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )

        print("Brevo Status:", response.status_code)

        if response.status_code in [200, 201, 202]:

            return jsonify({
                "success": True,
                "message": "Your message has been sent successfully!"
            }), 200

        print("Brevo Error:", response.text)

        return jsonify({
            "success": False,
            "message": "Unable to send your message."
        }), 500

    except requests.exceptions.RequestException as error:

        print("Brevo connection error:", error)

        return jsonify({
            "success": False,
            "message": "Could not connect to the email service."
        }), 500

    except Exception as error:

        print("Unexpected error:", error)

        return jsonify({
            "success": False,
            "message": "An unexpected error occurred."
        }), 500


# --------------------------------------------------
# Local Development
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
