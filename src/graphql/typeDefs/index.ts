import { gql } from 'graphql-tag';

const typeDefs = gql`
  type PixKeyResult {
    success: Boolean!
    message: String!
  }

  type Query {
    me: String
  }

  type Mutation {
    generatePix(key: String!, value: Float!): PixKeyResult!
    login(email: String!, password: String!): String!
    register(email: String!, password: String!, name: String!): String!
  }
`;

export default typeDefs;
