import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import UserUpdater from './state/user/updater'
import ProtocolUpdater from './state/protocol/updater'
// import TokenUpdater from './state/tokens/updater'
// import PoolUpdater from './state/pools/updater'
// import ApplicationUpdater from './state/application/updater'
// import ListUpdater from './state/lists/updater'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client'
import store from './state'
import { Provider } from 'react-redux'
import 'inter-ui'

import { HashRouter } from 'react-router-dom'

import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'

const client = new ApolloClient({
  cache: new InMemoryCache(),
})

function Updaters() {
  return (
    <>
      {/* <ListUpdater /> */}
      <UserUpdater />
      <ProtocolUpdater />
      {/* <TokenUpdater />
      <PoolUpdater />
      <ApplicationUpdater /> */}
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <FixedGlobalStyle />
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Updaters />
        <ThemeProvider>
          <ThemedGlobalStyle />
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
