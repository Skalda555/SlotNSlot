import { fromJS } from 'immutable';
import { ACTION_TYPES } from './actions';
import Web3Service from '../../helpers/web3Service';

export const WATCH_SLOT_INITIAL_STATE = fromJS({
  isLoading: false,
  isPlaying: false,
  isOccupied: false,
  hasError: false,
  betSize: 20,
  lineNum: 20,
  deposit: 0,
  bankRoll: 0,
  betUnit: 2,
  minBet: 2,
  maxBet: 20,
  slotMachineContract: null,
  recentTxHash: '',
});

export function reducer(state = WATCH_SLOT_INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.START_TO_SEND_ETHER_TO_CONTRACT:
    case ACTION_TYPES.START_TO_GET_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', true).set('hasError', false);
      });
    }

    case ACTION_TYPES.FAILED_TO_GET_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasError', true);
      });
    }

    case ACTION_TYPES.SET_OCCUPIED_STATE: {
      return state.set('isOccupied', action.payload.occupied);
    }

    case ACTION_TYPES.SUCCEEDED_TO_GET_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState
          .set('isLoading', false)
          .set('hasError', false)
          .set('minBet', parseFloat(action.payload.minBet))
          .set('betSize', parseFloat(action.payload.minBet))
          .set('maxBet', parseFloat(action.payload.maxBet))
          .set('betUnit', parseFloat(action.payload.minBet))
          .set('bankRoll', action.payload.bankRoll) // Big Number
          .set('deposit', action.payload.deposit) // Big Number
          .set('slotMachineContract', action.slotMachineContract);
      });
    }

    case ACTION_TYPES.SEND_ETHER_TO_SLOT_CONTRACT: {
      return state.withMutations(currentState => {
        const bigNumber = Web3Service.getWeb3().toBigNumber(
          parseFloat(action.payload.weiValue, 10) + parseFloat(currentState.get('deposit'), 10),
        );
        return currentState.set('deposit', bigNumber).set('isLoading', false).set('hasError', false);
      });
    }

    case ACTION_TYPES.START_TO_OCCUPY_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', true).set('hasError', false);
      });
    }

    case ACTION_TYPES.FAILED_TO_SEND_ETHER_TO_CONTRACT:
    case ACTION_TYPES.FAILED_TO_OCCUPY_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasError', true);
      });
    }

    case ACTION_TYPES.SUCCEEDED_TO_OCCUPY_SLOT_MACHINE: {
      return state.withMutations(currentState => {
        return currentState.set('isLoading', false).set('hasError', false).set('isOccupied', true);
      });
    }

    case ACTION_TYPES.START_TO_WATCH_GAME: {
      return state.withMutations(currentState => {
        return currentState.set('isPlaying', true).set('hasError', false).set('recentTxHash', action.payload.txHash);
      });
    }

    case ACTION_TYPES.FAILED_TO_WATCH_GAME: {
      return state.set('hasError', true);
    }

    case ACTION_TYPES.SUCCEEDED_TO_WATCH_GAME: {
      return state.withMutations(currentState => {
        return currentState
          .set('isPlaying', false)
          .set('deposit', currentState.get('deposit').plus(parseFloat(action.payload.diffMoney, 10)))
          .set('bankRoll', currentState.get('bankRoll').minus(parseFloat(action.payload.diffMoney, 10)));
      });
    }

    case ACTION_TYPES.SET_BET_SIZE: {
      return state.set('betSize', action.payload.betSize);
    }

    case ACTION_TYPES.SET_LINE_NUM: {
      return state.set('lineNum', action.payload.lineNum);
    }

    case ACTION_TYPES.SET_BANK_ROLL: {
      return state.set('bankRoll', action.payload.bankRoll);
    }

    case ACTION_TYPES.SPIN_START: {
      return state.set('isSpinning', true);
    }

    case ACTION_TYPES.SPIN_END: {
      return state.set('isSpinning', false);
    }

    default:
      return state;
  }
}
