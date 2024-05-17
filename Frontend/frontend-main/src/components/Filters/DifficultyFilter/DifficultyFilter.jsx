import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./DifficultyFilter.css";
import TileGroup from "../../TileGroup/TileGroup";

const DifficultyFilter = (props) => {
    const difficultyLevels = [1, 2, 3, 4, 5, 6, 7];

    const popoverContent = (
        <div className="difficulty-filter">
            <FormControl>
                <InputLabel id="difficulty-label">Difficulty:</InputLabel>
                <Select
                    labelId="difficulty-label"
                    id="difficulty"
                    onChange={(e) => {
                        props.setSelectedDifficulty(e.target.value);
                    }}
                    value={props.selectedDifficulty}
                >
                    {difficultyLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                            {level}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );

    return (
        <TileGroup
            title="Difficult Trails"
            className="tile"
            childNo={3}
            popoverContent={popoverContent}
            trails={props.trails}
        />
    );
};

export default DifficultyFilter;
