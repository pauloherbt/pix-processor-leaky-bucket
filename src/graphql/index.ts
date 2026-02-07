import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import * as mutations from './resolvers';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // Add your query resolvers here
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...mutations,
    },
  }),
});
