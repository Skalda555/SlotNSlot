import * as Redux from 'redux';
import { routerReducer } from 'react-router-redux';
import * as RootReducer from './root/reducer';
import * as MakeGameReducer from './components/makeGame/reducer';
import * as AboutLayoutReducer from './components/about/layouts/reducer';
import * as AboutCrowdSaleReducer from './components/about/crowdSaleContainer/reducer';
import * as PlaySlotReducer from './components/playSlot/reducer';
import * as WatchSlotReducer from './components/watchSlot/reducer';
import * as SlotListReducer from './components/slotList/reducer';

export const initialState = {
  root: RootReducer.initialState,
  makeGame: MakeGameReducer.initialState,
  playSlot: PlaySlotReducer.initialState,
  watchSlot: WatchSlotReducer.initialState,
  aboutLayout: AboutLayoutReducer.initialState,
  aboutCrowdSale: AboutCrowdSaleReducer.initialState,
  slotList: SlotListReducer.initialState,
};

export const rootReducer = Redux.combineReducers({
  root: RootReducer.reducer,
  makeGame: MakeGameReducer.reducer,
  playSlot: PlaySlotReducer.reducer,
  watchSlot: WatchSlotReducer.reducer,
  aboutLayout: AboutLayoutReducer.reducer,
  aboutCrowdSale: AboutCrowdSaleReducer.reducer,
  slotList: SlotListReducer.reducer,
  router: routerReducer,
});
