import { GraphQLFieldConfigMap, GraphQLString } from 'graphql';

export const pixQueries: GraphQLFieldConfigMap<any, any> = {
  hello: {
    type: GraphQLString,
    resolve: () => 'Hello World from Pix!',
  },
};
