import './Form.css';
import Rack from "./Rack.tsx";
import * as React from "react";
import {type Dispatch, type SetStateAction, useRef, useState} from "react";

import {tileScoresType} from "../interfaces.ts";

type inputProps = {
    word: string;
    setWord: Dispatch<SetStateAction<string>>;
    tileScores: tileScoresType;
    setHighestScoredWord: Dispatch<SetStateAction<string>>;
    setScore: Dispatch<SetStateAction<number>>;
    setExpending: Dispatch<SetStateAction<boolean>>;
    setTilesUsed: Dispatch<SetStateAction<string>>;
}
type highestScoredWordResponse = {
    rack: string;
    word?: string;
    score: number;
    highest_scored_word: string;
    expending?: boolean;
    tiles_used?: string;
    detail?: string;
}

const Form = ({word, setWord, tileScores, setTilesUsed, setHighestScoredWord, setScore, setExpending}: inputProps) => {
    const [rack, setRack] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleRackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        resetResults()
        setRack(e.target.value);
    }
    const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        resetResults()
        setWord(e.target.value);
    }
    const resetResults = () => {
        setScore(0);
        setHighestScoredWord("")
        setExpending(false)
        setTilesUsed("")
    }
    const fetchHighestScore = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMessage("")
        if (word.length > 0 && rack.length > 0) {
            fetch(`http://localhost:8000/rack/${rack}/word/${word}`)
                .then(response => response.json())
                .then(result => handleResponse(result))
        } else if (rack.length > 0) {
            fetch(`http://localhost:8000/rack/${rack}`)
                .then(response => response.json())
                .then(result => handleResponse(result))
        }
    }

    const handleResponse = (response: highestScoredWordResponse) => {
        if ("detail" in response && response.detail) {
            setErrorMessage(response.detail)
        } else {
            if ("expending" in response && response.expending) {
                setExpending(response.expending)
            } else {
                setExpending(false)
            }
            if ("tiles_used" in response && response.tiles_used) {
                setTilesUsed(response.tiles_used)
            } else {
                setTilesUsed("")
            }
            setScore(response.score)
            setHighestScoredWord(response.highest_scored_word)
        }
    }

    const rackRef = useRef<HTMLInputElement>(null)
    const wordRef = useRef<HTMLInputElement>(null)

    return <>
        <div>{errorMessage}</div>
        <form id="center" onSubmit={fetchHighestScore}>
            <div className={"input_container wide"}>
                <label>Rack
                    <input
                        ref={rackRef}
                        className={"label wide"}
                        maxLength={7}
                        value={rack}
                        type="text"
                        name="rack"
                        placeholder="rack letters"
                        autoComplete="off"
                        onChange={handleRackChange}/></label>
                <div className={"tile_input_container"} onClick={() => rackRef.current?.focus()}>
                    <Rack letters={rack} tileScores={tileScores} numLetters={7}/>
                </div>
            </div>
            <div className={"input_container wider"}>
                <label>Word on Board
                    <input
                        ref={wordRef}
                        className={"label wider"}
                        maxLength={15}
                        value={word}
                        type="text"
                        name="word"
                        placeholder="word on board"
                        autoComplete="off"
                        onChange={handleWordChange}/></label>
                <div className={"tile_input_container"} onClick={() => wordRef?.current?.focus()}>
                    <Rack letters={word} tileScores={tileScores} numLetters={15}/>
                </div>
            </div>
            <input className={"submit"} type="submit" value="Get highest scoring word"/>
        </form>
    </>
}

export default Form;