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

export const bscClient = new ApolloClient({
  uri: getDeployedSubgraphUri(56),
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

export const xdaiClient = new ApolloClient({
  uri: getDeployedSubgraphUri(100),
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

export const fantomClient = new ApolloClient({
  uri: getDeployedSubgraphUri(250),
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

export const arbitrumClient = new ApolloClient({
  uri: getDeployedSubgraphUri(42161),
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

export const avalancheClient = new ApolloClient({
  uri: 'https://connext-avalanche-subgraph.apps.bwarelabs.com/subgraphs/name/connext/nxtp-avalanche',
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
// chains: [56, 137, 100, 250, 42161, 43114],

export const apolloClients = (chainId: number) => {
  switch (chainId) {
    case 56:
      return bscClient
    case 100:
      return xdaiClient
    case 137:
      return polygonClient
    case 250:
      return fantomClient
    case 42161:
      return arbitrumClient
    case 43114:
      return avalancheClient
    default:
      return undefined
  }
}
