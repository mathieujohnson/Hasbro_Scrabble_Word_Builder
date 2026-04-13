import './App.css'
import {useEffect, useState} from "react";
import GameBoard from "./containers/GameBoard.tsx";
import DistributionLegend from "./components/DistributionLegend.tsx";
import HighScore from "./components/HighScore.tsx";
import Form from "./containers/Form.tsx";
import {tileScoresType} from "./interfaces.ts";


function App() {
    const initialTileScore = new tileScoresType()

    const [word, setWord] = useState<string>("")
    const [score, setScore] = useState<number>(0)
    const [highestScoredWord, setHighestScoredWord] = useState<string>("")
    const [expending, setExpending] = useState<boolean>(false)
    const [tilesUsed, setTilesUsed] = useState<string>("")
    const [tileScores, setTileScores] = useState<tileScoresType>(initialTileScore)
    const [tileQty, setTileQty] = useState<tileScoresType>(initialTileScore)

    useEffect(function initialFetch() {
            fetch('http://localhost:8000/letter_scores')
                .then(response => response.json())
                .then(result => setTileScores(result.scores as tileScoresType))
            fetch('http://localhost:8000/letter_distribution')
                .then(response => response.json())
                .then(result => setTileQty(result.tiles_qty as tileScoresType))
        },
        []
    )


    return (
        <>
            <div>
                <GameBoard word={word} highestScoredWord={highestScoredWord} expending={expending} tilesUsed={tilesUsed}
                           tileScores={tileScores}/>
            </div>
            {highestScoredWord && <HighScore score={score} highestScoredWord={highestScoredWord}/>}


            <DistributionLegend tileQty={tileQty}/>


            <Form setExpending={setExpending} setScore={setScore} setHighestScoredWord={setHighestScoredWord}
                  setWord={setWord} setTilesUsed={setTilesUsed} word={word} tileScores={tileScores}/>
        </>
    )
}

export default App
