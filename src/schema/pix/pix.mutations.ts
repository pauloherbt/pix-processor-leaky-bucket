import { GraphQLFieldConfigMap } from 'graphql';
import { PixKeyResultType } from './pix.types';
import { generatePix } from '../../resolvers/pix/generate-pix';

export const pixMutations: GraphQLFieldConfigMap<any, any> = {
  generatePix: {
    type: PixKeyResultType,
    resolve: generatePix,
  },
};
