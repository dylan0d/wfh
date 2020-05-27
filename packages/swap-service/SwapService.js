const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();
const swapsCollection = firestore.collection('swaps');

async function getDocs(collection) {
    const snapshot = await collection.get();

    const docs = [];
    let index = 0;
    snapshot.forEach((s) => {
        const doc = s.data();
        doc.id = snapshot.docs[index].id;
        docs.push(doc);
        index++;
    });
    return docs;
} 

module.exports = {
     getAllSwaps: async function() {
        const docs = await getDocs(swapsCollection);
        return docs
     },
     getSwapsOnDate: async function(date) {
        const query = await swapsCollection.where('date', '==', date);
        const docs = await getDocs(query);
        return docs
     },
     createSwap: async function({date, oldPerson, newPerson}) {
        await swapsCollection.add({
            date,
            newPerson: newPerson,
            oldPerson: oldPerson
        })
        return `Swapped desk ${oldPerson} for ${newPerson} on ${date}`
     }
}