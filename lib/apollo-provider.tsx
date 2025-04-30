"use client";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { type ReactNode, useMemo } from "react";
import { useAuth } from "./auth-provider";

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
        "https://fullstack-assignment-ijo0.onrender.com/graphql",
    });

    const authLink = setContext(async (_, { headers }) => {
      // Get the authentication token from the auth provider
      const token = await getToken();

      // Return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
