import { Resolvers } from '../generated/types';
import { generatePix } from './generate-pix';

import { withRateLimit } from '../../middlewares/rate-limiter';

const resolvers: Resolvers = {
  Mutation: {
    generatePix: withRateLimit(generatePix),
  },
};

export default resolvers;
