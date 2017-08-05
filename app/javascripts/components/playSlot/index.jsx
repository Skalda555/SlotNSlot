import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import SlotGame from './game';
import * as Actions from './actions';
import Web3Service from '../../helpers/web3Service';
import styles from './playSlot.scss';
import './react-table.scss';
import { USER_TYPES } from '../slotList/actions';

let gameAlreadyLoaded = false;
let slotMachineLoaded = false;

function mapStateToProps(appState) {
  return {
    root: appState.root,
    playSlotState: appState.playSlot,
  };
}

class PlaySlot extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setDeposit = this.setDeposit.bind(this);
    this.leaveSlotMachine = this.leaveSlotMachine.bind(this);
    this.slotAddress = this.props.match.params.slotAddress;
    Web3Service.createGenesisRandomNumber(this.slotAddress, USER_TYPES.PLAYER);
  }

  componentDidMount() {
    if (!this.canvas || gameAlreadyLoaded) {
      return;
    }

    const { root, playSlotState } = this.props;

    gameAlreadyLoaded = true;
    if (root.get('account') !== null && !slotMachineLoaded) {
      this.getSlotMachine(this.slotAddress, root.get('account'));
      slotMachineLoaded = true;
    }

    this.slotGame = new SlotGame({
      canvas: this.canvas,
      isLoading: playSlotState.get('isLoading'),
      hasError: playSlotState.get('hasError'),
      lineNum: playSlotState.get('lineNum'),
      betSize: playSlotState.get('betSize'),
      betUnit: playSlotState.get('betUnit'),
      minBet: playSlotState.get('minBet'),
      maxBet: playSlotState.get('maxBet'),
      bankRoll: playSlotState.get('bankRoll'),
      yourStake: playSlotState.get('deposit'),
      slotName: playSlotState.get('slotName'),
      setBetSize: this.setBetSize.bind(this),
      setLineNum: this.setLineNum.bind(this),
      playGame: this.playGame.bind(this),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { root, playSlotState } = nextProps;

    if (this.props.playSlotState !== playSlotState || this.props.root !== root) {
      this.slotGame.isLoading = playSlotState.get('isLoading');
      this.slotGame.lineNum = playSlotState.get('lineNum');
      this.slotGame.betSize = playSlotState.get('betSize');
      this.slotGame.betUnit = playSlotState.get('betUnit');
      this.slotGame.maxBet = playSlotState.get('maxBet');
      this.slotGame.minBet = playSlotState.get('minBet');
      this.slotGame.hasError = playSlotState.get('hasError');
      this.slotGame.bankRoll = playSlotState.get('bankRoll');
      this.slotGame.yourStake = playSlotState.get('deposit');
      this.slotGame.slotName = playSlotState.get('slotName');

      if (playSlotState.get('hasError')) {
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
    const { playSlotState } = this.props;
    const betsData = playSlotState.get('betsData').toJS();
    const tableCategory = playSlotState.get('tableCategory');

    let loader = null;
    if (playSlotState.get('isLoading') || !playSlotState.get('isOccupied')) {
      loader = <div className={styles.loadingBlocker} />;
    }

    const columns = [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'TIME',
        accessor: 'time',
      },
      {
        Header: 'BET',
        accessor: 'bet',
      },
      {
        Header: 'RESULT',
        accessor: 'result',
      },
      {
        getProps: (state, rowInfo) => {
          let cellFontColor = null;
          if (rowInfo !== undefined) {
            if (parseFloat(rowInfo.row.profit) > 0) {
              cellFontColor = '#00CDAC';
              rowInfo.row.profit = `+${rowInfo.row.profit}`;
            } else if (parseFloat(rowInfo.row.profit) < 0) {
              cellFontColor = '#FF2A48';
              rowInfo.row.profit = `-${rowInfo.row.profit}`;
            }
          }
          return {
            style: {
              color: cellFontColor,
            },
          };
        },
        Header: 'PROFIT',
        accessor: 'profit',
      },
    ];

    return (
      <div className={styles.playSlotSection}>
        <div className={styles.playSlotContainer}>
          <div className={styles.innerHeader}>
            <div className={styles.slotName}>
              ✨{playSlotState.get('slotName')}✨
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
                DEPOSIT
              </button>
              <button onClick={this.leaveSlotMachine} className={styles.headerBtn}>
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
            {loader}
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.bottomContainer}>
            <div
              onClick={() => {
                this.props.dispatch(Actions.setCategory(0));
              }}
              className={`${styles.sectionMenu} ${tableCategory === 0 ? styles.active : ''}`}
            >
              YOUR BETS
            </div>
            <div
              onClick={() => {
                this.props.dispatch(Actions.setCategory(1));
              }}
              className={`${styles.sectionMenu} ${tableCategory === 1 ? styles.active : ''}`}
            >
              ALL BETS
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <ReactTable
              className=""
              data={betsData}
              columns={columns}
              defaultPageSize={10}
              showPageSizeOptions={false}
            />
          </div>
        </div>
      </div>
    );
  }

  setDeposit() {
    const { dispatch, root, playSlotState } = this.props;
    const ethValue = prompt('Please insert the maximum Ethereum value you want to bet');

    if (root.get('balance') < ethValue) {
      alert('Your bet amount should be under your balance');
      return;
    }
    const ethValueBigNumber = Web3Service.getWeb3().toBigNumber(ethValue);
    const weiValue = Web3Service.makeWeiFromEther(parseFloat(ethValue, 10));
    const slotMachineContract = playSlotState.get('slotMachineContract');
    if (playSlotState.get('isOccupied')) {
      dispatch(Actions.sendEtherToSlotContract(slotMachineContract, root.get('account'), weiValue));
    } else {
      dispatch(Actions.occupySlotMachine(slotMachineContract, root.get('account'), weiValue));
      dispatch(Actions.setDeposit(ethValueBigNumber));
    }
  }

  setBetSize(betSize) {
    const { dispatch } = this.props;
    dispatch(Actions.setBetSize(betSize));
  }

  setLineNum(lineNum) {
    const { dispatch } = this.props;
    dispatch(Actions.setLineNum(lineNum));
  }

  playGame() {
    const { dispatch, root, playSlotState } = this.props;
    const gameInfo = {
      slotMachineContract: playSlotState.get('slotMachineContract'),
      playerAddress: root.get('account'),
      betSize: playSlotState.get('betSize'),
      lineNum: playSlotState.get('lineNum'),
    };
    dispatch(Actions.requestToPlayGame(gameInfo, this.slotGame.stopSpin));
  }

  getSlotMachine(slotAddress, playerAddress) {
    const { dispatch } = this.props;
    dispatch(Actions.getSlotMachine(slotAddress, playerAddress));
  }

  leaveSlotMachine() {
    const { dispatch, root, playSlotState } = this.props;
    dispatch(Actions.leaveSlotMachine(playSlotState.get('slotMachineContract'), root.get('account')));
  }
}

export default connect(mapStateToProps)(PlaySlot);
