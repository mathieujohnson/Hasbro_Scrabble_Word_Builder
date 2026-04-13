import BackgroundImage from '../assets/wood.png'

type inputProps = {
    letter: string;
    score: number;
}

const GameTile = ({letter, score}: inputProps) => {
    return (<div style={{marginBlock: "0.2rem"}}>
            <div style={{
                backgroundImage: `url(${BackgroundImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: "no-repeat",
                width: "3rem",
                height: "3rem",
                fontSize: "1.5rem",
            }}>
                <div style={{paddingTop: "0.5rem"}}>
                    {letter && letter.toUpperCase()}
                    <sub style={{fontSize: "0.9rem"}}>{score}</sub>
                </div>
            </div>
        </div>
    )
}

export default GameTile;