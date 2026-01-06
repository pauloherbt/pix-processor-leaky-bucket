import type { RequestContext } from 'graphql-http/lib/use/koa';
import type { Request } from 'graphql-http/lib/handler';
import type { IncomingMessage } from 'node:http';

export type GraphQLContext = Request<IncomingMessage, RequestContext>;

export const authenticate = async (ctx: GraphQLContext) => {
  const authHeader = (ctx.headers as Record<string, string>)['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new Error('Unauthorized');
  }

  return {
    userId: token,
  };
};
