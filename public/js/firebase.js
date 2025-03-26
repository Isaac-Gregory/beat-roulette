// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import firebaseConfig from "./firebase-config.js";
import { searchSong } from './spotify.js';
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs, addDoc, query, where } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to display multiple song choices
async function showPopup(songName, artistName, albumName) {
    searchSong(songName + " " + artistName + " " + albumName, 10)
        .then(tracks => {
            const popup = document.getElementById("songPopup");
            const overlay = document.getElementById("popupOverlay");
            const songList = document.getElementById("popupSongList");
            songList.innerHTML = ""; // Clear previous content
            
            // Normalize songName for comparison
            const normalizedSongName = songName.toLowerCase().trim();

            // Filter out songs that are completely unrelated
            const filteredTracks = tracks.filter(track => {
                const trackName = track.name.toLowerCase().trim();
                return trackName.includes(normalizedSongName) || levenshteinDistance(normalizedSongName, trackName) <= 3;
            });

            if (filteredTracks.length > 0) {
                filteredTracks.forEach(track => {

                    const songButton = document.createElement("button");
                    songButton.classList.add("song-option");
                    songButton.dataset.song = JSON.stringify(track); // Store track data
                    
                    const songData = {
                        name: track.name,
                        artists: track.artists.map(artist => artist.name).join(', '),
                        albumArt: track.album.images[0].url,
                        id: track.id
                    };

                    songButton.innerHTML = `
                        <img src="${track.album.images[0].url}" alt="Album Cover" class="album-art" />
                        <div class="song-details">
                            <p class="song-name"><strong>${track.name}</strong></p>
                            <p class="artist-name">${track.artists.map(artist => artist.name).join(', ')}</p>
                        </div>
                    `;
                    
                    songButton.addEventListener("click", () => confirmSongSelection(songData));

                    songList.appendChild(songButton);
                });

                popup.style.display = "flex";
                overlay.style.display = "block"; // Show gray background
            } else {
                console.warn("No tracks found.");
            }
        })
        .catch(error => console.error("Error fetching song:", error));
}

function levenshteinDistance(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        for (let j = 0; j <= b.length; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1, // Deletion
                    dp[i][j - 1] + 1, // Insertion
                    dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // Substitution
                );
            }
        }
    }
    return dp[a.length][b.length];
}

// Function to add the selected song to the database
async function confirmSongSelection(song) {
    console.log("Selected Song:", song);

    const rouletteOwner = document.getElementById('listName').value;

    try {
        // Getting roulette collection
        const groupRoulettes = collection(db, "/groups/AAA/roulettes/");
        const q = query(groupRoulettes, where("owner", "==", rouletteOwner));
        const rouletteDoc = await (await getDocs(q)).docs[0];

        if (!rouletteDoc) {
            console.error("No roulette found for owner:", rouletteOwner);
            return;
        }

        // Adding song to the selected roulette
        const roulette = collection(db, "/groups/AAA/roulettes/", rouletteDoc.ref.id, "/songs/");
        await addDoc(roulette, { "id": song.id });
        

        // Close the popup after adding the song
        document.getElementById("songPopup").style.display = "none";
        document.getElementById("popupOverlay").style.display = "none";
    } catch (error) {
        console.error("Error adding song to roulette:", error);
    }
}

// Event listener for form submission
document.querySelector(".form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const songName = document.getElementById("songName").value;
    const artistName = document.getElementById("artistName").value;
    const albumName = document.getElementById("albumName").value;

    showPopup(songName, artistName, albumName);
});

// Event listener for canceling the popup
document.getElementById("cancelPopup").addEventListener('click', function () {
    document.getElementById("songPopup").style.display = "none";
    document.getElementById("popupOverlay").style.display = "none";
});