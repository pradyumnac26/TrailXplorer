import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TrailOverviewPage.css";
import { getTrailDetails } from "../../requests";
import { fetchWeatherData } from "../../weatherService";
import { fetchWeatherForecast } from "../../weatherService";
import sunnyIcon from "../../Assets/sunny.jpg";
import humidityIcon from "../../Assets/humidity.svg";
import windIcon from "../../Assets/wind.svg";
import pressureIcon from "../../Assets/pressure.svg";
import nightIcon from "../../Assets/night.svg";
import dayIcon from "../../Assets/day.svg";
import cloudyNightIcon from "../../Assets/cloudy-night.svg";
import cloudyIcon from "../../Assets/cloudy.svg";
import perfectDayIcon from "../../Assets/perfect-day.svg";
import rainIcon from "../../Assets/rain.svg";
import rainNightIcon from "../../Assets/rain-night.svg";
import stormIcon from "../../Assets/storm.svg";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { getImageURL } from "../../requests";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Import marker icon images using a method appropriate for your project setup.
// If using Create React App or a similar setup, you can directly import images like this.
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    shadowSize: [41, 41], // Size of the shadow
});

export const WeatherIcons = {
    "01d": sunnyIcon,
    "01n": nightIcon,
    "02d": dayIcon,
    "02n": cloudyNightIcon,
    "03d": cloudyIcon,
    "03n": cloudyIcon,
    "04d": perfectDayIcon,
    "04n": cloudyNightIcon,
    "09d": rainIcon,
    "09n": rainNightIcon,
    "10d": rainIcon,
    "10n": rainNightIcon,
    "11d": stormIcon,
    "11n": stormIcon,
};

const TrailOverviewPage = () => {
    const { state_name, id } = useParams();
    const [trail, setTrail] = useState(null);
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [chartData, setChartData] = useState({
        labels: ["Sea Level", "Ground Level", "Elevation Gain"],
        datasets: [
            {
                label: "Elevation (ft)",
                data: [],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    });

    useEffect(() => {
        let localTrailDetails = null;
        getTrailDetails(id, state_name)
            .then((trailDetails) => {
                localTrailDetails = trailDetails;
                setTrail(trailDetails);
                // Fetch both weather data and forecast after trail details are set
                return Promise.all([
                    fetchWeatherData(
                        trailDetails._geoloc.lat,
                        trailDetails._geoloc.lng
                    ),
                    fetchWeatherForecast(
                        trailDetails._geoloc.lat,
                        trailDetails._geoloc.lng
                    ),
                    Promise.resolve(trailDetails),
                ]);
            })
            .then(([weatherData, forecastData]) => {
                setWeather(weatherData);
                setForecast(forecastData);
                setChartData({
                    labels: ["Sea Level", "Ground Level", "Elevation Gain"],
                    datasets: [
                        {
                            label: "Elevation (ft)",
                            data: [
                                (weatherData.main.sea_level = 0),
                                localTrailDetails.elevation_gain,
                                (localTrailDetails.sea_level = 0),
                            ],
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                            tension: 0.1,
                        },
                    ],
                });
            })
            .catch((error) => {
                console.error(
                    "Error fetching trail or weather details:",
                    error
                );
            });
    }, [state_name, id]);

    const baseGear = ["Water Bottle", "Snacks", "Map and Compass"];
    const additionalGear = {
        easy: [],
        moderate: ["First Aid Kit"],
        hard: ["First Aid Kit", "Trekking Poles", "GPS Device"],
        rain: ["Waterproof Jacket", "Waterproof Pants"],
        cold: ["Insulated Jacket", "Gloves", "Beanie", "Thermal Layers"],
        // Add more conditions as necessary
    };

    const getDifficultyLevel = (rating) => {
        if (rating <= 2) return "easy";
        if (rating <= 4) return "moderate";
        return "hard";
    };

    const getWeatherDependentGear = (weatherData) => {
        const gear = [];
        if (weatherData.main.temp <= 50) {
            // Assuming temp is in Fahrenheit
            gear.push(...additionalGear["cold"]);
        }
        if (
            weatherData.weather.some((w) =>
                w.main.toLowerCase().includes("rain")
            )
        ) {
            gear.push(...additionalGear["rain"]);
        }
        // Add more weather conditions as necessary
        return gear;
    };

    const getSuggestedGear = () => {
        let suggestedGear = [...baseGear];

        // Include gear based on difficulty
        const difficultyLevel = getDifficultyLevel(trail?.difficulty_rating);
        suggestedGear.push(...additionalGear[difficultyLevel]);

        // Include gear based on weather
        if (weather) {
            suggestedGear.push(...getWeatherDependentGear(weather));
        }

        return suggestedGear;
    };

    // Call this function when you need to display the gear list
    const gearList = getSuggestedGear();

    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        return `${hours}:${minutes.substr(-2)}`;
    };

    const imageCount = trail?.photo_references
        ? trail.photo_references.length
        : 0;
    const prepareForecastTemperatureData = (forecastData) => {
        if (!forecastData) return;

        const labels = forecastData.list.map((item) => {
            const date = new Date(item.dt_txt);
            return `${date.toLocaleDateString("en-US", {
                weekday: "short",
            })} ${date.toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
            })}`;
        });
        const data = forecastData.list.map(
            (item) => item.main.temp * (9 / 5) + 32
        );

        return {
            labels,
            datasets: [
                {
                    label: "Temperature (F)",
                    data: data,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
            ],
        };
    };

    const preparePrecipitationData = (forecastData) => {
        const labels = forecastData.list.map((item) => {
            const date = new Date(item.dt_txt);
            return `${date.toLocaleDateString("en-US", {
                weekday: "short",
            })} ${date.toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
            })}`;
        });

        const precipitationData = forecastData.list.map(
            (item) => (item.rain ? item.rain["3h"] : 0) // Check if rain data exists, otherwise return 0
        );

        return {
            labels,
            datasets: [
                {
                    label: "Precipitation (mm)",
                    data: precipitationData,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    if (!trail) {
        return <div>Loading or no trail data available...</div>;
    }

    const getStars = () => {
        const stars = [];
        let rating = Number(trail.avg_rating); // Ensure this is your correct rating property
        for (let i = 0; i < 5; i++) {
            if (rating >= 1) {
                stars.push(
                    <span key={i} className="fullStar">
                        ★
                    </span>
                );
                rating -= 1;
            } else if (rating > 0 && rating < 1) {
                stars.push(
                    <span key={i} className="halfStar">
                        ★
                    </span>
                );
                rating -= 1;
            } else {
                stars.push(
                    <span key={i} className="emptyStar">
                        ☆
                    </span>
                );
            }
        }
        return stars;
    };

    return (
        <React.Fragment>
            <section className="home1">
                <div className="seccontainer1 container">
                    <div className="homeText1">
                        <h1 className="title1">{trail.name}</h1>
                        <p className="subTitle">{trail.area_name}</p>
                        <p className="cityState">
                            {trail.city_name}, {trail.state_name}
                        </p>
                        <div className="rating">
                            {getStars()}
                            <span>{trail.avg_rating}/5</span>
                        </div>
                        {/* Add this line */}
                    </div>
                </div>
            </section>
            <div className="clearfix">
                <div className="mainContent">
                    <div className="trailDetailsBar">
                        <div className="detailItem">
                            <span className="detailTitle">Length</span>
                            <span className="detailValue">
                                {(trail.length / 1609.34).toFixed(2)} mi
                            </span>
                        </div>
                        <div className="detailItem">
                            <span className="detailTitle">Elevation gain</span>
                            <span className="detailValue">
                                {trail &&
                                trail.elevation_gain != null &&
                                !isNaN(trail.elevation_gain)
                                    ? `${Number(trail.elevation_gain).toFixed(
                                          2
                                      )} ft`
                                    : trail.elevation_gain}{" "}
                            </span>
                        </div>
                        <div className="detailItem">
                            <span className="detailTitle">Route type</span>
                            <span className="detailValue">
                                {trail.route_type}
                            </span>
                        </div>
                        <div className="detailItem">
                            <span className="detailTitle">
                                Difficulty Rating
                            </span>
                            <span className="detailValue">
                                {trail.difficulty_rating}
                            </span>
                        </div>
                    </div>

                    {trail.description && (
                        <div className="descriptionSection">
                            <h2 className="sectionHeader">Description</h2>
                            <p> {trail.description}</p>
                        </div>
                    )}

                    <div className="weatherDataSection">
                        <h2> weather data</h2>
                        <div className="weatherSection">
                            {weather && (
                                <div className="weatherCard">
                                    <div className="weatherCardHeader">
                                        <h2>{`${(
                                            weather.main.temp * (9 / 5) +
                                            32
                                        ).toFixed(2)}°F | ${
                                            weather.weather[0].description
                                        }`}</h2>
                                        <img
                                            src={
                                                WeatherIcons[
                                                    weather.weather[0].icon
                                                ]
                                            }
                                            alt="Weather icon"
                                        />
                                    </div>
                                    <div className="weatherCardBody">
                                        <h3>{`${weather.name}, ${weather.sys.country}`}</h3>
                                        <div className="weatherInfo">
                                            <div className="weatherInfoRow">
                                                <div className="weatherInfoItem">
                                                    <img
                                                        src={sunnyIcon}
                                                        alt="sunrise"
                                                    />
                                                    <p>
                                                        {formatTime(
                                                            weather.sys.sunrise
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="weatherInfoItem">
                                                    <img
                                                        src={humidityIcon}
                                                        alt="humidity"
                                                    />
                                                    <p>
                                                        {weather.main.humidity}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="weatherInfoRow">
                                                <div className="weatherInfoItem">
                                                    <img
                                                        src={windIcon}
                                                        alt="wind"
                                                    />
                                                    <p>
                                                        {weather.wind.speed} m/s
                                                    </p>
                                                </div>
                                                <div className="weatherInfoItem">
                                                    <img
                                                        src={pressureIcon}
                                                        alt="pressure"
                                                    />
                                                    <p>
                                                        {weather.main.pressure}{" "}
                                                        hPa
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="weatherSection">
                            <h2>Forecast</h2>
                            {forecast && (
                                <div className="chartContainer">
                                    <Line
                                        data={prepareForecastTemperatureData(
                                            forecast
                                        )}
                                        options={{ responsive: true }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="weatherSection">
                            <h2> Precipitation</h2>
                            {forecast && (
                                <div className="chartContainer">
                                    <Bar
                                        data={preparePrecipitationData(
                                            forecast
                                        )}
                                        options={{ responsive: true }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="elevationSection">
                        <h2 className="sectionHeader">Elevation Data</h2>
                        <div className="chartContainer1">
                            <Line
                                data={chartData}
                                options={{ responsive: true }}
                            />
                        </div>
                    </div>

                    <div className="imageGallerySection">
                        <h2 className="sectionHeader">Image Gallery</h2>
                        <div className="imageGallery">
                            {Array.from({ length: imageCount }, (_, i) =>
                                getImageURL(id, i)
                            ).map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Trail view ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mapSection">
                        <h2 className="sectionHeader">Map Location</h2>
                        {trail && trail._geoloc && (
                            <MapContainer
                                center={[trail._geoloc.lat, trail._geoloc.lng]}
                                zoom={13}
                                scrollWheelZoom={true}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker
                                    position={[
                                        trail._geoloc.lat,
                                        trail._geoloc.lng,
                                    ]}
                                    icon={customIcon}
                                >
                                    <Popup>
                                        {trail.name} <br /> {trail.area_name}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        )}
                    </div>
                </div>

                <div className="sidebar">
                    <div className="sidebarSection">
                        <h2>Features</h2>
                        <div className="featuresList">
                            {trail.features.map((feature, index) => (
                                <span key={index} className="featureTag">
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="sidebarSection">
                        <h2>Activities</h2>
                        {/* Example: Replace with actual data from trail.activities or a similar property */}
                        <div className="featuresList">
                            {trail.activities.map((activities, index) => (
                                <span key={index} className="featureTag">
                                    {activities}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="sidebarSection">
                        <h2>Recommended Gear List</h2>
                        <div className="featuresList">
                            {gearList.map((item, index) => (
                                <span key={index} className="featureTag">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TrailOverviewPage;
