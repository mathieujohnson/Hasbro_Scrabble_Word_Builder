type inputProps = {
    score: number;
    highestScoredWord: string;
}
const HighScore = ({score, highestScoredWord}: inputProps) => {
    return <div style={{
        position: "absolute", right: "3rem", top: "48rem", minWidth: "10rem", backgroundColor: "#dbd5bf",
        border: "1px solid black",
        borderRadius: "10px",
        boxShadow: "-4px 4px 2px 1px #1f202899"
    }}>
        Highest Scoring Word
        <h1>
            {highestScoredWord}
        </h1>
        <h1>{score} points</h1>
    </div>
}

export default HighScore;