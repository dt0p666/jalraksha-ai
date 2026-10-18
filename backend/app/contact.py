"""Contact message storage and validation for JALRAKSHAK AI."""

from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
import re
from typing import Any, Dict, List, Optional, Tuple
import uuid

HISTORY_DIR = Path(__file__).resolve().parent / "history"
MESSAGES_FILE = HISTORY_DIR / "messages.json"
EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_contact_payload(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """Validate submitted contact fields."""
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    topic = str(data.get("topic", "")).strip()
    message = str(data.get("message", "")).strip()

    if len(name) < 2 or len(name) > 100:
        return False, "Name must be between 2 and 100 characters."
    if not EMAIL_REGEX.match(email) or len(email) > 150:
        return False, "Please provide a valid email address."
    if topic not in ["Question", "Feedback", "Report a bug", "Collaboration", "General"]:
        return False, "Invalid topic selected."
    if len(message) < 5 or len(message) > 2000:
        return False, "Message must be between 5 and 2000 characters."

    return True, None


def save_contact_message(data: Dict[str, Any]) -> Dict[str, Any]:
    """Store contact message into history/messages.json."""
    HISTORY_DIR.mkdir(parents=True, exist_ok=True)

    ref_id = f"REF-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    timestamp = datetime.now(timezone.utc).isoformat()

    record = {
        "reference_id": ref_id,
        "timestamp": timestamp,
        "name": data.get("name", "").strip(),
        "email": data.get("email", "").strip(),
        "topic": data.get("topic", "").strip(),
        "message": data.get("message", "").strip(),
        "utm": {
            "source": data.get("utm_source"),
            "medium": data.get("utm_medium"),
            "campaign": data.get("utm_campaign"),
            "term": data.get("utm_term"),
            "content": data.get("utm_content"),
        },
    }

    messages: List[Dict[str, Any]] = []
    if MESSAGES_FILE.is_file():
        try:
            with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
                messages = json.load(f)
        except Exception:
            messages = []

    messages.append(record)

    with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
        json.dump(messages, f, indent=2)

    return {
        "success": True,
        "reference_id": ref_id,
        "timestamp": timestamp,
        "message": "Message saved to local server storage. Note: no external emails are dispatched.",
    }


def list_contact_messages() -> List[Dict[str, Any]]:
    """Retrieve saved messages for review or instructor inspection."""
    if not MESSAGES_FILE.is_file():
        return []
    try:
        with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []
