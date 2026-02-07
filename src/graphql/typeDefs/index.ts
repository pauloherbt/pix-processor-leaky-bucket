import { gql } from 'graphql-tag';

const typeDefs = gql`
  type PixKeyResult {
    success: Boolean!
    message: String
    remainingTokens: Int
  }

  type Query {
    _empty: String
  }

  type Mutation {
    generatePix(key: String!, value: Float!): PixKeyResult!
  }
`;

export default typeDefs;
