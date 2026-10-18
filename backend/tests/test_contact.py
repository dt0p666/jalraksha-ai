"""Tests for contact messaging validation and persistence."""

import pytest
from app.contact import save_contact_message, validate_contact_payload, list_contact_messages


def test_contact_validation():
    """Verify field requirements and email format."""
    # Invalid: missing email
    valid, err = validate_contact_payload({
        "name": "Arjun",
        "email": "notanemail",
        "topic": "Question",
        "message": "Water pressure inquiry."
    })
    assert not valid
    assert "email" in err.lower()

    # Valid payload
    valid, err = validate_contact_payload({
        "name": "Dr. Ramesh",
        "email": "ramesh@waterboard.gov.in",
        "topic": "Feedback",
        "message": "Excellent educational simulator for rural engineers."
    })
    assert valid
    assert err is None


def test_contact_storage_and_reference_id():
    """Verify saved message generates reference ID and persists."""
    payload = {
        "name": "Priya Sharma",
        "email": "priya@example.org",
        "topic": "Question",
        "message": "How often are physical samples recalibrated?",
        "utm_source": "demo",
        "utm_medium": "web",
    }
    res = save_contact_message(payload)
    assert res["success"] is True
    assert res["reference_id"].startswith("REF-")

    messages = list_contact_messages()
    assert any(m["reference_id"] == res["reference_id"] for m in messages)
