import React from 'react';
import { connect } from 'react-redux';
import SlotGame from '../playSlot/game';
import * as Actions from './actions';
import Web3Service from '../../helpers/web3Service';
import styles from './watchSlot.scss';
import Store from 'store';

let gameAlreadyLoaded = false;
let slotMachineLoaded = false;

function mapStateToProps(appState) {
  return {
    root: appState.root,
    watchSlotState: appState.watchSlot,
  };
}

class WatchSlot extends React.PureComponent {
  constructor(props) {
    super(props);

    this.slotAddress = this.props.match.params.slotAddress;
    Web3Service.createGenesisRandomNumber(this.slotAddress);
    this.removeSlotMachine = this.removeSlotMachine.bind(this);
  }

  componentDidMount() {
    if (!this.canvas || gameAlreadyLoaded) {
      return;
    }

    const { root, watchSlotState } = this.props;

    gameAlreadyLoaded = true;
    if (root.get('account') !== null && !slotMachineLoaded) {
      this.getSlotMachine(this.slotAddress, root.get('account'));
      slotMachineLoaded = true;
    }

    this.slotGame = new SlotGame({
      canvas: this.canvas,
      isLoading: watchSlotState.get('isLoading'),
      hasError: watchSlotState.get('hasError'),
      lineNum: watchSlotState.get('lineNum'),
      betSize: watchSlotState.get('betSize'),
      betUnit: watchSlotState.get('betUnit'),
      minBet: watchSlotState.get('minBet'),
      maxBet: watchSlotState.get('maxBet'),
      bankRoll: watchSlotState.get('bankRoll'),
      yourStake: watchSlotState.get('deposit'),
      slotName: watchSlotState.get('slotName'),
      isOwnerPage: true,
    });

    Store.set('initEvent', {});
  }

  componentWillReceiveProps(nextProps) {
    const { root, watchSlotState } = nextProps;

    if (this.props.watchSlotState !== watchSlotState || this.props.root !== root) {
      this.slotGame.isLoading = watchSlotState.get('isLoading');
      this.slotGame.lineNum = watchSlotState.get('lineNum');
      this.slotGame.betSize = watchSlotState.get('betSize');
      this.slotGame.betUnit = watchSlotState.get('betUnit');
      this.slotGame.maxBet = watchSlotState.get('maxBet');
      this.slotGame.minBet = watchSlotState.get('minBet');
      this.slotGame.hasError = watchSlotState.get('hasError');
      this.slotGame.bankRoll = watchSlotState.get('bankRoll');
      this.slotGame.yourStake = watchSlotState.get('deposit');
      this.slotGame.slotName = watchSlotState.get('slotName');

      if (watchSlotState.get('slotMachineContract')) {
        this.watchGame(watchSlotState.get('slotMachineContract'));
      }

      // if (this.props.watchSlotState.get('recentTxHash') !== watchSlotState.get('recentTxHash')) {
      const curInitEvent = Store.get('initEvent');
      const recentTxHash = watchSlotState.get('recentTxHash');
      const spinEvent = curInitEvent[recentTxHash];
      if (spinEvent) {
        curInitEvent[recentTxHash] = false;
        Store.set('initEvent', curInitEvent);
        this.slotGame.startSpin();
        this.watchGameResult(watchSlotState.get('slotMachineContract'));
      }

      if (watchSlotState.get('hasError')) {
        this.slotGame.errorOccur();
      }

      if (root.get('account') !== null && !slotMachineLoaded) {
        this.getSlotMachine(this.slotAddress, root.get('account'));
        slotMachineLoaded = true;
      }
    }
  }

  componentWillUnmount() {
    if (this.slotGame) {
      this.slotGame.removeCurrentGame();
      gameAlreadyLoaded = false;
    }
  }

  render() {
    const { watchSlotState } = this.props;

    return (
      <div className={styles.watchSlotSection}>
        <div className={styles.watchSlotContainer}>
          <div className={styles.innerHeader}>
            <div className={styles.slotName}>
              ✨{watchSlotState.get('slotName')}✨
            </div>
            <div className={styles.rightBtns}>
              <button
                className={styles.helpBtn}
                onClick={() => {
                  alert('help');
                }}
              >
                ?
              </button>
              <button onClick={this.setDeposit} className={styles.headerBtn}>
                KICK
              </button>
              <button onClick={this.removeSlotMachine} className={styles.headerBtn}>
                CASH OUT
              </button>
            </div>
          </div>
          <div className={styles.gameContainer}>
            <canvas
              ref={canvas => {
                this.canvas = canvas;
              }}
            />
          </div>
        </div>
        <div className={styles.bottomSection}> bottom</div>
      </div>
    );
  }

  watchGame(slotMachineContract) {
    console.log('watch game is called');
    const { dispatch } = this.props;
    console.log(slotMachineContract);
    dispatch(Actions.watchSlotInfo(slotMachineContract));
  }

  watchGameResult(slotContract) {
    const { dispatch, watchSlotState } = this.props;
    const gameInfo = {
      slotMachineContract: slotContract,
      betSize: watchSlotState.get('betSize'),
      lineNum: watchSlotState.get('lineNum'),
    };
    dispatch(Actions.receiveSlotResult(gameInfo, this.slotGame.stopSpin));
  }

  getSlotMachine(slotAddress, playerAddress) {
    const { dispatch } = this.props;
    dispatch(Actions.getSlotMachine(slotAddress, playerAddress));
  }

  removeSlotMachine() {
    const { dispatch, root, watchSlotState } = this.props;
    dispatch(Actions.removeSlotMachine(watchSlotState.get('slotMachineContract').address, root.get('account')));
  }
}

export default connect(mapStateToProps)(WatchSlot);
