import bcrypt from 'bcrypt';
import { MutationResolvers } from '../generated/types';
import { users } from './mock/users';

export const register: MutationResolvers['register'] = async (_, args) => {
  const { name, email, password } = args;

  const encryptedPassword = bcrypt.hashSync(password, 10);

  users.push({
    id: String(users.length + 1),
    name,
    email,
    password: encryptedPassword,
  });

  return 'User registered successfully';
};
