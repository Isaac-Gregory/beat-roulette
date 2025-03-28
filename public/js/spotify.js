import spotifyConfig from "./spotify-config.js";

const tokenUrl = 'https://accounts.spotify.com/api/token';

const getAccessToken = async () => {
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(spotifyConfig.clientId + ':' + spotifyConfig.clientSecret)
        },
        body: new URLSearchParams({ 'grant_type': 'client_credentials' })
    });

    const data = await response.json();
    return data.access_token;
};

// Getting access token as needed
const accessToken = await getAccessToken();

// Searching for song information
export async function searchSong(query, amount) {
    // Searching using the api
    const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${amount}`;
    const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    // Returning the response
    const data = await response.json();
    return data.tracks.items; // Returns an array of matching tracks
};

// Searching for song information
export async function getSong(songID) {
    // Getting the song using the api
    const apiUrl = `https://api.spotify.com/v1/tracks/${songID}`;
    const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    // Returning the response
    const data = await response.json();
    console.log(data)
    return data; // Returns a single track
};
