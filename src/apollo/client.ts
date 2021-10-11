import { ApolloClient, InMemoryCache } from '@apollo/client'
import { getDeployedSubgraphUri } from '@connext/nxtp-utils'

export const healthClient = new ApolloClient({
  uri: 'https://api.thegraph.com/index-node/graphql',
  cache: new InMemoryCache(),
})

// export const blockClient = new ApolloClient({
//   uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
//   cache: new InMemoryCache(),
//   queryDeduplication: true,
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: 'no-cache',
//     },
//     query: {
//       fetchPolicy: 'no-cache',
//       errorPolicy: 'all',
//     },
//   },
// })

// export const client = new ApolloClient({
//   uri: getDeployedSubgraphUri(56),
//   cache: new InMemoryCache({
//     typePolicies: {
//       Token: {
//         // Singleton types that have no identifying field can use an empty
//         // array for their keyFields.
//         keyFields: false,
//       },
//       Pool: {
//         // Singleton types that have no identifying field can use an empty
//         // array for their keyFields.
//         keyFields: false,
//       },
//     },
//   }),
//   queryDeduplication: true,
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: 'no-cache',
//     },
//     query: {
//       fetchPolicy: 'no-cache',
//       errorPolicy: 'all',
//     },
//   },
// })

export const polygonClient = new ApolloClient({
  uri: getDeployedSubgraphUri(137),
  cache: new InMemoryCache(),
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
})
