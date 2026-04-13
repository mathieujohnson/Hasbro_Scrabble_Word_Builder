import {tileScoresType} from "../interfaces.ts";

type inputProps = {
    tileQty: tileScoresType;
}
const DistributionLegend = ({tileQty}: inputProps) => {
    return <div style={{position: "absolute", left: "1rem", top: "30rem", width: "10rem"}}>
        Letter Distribution
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", fontSize: "0.7rem"}}>
            {tileQty && Object.keys(tileQty).map((key, i) => {
                const str = key as keyof typeof tileQty
                return <div key={i}>{key}:{tileQty[str]}</div>
            })

            }

        </div>
    </div>
}

export default DistributionLegend;