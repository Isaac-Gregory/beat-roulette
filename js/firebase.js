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

// Listening for user to add song to a roulette 
const addSongButton = document.getElementById('confirmSong');
addSongButton.addEventListener('click', async function() {

  // Getting information from page
  const songName = document.getElementById('songName').value;
  const artistName = document.getElementById('artistName').value;
  const rouletteOwner = document.getElementById('listName').value;

  // Getting roulette collection
  const groupRoulettes = collection(db, "/groups/AAA/roulettes/");
  const q = query(groupRoulettes, where("owner", "==", rouletteOwner));
  const rouletteDoc = await (await getDocs(q)).docs[0];

  // Adding song to roulette
  const roulette = collection(db, "/groups/AAA/roulettes/", rouletteDoc.ref.id, "/songs/");
  await addDoc(roulette, {"artist": artistName, "title": songName});

  document.getElementById("songPopup").style.display = "none";
});

// Show popup with song details
async function showPopup(songName, artistName, albumName) {
  searchSong(songName + " " + artistName + " " + albumName, 5)
    .then(tracks => {
      if (tracks.length > 0) {
        console.log(tracks);
          const track = tracks[0]; // Directly access the first track

          // Adding song info to HTML
          document.getElementById("popupSongName").innerText = `Song: ${track.name}`;
          document.getElementById("popupArtistName").innerText = `Artist(s): ${track.artists.map(artist => artist.name).join(', ')}`;
          document.getElementById("popupAlbumArt").src = track.album.images[0].url;
          document.getElementById("songPopup").style.display = "flex";
      } else {
          console.warn("No tracks found.");
      }
  })
  .catch(error => console.error("Error fetching song:", error));
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
});