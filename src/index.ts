import Koa from 'koa';
import Router from '@koa/router';
import { createHandler } from 'graphql-http/lib/use/koa';
import bodyParser from 'koa-bodyparser';

import { schema } from './graphql';
import { authenticate } from './middlewares/auth';
import { withRateLimit } from './middlewares/rate-limiter';

const app = new Koa();

app.use(bodyParser());
app.use(authenticate);
app.use(withRateLimit);

const router = new Router();

router.post('/graphql', async (ctx, next) => {
  const handler = createHandler({
    schema,
    context: {
      userId: ctx.state.userId,
      bucket: ctx.state.bucket,
    },
  });

  await handler(ctx, next);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
