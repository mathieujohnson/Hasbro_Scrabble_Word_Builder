import GameTile from "../components/GameTile.tsx";
import * as React from "react";

import {tileScoresType} from "../interfaces.ts";

type inputProps = {
    letters: string;
    tileScores: tileScoresType;
    numLetters: number
}

const Rack = ({letters, tileScores, numLetters}: inputProps) => {
    return (
        <div style={{display: "grid", gridTemplateColumns: `repeat(${numLetters}, 1fr)`}}>
            {
                [...letters].map((letter: string, k: React.Key) => {
                        const str = letter as keyof typeof tileScores
                        return <GameTile key={k} letter={letter} score={tileScores[str]}/>
                    }
                )
            }
        </div>
    )
}

export default Rack;