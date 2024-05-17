import { TextField } from "@mui/material";
import "./LengthFilter.css";
import TileGroup from "../../TileGroup/TileGroup";

const LengthFilter = (props) => {
    const popoverContent = (
        <form className="length-filter">
            <TextField
                type="number"
                id="maxLength"
                label="Maximum Length (miles)"
                value={props.maxLength}
                onChange={(e) => {
                    props.setMaxLength(Number(e.target.value));
                }}
            />
        </form>
    );

    return (
        <TileGroup
            title="Lengthy Trails"
            className="tile"
            childNo={2}
            popoverContent={popoverContent}
            trails={props.trails}
        />
    );
};

export default LengthFilter;
