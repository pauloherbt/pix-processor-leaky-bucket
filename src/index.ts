import Koa from 'koa';
import Router from '@koa/router';
import { createHandler } from 'graphql-http/lib/use/koa';

import { schema } from './graphql';
import { authenticate } from './middlewares/auth';

const app = new Koa();

const router = new Router();
router.post(
  '/graphql',
  createHandler({
    schema,
    context: async (ctx) => {
      const user = await authenticate(ctx);
      return {
        ...user,
      };
    },
  }),
);
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
