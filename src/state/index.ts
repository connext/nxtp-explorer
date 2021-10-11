import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import lists from './lists/reducer'
import multicall from './multicall/reducer'
import protocol from './protocol/reducer'
import tokens from './tokens/reducer'
import pools from './pools/reducer'

import { fetchTransactionVolumeData } from 'subgraph'

const PERSISTED_KEYS: string[] = ['user', 'lists']

const store = configureStore({
  reducer: {
    application,
    user,
    multicall,
    lists,
    protocol,
    tokens,
    pools,
  },
  middleware: [...getDefaultMiddleware({ thunk: false, immutableCheck: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useProtocolChartData = () => {
  const chartData = [
    {
      date: 1633392000,
      volumeUSD: 771415.3808254829,
    },
    {
      date: 1633478400,
      volumeUSD: 1458338.7261402067,
    },
    {
      date: 1633564800,
      volumeUSD: 885576.0597027346,
    },
    {
      date: 1633651200,
      volumeUSD: 2447556.558550479,
    },
    {
      date: 1633737600,
      volumeUSD: 1833017.2894667606,
    },
    {
      date: 1633824000,
      volumeUSD: 2051906.672936957,
    },
    {
      date: 1633910400,
      volumeUSD: 345399.05090128945,
    },
  ]

  const totalVolume = 9795321.259540912

  return { chartData, totalVolume }
}
