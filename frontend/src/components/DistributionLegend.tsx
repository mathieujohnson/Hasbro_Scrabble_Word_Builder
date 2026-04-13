import './DistributionLegend.css'
import {tileScoresType} from "../interfaces.ts";

type inputProps = {
    tileQty: tileScoresType;
}
const DistributionLegend = ({tileQty}: inputProps) => {
    return <div className={"distribution_container"}>
        Letter Distribution
        <div className={"distribution_grid"}>
            {tileQty && Object.keys(tileQty).map((key, i) => {
                const str = key as keyof typeof tileQty
                return <div key={i}>{key}:{tileQty[str]}</div>
            })

            }

        </div>
    </div>
}

export default DistributionLegend;