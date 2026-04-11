# import uvicorn
import json
import os
from collections import Counter
from itertools import permutations
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, HTTPException

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    valid_words = get_dictionary_with_scores()
    return {"words": valid_words}


@app.get("/rack/{rack}")
async def only_rack(rack: str):
    validate_input(rack)
    highest_scored_word, score = get_highest_scored_word(rack)
    return {"rack": rack, "highest_scored_word": highest_scored_word, "score": score}


@app.get("/rack/{rack}/word/{word}")
async def rack_and_word(rack: str, word: str):
    validate_input(rack, word)
    highest_scored_word, score = get_highest_scored_word(rack, word)
    if word in highest_scored_word:
        expending = True
    else:
        expending = False
    tiles_used = highest_scored_word
    for letter in word:
        if letter in tiles_used:
            tiles_used = tiles_used.replace(letter, "", 1)
            if not expending:
                break
    return {"rack": rack, "word": word, "highest_scored_word": highest_scored_word, "score": score,
            "expending": expending, "tiles_used": tiles_used}


def validate_input(rack: str, word: Optional[str] = ""):
    if len(rack) > 7:
        raise HTTPException(status_code=400, detail="Invalid rack, only 7 letters allowed")

    # get tile quantities for input and game
    input_tile_qty = Counter((rack + word).lower())
    game_tile_qty = get_game_tile_qty()

    for letter in input_tile_qty:
        if input_tile_qty[letter] > game_tile_qty[letter]:
            if letter in rack and letter in word:
                error = "Double check your rack and word"
            elif letter in rack:
                error = "Double check your rack"
            else:
                error = "Double check your word"
            raise HTTPException(status_code=400,
                                detail=f"there's only {game_tile_qty[letter]} {letter.upper()} tile in the game. {error}")


def get_game_tile_qty():
    with open(os.path.join(os.path.dirname(__file__), "letter_data.json"), "r", encoding='utf-8') as f:
        data = json.load(f)
        return {item[0]: item[1].get("tile_quantity") for item in data.items()}


def get_game_tile_scores():
    with open(os.path.join(os.path.dirname(__file__), "letter_data.json"), "r", encoding='utf-8') as f:
        data = json.load(f)
        return {item[0]: item[1].get("score") for item in data.items()}


def get_dictionary_with_scores():
    tile_scores = get_game_tile_scores()
    valid_words = {}
    with open(os.path.join(os.path.dirname(__file__), "dictionary.txt"), "r") as f:
        for word in f.readlines():
            word = word.strip()
            score = sum([tile_scores[letter] for letter in word])
            valid_words.update({word: {"score": score}})
    return valid_words


def get_highest_scored_word(rack, word=""):
    valid_words = get_dictionary_with_scores()

    highest = "", 0
    for letter in word:
        input_tiles = rack + letter
        highest_scored_word, score = compute_highest_scored_word(valid_words, input_tiles)
        if score > highest[1]:
            highest = highest_scored_word, score

    highest_scored_word, score = compute_highest_scored_word(valid_words, rack, word)
    if score > highest[1]:
        highest = highest_scored_word, score
    return highest


def compute_highest_scored_word(valid_words, input_tiles, word=""):
    offset = 0 if len(word) > 0 else 1  # keeps at least 2 characters unless there's a word

    input_permutations = []
    permutable_input = [word, *input_tiles]

    for i in range(len(input_tiles) - offset):
        permutations_list = ["".join(permutation) for permutation in
                             permutations(permutable_input, len(permutable_input) - i)]
        permutations_list = [permutation for permutation in permutations_list if len(permutation) > len(word)]
        permutations_list = sorted(permutations_list)
        input_permutations.extend(permutations_list)

    local_highest = "No word found", 0
    for permutation in input_permutations:
        if valid_words.get(permutation, None) and valid_words[permutation].get("score") > local_highest[1]:
            local_highest = permutation, valid_words[permutation].get("score")

    return local_highest

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)
