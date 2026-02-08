import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { users } from './mock/users';
import { MutationResolvers } from '../generated/types';
import { JWT_SECRET } from '../../middlewares/auth';

export const login: MutationResolvers['login'] = async (_, args) => {
  const { email, password } = args;

  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};
