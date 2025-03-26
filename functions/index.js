import { onSchedule } from 'firebase-functions/v2/scheduler';
import admin from 'firebase-admin';
// const { logger } = require('firebase-functions');

admin.initializeApp();
const db = admin.firestore();

export const updateRoulettes = onSchedule('0 0 * * *', async () => {
    // Getting all songs
    const songsSnapshot = await db.collectionGroup('songs').get();

    // Grouping songs by collection path (parent groups/roulettes)
    const groupedSongs = {};

    // Getting songs and grouping them (for randomizing)
    songsSnapshot.docs.forEach(doc => {
        // Getting document ids
        const pathParts = doc.ref.path.split('/');
        const groupId = pathParts[1];
        const rouletteId = pathParts[3];

        // Initializing the group if not already in the object
        if (!groupedSongs[groupId]) {
            groupedSongs[groupId] = {};
        }
        if (!groupedSongs[groupId][rouletteId]) {
            groupedSongs[groupId][rouletteId] = [];
        }

        // Adding the song to the group and roulette
        groupedSongs[groupId][rouletteId].push(doc);
    });

    // Randomly selecting one song from each roulette
    Object.keys(groupedSongs).forEach(groupId => {
        Object.keys(groupedSongs[groupId]).forEach(async rouletteId => {
            const rouletteSongs = groupedSongs[groupId][rouletteId];
            const randomIndex = Math.floor(Math.random() * rouletteSongs.length);
            const randomSong = rouletteSongs[randomIndex];
            const roulette = await randomSong.ref.parent.parent;

            // Updating the roulette song information
            roulette.update({'currSong': randomSong.data()['title'], 'currArtist': randomSong.data()['artist'], 'currAlbum': ""});
            
            // Deleting the song from the collection (isn't randomly chosen again)
            randomSong.ref.delete();
        });
    });

});
