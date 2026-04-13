import BackgroundImage from '../assets/wood.png'
import './GameTile.css'

type inputProps = {
    letter: string;
    score: number;
}

const GameTile = ({letter, score}: inputProps) => {
    return (<div className={"tile_container"}>
            <div className={"tile_image"} style={{backgroundImage: `url(${BackgroundImage})`}}>
                <div className={"padding_top"}>
                    {letter && letter.toUpperCase()}
                    <sub className={"subscript"}>{score}</sub>
                </div>
            </div>
        </div>
    )
}

export default GameTile;