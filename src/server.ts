import { ApolloServer } from 'apollo-server-lambda';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { importSchema } from 'graphql-import';

const typeDefs = importSchema('schemas/schema.graphql');
export const graphqlHandler = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {endpoint: '/dev/graphql'},
  context: createContext
}).createHandler();