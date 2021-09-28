import { gql } from 'graphql-request'

export const getReceiverTransactionsQuery = gql`
  query($receivingChainId: BigInt!, $status: TransactionStatus!, $first: Int, $skip: Int) {
    transactions(
      where: { status: $status, receivingChainId: $receivingChainId }
      orderBy: preparedBlockNumber
      first: $first
      skip: $skip
      orderDirection: desc
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
