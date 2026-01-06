import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { pixMutations } from './pix/pix.mutations';
import { pixQueries } from './pix/pix.queries';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...pixQueries,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...pixMutations,
    },
  }),
});
