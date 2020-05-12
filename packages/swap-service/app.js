const Koa = require('koa');
const koaRouter = require('koa-router');
const cors = require('@koa/cors');
const swapService = require('./SwapService');

const app = new Koa();
const router = koaRouter();
const port = 5001

router.get('/allSwaps', async (ctx) => {
    console.log('requesting all swaps')
    const docs = await swapService.getAllSwaps()
    ctx.body = docs;
    console.log('all swaps retrieved')
});

router.get('/swapsOnDate', async (ctx) => {
    const date = ctx.query.date;
    console.log(`Swaps requested for ${date}`);
    const docs = await swapService.getSwapsOnDate(date);
    console.log(docs);
    ctx.body = docs;
    console.log(`Returned swaps for date ${date}`);
})

router.get('/status', (ctx) => {
    ctx.body = 'all good';
    console.log('Replied all good on status');
})

app.use(cors());
app.use(router.routes());
app.listen(process.env.PORT || 5001);
console.log('listening on port ', port)