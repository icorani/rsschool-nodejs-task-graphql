import { Type } from '@fastify/type-provider-typebox';
import {Query} from "./resolvers/queries.js";
import {Mutation} from "./resolvers/mutations.js";
import {GraphQLSchema} from "graphql/type/index.js";

export const gqlRootSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});


export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};


