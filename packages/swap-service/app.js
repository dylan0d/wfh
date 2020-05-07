const Koa = require('koa');
const koaRouter = require('koa-router');
const Firestore = require('@google-cloud/firestore');

const app = new Koa();
const router = koaRouter();
const port = 5001
const firestore = new Firestore(
{
    projectId: 'cse-wfh',
    keyFilename: './key.json'
});

async function getCollection(name) {
    const requestsCollection = firestore.collection(name);
    const snapshot = await requestsCollection.get();
    return snapshot;
}

function getDocs(collection) {
    const docs = [];
    let index = 0;
    collection.forEach((s) => {
        const doc = s.data();
        doc.id = collection.docs[index].id;
        docs.push(doc);
        index++;
    });
    return docs;
} 

router.get('/status', async (ctx) => {
    const requestsCollection = await getCollection('swaps');
    const snapshot = getDocs(requestsCollection);
    ctx.body = snapshot;
    console.log(ctx.body);
});

app.use(router.routes());
app.listen(port);
console.log('listening on port ', port)