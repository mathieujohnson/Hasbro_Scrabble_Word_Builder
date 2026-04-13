import pytest
from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "server is up"}


def test_letter_scores():
    response = client.get("/letter_scores")
    assert response.status_code == 200
    assert "scores" in response.json()
    assert isinstance(response.json()["scores"], dict)


def test_letter_distribution():
    response = client.get("/letter_distribution")
    assert response.status_code == 200
    assert "tiles_qty" in response.json()


def test_dictionary():
    response = client.get("/dictionary")
    assert response.status_code == 200
    assert "words" in response.json()


def test_rack_valid():
    response = client.get("/rack/abc")
    assert response.status_code == 200
    data = response.json()

    assert data["rack"] == "abc"
    assert "highest_scored_word" in data
    assert "score" in data


def test_rack_invalid_length():
    response = client.get("/rack/abcdefgh")  # >7 letters
    assert response.status_code == 400
    assert "Invalid rack" in response.json()["detail"]


def test_rack_and_word_valid():
    response = client.get("/rack/abc/word/a")
    assert response.status_code == 200

    data = response.json()
    assert data["rack"] == "abc"
    assert data["word"] == "a"
    assert "score" in data
    assert "tiles_used" in data


def test_rack_and_word_invalid():
    response = client.get("/rack/zzzzzzz/word/zz")
    assert response.status_code == 400