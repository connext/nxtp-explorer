// import { gql } from 'graphql-request'
import { gql } from '@apollo/client'

export const getReceiverFulfilledQuery = gql`
  query ($receivingChainId: BigInt!, $skip: Int) {
    transactions(
      where: { status: "Fulfilled", receivingChainId: $receivingChainId }
      orderBy: preparedTimestamp
      first: 1000
      skip: $skip
      orderDirection: asc
    ) {
      chainId
      preparedTimestamp
      receivingAssetId
      amount
    }
  }
`

export const getReceiverTransactionsQuery = gql`
  query ($receivingChainId: BigInt!, $status: TransactionStatus!, $skip: Int) {
    transactions(
      where: { status: $status, receivingChainId: $receivingChainId }
      orderBy: preparedBlockNumber
      first: 1000
      skip: $skip
      orderDirection: asc
    ) {
      id
      status
      chainId
      user {
        id
      }
      router {
        id
      }
      receivingChainTxManagerAddress
      sendingAssetId
      receivingAssetId
      sendingChainFallback
      receivingAddress
      callTo
      sendingChainId
      receivingChainId
      callDataHash
      transactionId
      amount
      expiry
      preparedBlockNumber
      encryptedCallData
      encodedBid
      bidSignature
      prepareCaller
      fulfillCaller
      cancelCaller
      prepareTransactionHash
      fulfillTransactionHash
      cancelTransactionHash
    }
  }
`

export const getLiquidityQuery = gql`
  query {
    assetBalances {
      amount
      id
    }
  }
`
