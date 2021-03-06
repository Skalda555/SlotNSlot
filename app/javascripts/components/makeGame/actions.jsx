import Web3Service from '../../helpers/web3Service';
import Toast from '../../helpers/notieHelper';
import { refreshBalance } from '../../root/actions';
import { getMySlotMachines } from '../slotList/actions';

export const ACTION_TYPES = {
  SELECT_HIT_RATIO: 'make_game.SELECT_HIT_RATIO',
  SET_MAX_PRIZE: 'make_game.SET_MAX_PRIZE',
  CHANGE_TOTAL_STAKE: 'make_game.CHANGE_TOTAL_STAKE',
  SET_BET_MIN_VALUE: 'make_game.SET_BET_MIN_VALUE',
  SET_BET_MAX_VALUE: 'make_game.SET_BET_MAX_VALUE',
  SET_SLOT_NAME: 'make_game.SET_SLOT_NAME',

  START_TO_MAKE_GAME: 'make_game.START_TO_MAKE_GAME',
  SUCCEED_TO_MAKE_GAME: 'make_game.SUCCEED_TO_MAKE_GAME',
  FAILED_TO_MAKE_GAME: 'make_game.FAILED_TO_MAKE_GAME',
};

export function requestToMakeGame({ account, decider, minBet, maxBet, maxPrize, totalStake, slotName }) {
  return async dispatch => {
    Toast.notie.alert({
      text: 'Start to making a slot machine',
    });
    dispatch({
      type: ACTION_TYPES.START_TO_MAKE_GAME,
    });
    try {
      const transaction = await Web3Service.createSlotMachine({
        account,
        decider,
        minBet,
        maxBet,
        maxPrize,
        slotName,
      });
      const slotAddr = transaction.args._slotaddr;
      await Web3Service.sendEtherToAccount({
        from: account,
        to: slotAddr,
        etherValue: totalStake,
      });
      Toast.notie.alert({
        text: 'Finished to making a slot machine',
      });
      dispatch({
        type: ACTION_TYPES.SUCCEED_TO_MAKE_GAME,
        payload: transaction,
      });
      dispatch(refreshBalance(account));
      dispatch(getMySlotMachines(account));
    } catch (err) {
      console.error(err);
      Toast.notie.alert({
        type: 'error',
        text: 'There was an error for making a slot machine',
      });
      dispatch({
        type: ACTION_TYPES.FAILED_TO_MAKE_GAME,
      });
    }
  };
}

export function selectHitRation(hitRatio) {
  return {
    type: ACTION_TYPES.SELECT_HIT_RATIO,
    payload: {
      hitRatio,
    },
  };
}

export function handleTotalStakeChange(totalStake) {
  return {
    type: ACTION_TYPES.CHANGE_TOTAL_STAKE,
    payload: {
      totalStake,
    },
  };
}

export function setMaxPrize(maxPrize) {
  return {
    type: ACTION_TYPES.SET_MAX_PRIZE,
    payload: {
      maxPrize,
    },
  };
}

export function setBetMinValue(value) {
  return {
    type: ACTION_TYPES.SET_BET_MIN_VALUE,
    payload: {
      value,
    },
  };
}

export function setBetMaxValue(value) {
  return {
    type: ACTION_TYPES.SET_BET_MAX_VALUE,
    payload: {
      value,
    },
  };
}

export function setSlotName(slotName) {
  return {
    type: ACTION_TYPES.SET_SLOT_NAME,
    payload: {
      slotName,
    },
  };
}
