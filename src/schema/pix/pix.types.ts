import { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';

export const PixKeyResultType = new GraphQLObjectType({
  name: 'PixKeyResult',
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    remainingTokens: { type: GraphQLInt },
  },
});
