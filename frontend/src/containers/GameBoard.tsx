import './GameBoard.css'
import GameTile from "../components/GameTile.tsx";

import {tileScoresType} from "../interfaces.ts";

type inputProps = {
    word: string;
    highestScoredWord: string;
    expending?: boolean;
    tilesUsed?: string
    tileScores: tileScoresType;
}
const gridWidth = 15
const gridHeight = 15
const gridElement = gridHeight * gridWidth
const GameBoard = ({word, highestScoredWord, expending, tilesUsed, tileScores}: inputProps) => {
    let horizontal = word
    if ((!word && highestScoredWord) || expending) {
        horizontal = highestScoredWord
    }
    const vertical = new Map()
    let horizontalOffset = 0
    let intersectingLetter = ""
    let verticalBefore = ""
    let verticalAfter = ""
    if (highestScoredWord && !expending && tilesUsed) {
        intersectingLetter = [...tilesUsed].reduce((nonRackLetters, currentValue) =>
            nonRackLetters.replace(currentValue, ""), highestScoredWord);
        verticalBefore = highestScoredWord.slice(0, highestScoredWord.indexOf(intersectingLetter));
        verticalAfter = highestScoredWord.slice(highestScoredWord.indexOf(intersectingLetter) + 1);
        horizontalOffset = word.indexOf(intersectingLetter);
        [...verticalBefore].map((letter, i) => {
            vertical.set(105 + horizontalOffset - gridWidth * (verticalBefore.length - i), letter)
        });
        [...verticalAfter].map((letter, i) => {
            vertical.set(105 + horizontalOffset + gridWidth * (i + 1), letter)
        });
    }


    return <div className={'grid_container'}>
        <div className={'game_grid'} style={{gridTemplateColumns: `repeat(${gridWidth}, 1fr)`}}>
            {
                Array(gridElement).fill(1).map((_input, k) => {
                    if (vertical.get(k)) {
                        const key = vertical.get(k) as keyof typeof tileScores
                        return <GameTile key={k} letter={key} score={tileScores[key]}/>
                    }
                    if (horizontal && k >= 105 && k <= 105 + horizontal.length - 1) {
                        const key = horizontal[k - 105] as keyof typeof tileScores
                        return <GameTile letter={key} score={tileScores[key]}/>
                    } else {
                        return <div key={k} className={"empty_tile"}/>
                    }
                })
            }
        </div>
    </div>;
}

export default GameBoard;