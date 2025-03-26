// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import firebaseConfig from "./firebase-config.js";
import { getSong } from './spotify.js';
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getData(name) {
    // Getting elements from html
    const songName = document.getElementById(name+'SongName');
    const artistName = document.getElementById(name+'ArtistName');
    const albumName = document.getElementById(name+'AlbumName');
    const albumImg = document.getElementById(name+'AlbumImg');

    // Getting song and artist from Firebase
    const groupRoulettes = collection(db, "/groups/AAA/roulettes/");
    const q = query(groupRoulettes, where("owner", "==", name));
    const rouletteDoc = await (await getDocs(q)).docs[0];

    // Finding (singular) song
    const songID = rouletteDoc.data().songID;
    if (songID != "") {
        getSong(songID)
        .then(track => {
                // Adding song info to html
                songName.textContent = track.name;
                artistName.textContent = track.artists.map(artist => artist.name).join(', ');
                albumName.textContent = track.album.name;
                albumImg.src = track.album.images[0].url;
        });
    }
};

// Getting everyone's songs
getData('scott');
getData('judd');
getData('isaac');
getData('reuben');