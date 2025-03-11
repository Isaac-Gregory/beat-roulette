// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import firebaseConfig from "./firebase-config.js";
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getData(name) {
    const songName = document.getElementById(name+'SongName');
    const artistName = document.getElementById(name+'ArtistName');
    const albumName = document.getElementById(name+'AlbumName');

    const groupRoulettes = collection(db, "/groups/AAA/roulettes/");
    const q = query(groupRoulettes, where("owner", "==", name));
    const rouletteDoc = await (await getDocs(q)).docs[0];

    console.log(rouletteDoc.data());

    const song = rouletteDoc.data().currSong;
    const artist = rouletteDoc.data().currArtist;
    const album = rouletteDoc.data().currAlbum;

    songName.textContent = song;
    artistName.textContent = artist;
    albumName.textContent = album;
};

getData('scott');