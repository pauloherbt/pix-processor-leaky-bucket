import { login } from './login';
import { Resolvers } from '../generated/types';
import { generatePix } from './generate-pix';
import { register } from './create-user';

const resolvers: Resolvers = {
  Mutation: {
    generatePix,
    register,
    login,
  },
};

export default resolvers;
