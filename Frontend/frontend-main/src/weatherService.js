import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY_URL = "http://52.89.236.222:8080/open-weather-api";

// Function to fetch the API key from the backend
const fetchApiKey = async () => {
    try {
        const response = await axios.get(API_KEY_URL);
        return response.data[0].id; // Assuming the API returns an array with an object that contains the id
    } catch (error) {
        console.error("Error fetching API key:", error);
        throw error;
    }
};

export const fetchWeatherData = async (lat, lon) => {
    try {
        const appid = await fetchApiKey(); // Fetch API key before making the API call
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                lat: lat,
                lon: lon,
                exclude: "minutely,hourly",
                units: "metric", // Or 'imperial' for Fahrenheit
                appid: appid,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

export const fetchWeatherForecast = async (lat, lon) => {
    try {
        const appid = await fetchApiKey(); // Fetch API key before making the API call
        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: {
                lat: lat,
                lon: lon,
                units: "metric", // Or 'imperial' for Fahrenheit
                appid: appid,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching weather forecast:", error);
        throw error;
    }
};
