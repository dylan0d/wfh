const Koa = require('koa');
const koaRouter = require('koa-router');
const Firestore = require('@google-cloud/firestore');

const app = new Koa();
const router = koaRouter();
const port = 5001
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

router.get('/allSwaps', async (ctx) => {
    console.log('requesting all swaps')
    const requestsCollection = firestore.collection('swaps');
    const docs = await getDocs(requestsCollection);
    ctx.body = docs;
    console.log('all swaps retrieved')
});

router.get('/swapsOnDate', async (ctx) => {
    const date = ctx.query.date;
    console.log(`Swaps requested for ${date}`);
    const swapsCollection = firestore.collection('swaps');

    const query = await swapsCollection.where('date', '==', date);

    const docs = await getDocs(query);

    console.log(docs);

    ctx.body = docs;

    console.log(`Returned swaps for date ${date}`);
})

router.get('/status', (ctx) => {
    ctx.body = 'all good';
    console.log('Replied all good on status');
})

app.use(router.routes());
app.listen(process.env.PORT || 5001);
console.log('listening on port ', port)