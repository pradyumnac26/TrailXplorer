import React, { useEffect } from "react";
import "../Home/Home.scss";
import "../Home/Home.css";
import RatingFilter from "../Filters/RatingFilte/RatingFilter";
import LengthFilter from "../Filters/LengthFilter/LengthFilter";
import DifficultyFilter from "../Filters/DifficultyFilter/DifficultyFilter";
import Search from "../Search/Search";
import states from "./USStates.json";
import { Link } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";

const Home = (props) => {
    const {
        showSearchResults,
        setShowSearchResults,
        maxLength,
        setMaxLength,
        lengthTrails,
        selectedDifficulty,
        setSelectedDifficulty,
        difficultTrails,
        selectedRating,
        setSelectedRating,
        ratingTrails,
        selectedState,
        setSelectedState,
        selectedTrailName,
        setSelectedTrailName,
        handleSearch,
        filteredTrails,
        setFilters,
        filters,
        resetFilters,
    } = props;

    const [randomTrail, setRandomTrail] = React.useState(null);
    useEffect(() => {
        setRandomTrail(
            ratingTrails[Math.floor(Math.random() * ratingTrails.length)]
        );
    }, [ratingTrails]);

    const getRandomTrail = () => {
        if (!randomTrail) return "/";
        return `/${randomTrail.state_name.toLowerCase()}/${
            randomTrail.trail_id
        }`;
    };

    const getTrailNames = () => {
        const trailNames = [];
        filteredTrails.forEach((trail) => {
            const titleCaseName = trail.name
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            trailNames.push(titleCaseName);
        });
        trailNames.sort();
        return trailNames;
    };

    return (
        <React.Fragment>
            <section className="home">
                <div className="seccontainer container">
                    <div className="homeText">
                        <h1 className="title">Find Your Next Adventure</h1>
                        <p className="subTitle">
                            Explore the best trails in the world
                        </p>
                        <button className="btn">
                            <Link to={getRandomTrail()}>Explore</Link>
                        </button>
                    </div>
                    <form className="homeCard grid">
                        <div className="inputgroup">
                            <div className="locationDiv">
                                <Autocomplete
                                    id="trailState"
                                    className="input"
                                    options={states}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            value={selectedState}
                                            label="State Name"
                                        />
                                    )}
                                    value={selectedState}
                                    onChange={(e, value) => {
                                        setSelectedState(value);
                                        setShowSearchResults(true);
                                    }}
                                />
                            </div>

                            <div
                                className="trailLengthDiv"
                                onChange={(e) => {
                                    setSelectedTrailName(e.target.value);
                                }}
                            >
                                <Autocomplete
                                    id="trailName"
                                    className="input"
                                    freeSolo
                                    options={getTrailNames()}
                                    value={selectedTrailName}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            value={selectedTrailName}
                                            label="Trail Name"
                                        />
                                    )}
                                    onChange={(e, value) => {
                                        setSelectedTrailName(value || "");
                                        setShowSearchResults(true);
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            className="btn"
                            type="submit"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </form>

                    <div className="tileGroups grid">
                        {showSearchResults && (
                            <Search
                                title="Search Results"
                                setShowSearchResults={setShowSearchResults}
                                filteredTrails={filteredTrails}
                                selectedTrailName={selectedTrailName}
                                setFilters={setFilters}
                                filters={filters}
                                resetFilters={resetFilters}
                            />
                        )}
                        {!showSearchResults && (
                            <>
                                <LengthFilter
                                    setMaxLength={setMaxLength}
                                    trails={lengthTrails}
                                    maxLength={maxLength}
                                />
                                <DifficultyFilter
                                    selectedDifficulty={selectedDifficulty}
                                    setSelectedDifficulty={
                                        setSelectedDifficulty
                                    }
                                    trails={difficultTrails}
                                />
                                <RatingFilter
                                    selectedRating={selectedRating}
                                    setSelectedRating={setSelectedRating}
                                    trails={ratingTrails}
                                />
                            </>
                        )}
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Home;
