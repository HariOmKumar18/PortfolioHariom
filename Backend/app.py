import os
import re
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


# =========================================================
# CREATE FLASK APP
# =========================================================

app = Flask(__name__)


# =========================================================
# CORS CONFIGURATION
# Allows local testing and GitHub Pages
# =========================================================
# =========================================================
# CORS CONFIGURATION
# =========================================================

CORS(
    app,
    resources={
        r"/send-message": {
            "origins": [
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "http://127.0.0.1:5501",
                "http://localhost:5501",
                "http://127.0.0.1:5502",
                "http://localhost:5502",
                "https://hariomkumar18.github.io",
            ]
        }
    },
)


# =========================================================
# GMAIL SMTP CONFIGURATION
# =========================================================

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_TO = os.getenv("EMAIL_TO")


# =========================================================
# EMAIL VALIDATION
# =========================================================

def is_valid_email(email):
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(pattern, email) is not None

# =========================================================
# HOME ROUTE
# =========================================================


@app.route("/", methods=["GET"])
def home():

    return jsonify(
        {"status": "online", "service": "Hari Om Kumar Portfolio Contact API"}
    )


# =========================================================
# CONTACT FORM API
# =========================================================


@app.route("/send-message", methods=["POST"])
def send_message():

    # -----------------------------------------------------
    # Check request format
    # -----------------------------------------------------

    if not request.is_json:
        return jsonify({"success": False, "message": "Invalid request format."}), 400

    data = request.get_json()

    # -----------------------------------------------------
    # Get form data
    # -----------------------------------------------------

    name = str(data.get("name", "")).strip()

    visitor_email = str(data.get("email", "")).strip()

    message = str(data.get("message", "")).strip()

    # -----------------------------------------------------
    # Validate name
    # -----------------------------------------------------

    if not name:
        return jsonify({"success": False, "message": "Please enter your name."}), 400

    if len(name) > 100:
        return jsonify({"success": False, "message": "Name is too long."}), 400

    # -----------------------------------------------------
    # Validate email
    # -----------------------------------------------------

    if not visitor_email:
        return jsonify({"success": False, "message": "Please enter your email."}), 400

    if not is_valid_email(visitor_email):
        return jsonify(
            {"success": False, "message": "Please enter a valid email address."}
        ), 400

    # -----------------------------------------------------
    # Validate message
    # -----------------------------------------------------

    if not message:
        return jsonify({"success": False, "message": "Please enter your message."}), 400

    if len(message) > 5000:
        return jsonify({"success": False, "message": "Message is too long."}), 400

    # -----------------------------------------------------
    # Check email configuration
    # -----------------------------------------------------

    if not EMAIL_USER:
        print("ERROR: EMAIL_USER is missing.")

        return jsonify(
            {"success": False, "message": "Email sender is not configured."}
        ), 500

    if not EMAIL_PASSWORD:
        print("ERROR: EMAIL_PASSWORD is missing.")

        return jsonify(
            {"success": False, "message": "Gmail App Password is not configured."}
        ), 500

    if not EMAIL_TO:
        print("ERROR: EMAIL_TO is missing.")

        return jsonify(
            {"success": False, "message": "Email receiver is not configured."}
        ), 500

    # =====================================================
    # CREATE EMAIL
    # =====================================================

    email = EmailMessage()

    email["Subject"] = f"New Portfolio Message from {name}"

    email["From"] = EMAIL_USER

    email["To"] = EMAIL_TO

    email["Reply-To"] = visitor_email

    email.set_content(
        f"""New message received from your portfolio website.

Name:
{name}

Visitor Email:
{visitor_email}

Message:
{message}

--------------------------------
Hari Om Kumar
Portfolio Website
"""
    )

    # =====================================================
    # SEND EMAIL USING GMAIL SMTP
    # =====================================================

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30) as server:
            server.ehlo()

            server.starttls()

            server.ehlo()

            server.login(EMAIL_USER, EMAIL_PASSWORD)

            server.send_message(email)

        print(f"Email successfully sent from {visitor_email}")

        return jsonify(
            {"success": True, "message": "Your message has been sent successfully!"}
        ), 200

    # -----------------------------------------------------
    # Gmail authentication error
    # -----------------------------------------------------

    except smtplib.SMTPAuthenticationError:
        print("ERROR: Gmail authentication failed.")

        return jsonify(
            {
                "success": False,
                "message": (
                    "Gmail authentication failed. Please check your Gmail App Password."
                ),
            }
        ), 500

    # -----------------------------------------------------
    # SMTP error
    # -----------------------------------------------------

    except smtplib.SMTPException as error:
        print(f"SMTP ERROR: {error}")

        return jsonify(
            {"success": False, "message": ("Gmail could not send the message.")}
        ), 500

    # -----------------------------------------------------
    # Network error
    # -----------------------------------------------------

    except OSError as error:
        print(f"NETWORK ERROR: {error}")

        return jsonify(
            {"success": False, "message": ("Could not connect to Gmail.")}
        ), 500


# =========================================================
# START FLASK SERVER
# =========================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=False)
