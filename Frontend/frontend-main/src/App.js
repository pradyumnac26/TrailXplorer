import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes instead of Switch
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import AboutUs from "./components/AboutUs/AboutUs";
// Other imports...
import TrailOverview from "./components/TrailOverviewPage/TrailOverviewPage"; // Assuming this component exists
import {
    getSearchResults,
    getStateNameByLatitudAndLongitude,
    getTrailsByDifficulty,
    getTrailsByLength,
    getTrailsByRating,
} from "./requests";

function App() {
    // Your application state and logic...
    const [stateName, setStateName] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [maxLength, setMaxLength] = useState(1);
    const [lengthTrails, setLengthTrails] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState(7);
    const [difficultTrails, setDifficultTrails] = useState([]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [ratingTrails, setRatingTrails] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedTrailName, setSelectedTrailName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [filteredTrails, setFilteredTrails] = useState([]);
    const [filters, setFilters] = useState({
        filterDifficulty: 7,
        filterLength: 15,
        filterRating: 5,
        filterElevation: 20000,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            getTrailsByLength(stateName, maxLength).then((response) => {
                setLengthTrails(response);
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [stateName, maxLength]);

    useEffect(() => {
        getTrailsByDifficulty(stateName, selectedDifficulty).then(
            (response) => {
                setDifficultTrails(response);
            }
        );
    }, [selectedDifficulty, stateName]);

    useEffect(() => {
        getTrailsByRating(selectedRating, stateName).then((response) => {
            setRatingTrails(response);
        });
    }, [selectedRating, stateName]);

    useEffect(() => {
        const getStateName = async () => {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const stateName = await getStateNameByLatitudAndLongitude(
                    latitude,
                    longitude
                );

                setStateName(stateName);
            });
        };
        getStateName();
    }, []);

    useEffect(() => {
        if (!selectedState) {
            setSearchResults([]);
            return;
        }
        getSearchResults(selectedState).then((response) => {
            response.sort((a, b) => a.name.localeCompare(b.name));
            setSearchResults(response);
        });
    }, [selectedState]);

    useEffect(() => {
        const tempTrails = searchResults.filter((trail) => {
            return (
                trail.name.includes(selectedTrailName.toLowerCase()) &&
                Number(trail.difficulty_rating) <=
                    Number(filters.filterDifficulty) &&
                Number(trail.length) <=
                    Number(filters.filterLength) * 1609.34 &&
                Number(trail.avg_rating) <= Number(filters.filterRating) &&
                Number(trail.elevation_gain) <= Number(filters.filterElevation)
            );
        });
        tempTrails.sort((a, b) => a.name.localeCompare(b.name));
        setFilteredTrails(tempTrails);
    }, [searchResults, selectedTrailName, filters]);

    const resetFilters = () => {
        setFilters({
            filterDifficulty: 7,
            filterLength: 15,
            filterRating: 5,
            filterElevation: 20000,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSearchResults(true);
    };

    return (
        <Router>
            <>
                <Navbar />
                <Routes>
                    {" "}
                    {/* Use Routes instead of Switch */}
                    <Route
                        path="/"
                        element={
                            <Home
                                showSearchResults={showSearchResults}
                                setShowSearchResults={setShowSearchResults}
                                maxLength={maxLength}
                                setMaxLength={setMaxLength}
                                lengthTrails={lengthTrails}
                                selectedDifficulty={selectedDifficulty}
                                setSelectedDifficulty={setSelectedDifficulty}
                                difficultTrails={difficultTrails}
                                selectedRating={selectedRating}
                                setSelectedRating={setSelectedRating}
                                ratingTrails={ratingTrails}
                                selectedState={selectedState}
                                setSelectedState={setSelectedState}
                                selectedTrailName={selectedTrailName}
                                setSelectedTrailName={setSelectedTrailName}
                                searchResults={searchResults}
                                handleSearch={handleSearch}
                                filteredTrails={filteredTrails}
                                filters={filters}
                                setFilters={setFilters}
                                resetFilters={resetFilters}
                            />
                        }
                    />
                    <Route
                        path="/:state_name/:id"
                        element={<TrailOverview />}
                    />
                    <Route path="/aboutus" element={<AboutUs />} />
                    {/* Define other routes here */}
                </Routes>
            </>
        </Router>
    );
}

export default App;
