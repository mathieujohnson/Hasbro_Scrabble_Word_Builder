import './HighScore.css'

type inputProps = {
    score: number;
    highestScoredWord: string;
}
const HighScore = ({score, highestScoredWord}: inputProps) => {
    return <div className={"score_container"}>
        Highest Scoring Word
        <h1>
            {highestScoredWord}
        </h1>
        <h1>{score} points</h1>
    </div>
}

export default HighScore;