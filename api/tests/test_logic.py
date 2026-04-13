import pytest
from fastapi import HTTPException

from api.main import validate_input, get_highest_scored_word, compute_highest_scored_word


@pytest.fixture
def mock_tile_data(monkeypatch):
    def fake_tile_qty():
        return {"a": 9, "b": 2, "c": 2}

    monkeypatch.setattr("api.main.get_game_tile_qty", fake_tile_qty)


@pytest.fixture
def mock_dictionary(monkeypatch):
    def fake_dict():
        return {
            "draw": {"score": 8},
            "wizard": {"score": 19},
            "cab": {"score": 7},
        }

    monkeypatch.setattr("api.main.get_dictionary_with_scores", fake_dict)


def test_validate_input_valid(mock_tile_data):
    # should not raise
    validate_input("abc")


def test_validate_input_too_long(mock_tile_data):
    with pytest.raises(HTTPException) as exc:
        validate_input("abcdefgh")

    assert exc.value.status_code == 400


def test_validate_input_exceeds_tile_count(mock_tile_data):
    with pytest.raises(HTTPException) as exc:
        validate_input("bbb")

    assert exc.value.status_code == 400

    with pytest.raises(HTTPException):
        validate_input("aidoorz", "quiz")

    assert exc.value.status_code == 400


def test_get_highest_scored_word(mock_dictionary):
    word, score = get_highest_scored_word("aidoorw")

    assert score >= 0
    assert isinstance(word, str)


def test_compute_highest_scored_word():
    word, score = get_highest_scored_word("aidoorw", "wiz")

    assert word == "wizard"
    assert score == 19
