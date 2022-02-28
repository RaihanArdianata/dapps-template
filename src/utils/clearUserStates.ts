import { Dispatch } from '@reduxjs/toolkit'
// import { profileClear } from '../state/profile'
import { connectorsByName } from './web3React'
// import { clearAllTransactions } from '../state/transactions/actions'

export const clearUserStates = (dispatch: Dispatch<any>, chainId: number) => {
//   dispatch(profileClear())
  // This localStorage key is set by @web3-react/walletconnect-connector
  if (window.localStorage.getItem('walletconnect')) {
    connectorsByName.walletconnect.close()
    connectorsByName.walletconnect.walletConnectProvider = null
  }
  window.localStorage.removeItem('connectorIdv2')
  if (chainId) {
    // dispatch(clearAllTransactions({ chainId }))
  }
}
