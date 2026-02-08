import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      ctx.state.userId = decoded.userId;
    } catch {
      // Token inválido - não bloqueia, deixa userId undefined
      // O resolver que precisa de auth vai validar
    }
  }

  await next();
};
