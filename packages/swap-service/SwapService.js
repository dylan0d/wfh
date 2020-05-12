const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();
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
        const requestsCollection = firestore.collection('swaps');
        const docs = await getDocs(requestsCollection);
        return docs
     },
     getSwapsOnDate: async function(date) {
        const swapsCollection = firestore.collection('swaps');
        const query = await swapsCollection.where('date', '==', date);
        const docs = await getDocs(query);
        return docs
     }
}