const Koa = require('koa');
const koaRouter = require('koa-router');
const Firestore = require('@google-cloud/firestore');

const app = new Koa();
const router = koaRouter();
const port = 5001
const firestore = new Firestore();

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
    console.log(ctx.request.query);
});

app.use(router.routes());
app.listen(process.env.PORT || 5001);
console.log('listening on port ', port)