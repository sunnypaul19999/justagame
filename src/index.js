import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

let tArr = [];

class JustAGame extends React.Component {

  player1 = Symbol('player1');
  player2 = Symbol('player2');

  constructor(props) {
    super(props);
    this.state = this.getStartState();

    this.player1Ref = React.createRef();
    this.player2Ref = React.createRef();
  }

  getStartState() {
    return {
      status: false,
      turn: this.player1,
      player1: {
        power: 0,
        health: 100,
        wins: 0,
      },
      player2: {
        power: 0,
        health: 100,
        wins: 0,
      },
      round: { curr: 1, total: 5 },
    };
  }

  resetGame() {
    this.setState(this.getStartState());
    let player1ClassList = this.player1Ref.current.classList;
    if (player1ClassList.contains('winner')) {
      player1ClassList.remove('winner');
    } else {
      let player2ClassList = this.player2Ref.current.classList;
      if (player2ClassList.contains('winner')) {
        player2ClassList.remove('winner');
      }
    }
  }

  componentDidMount() {
    //console.log('mount')
    this.statMsg = document.getElementById('statMsg');
  }

  componentDidUpdate() {
    //console.log('update')
    //console.log(this.state);
  }

  setStatMsg(text) { this.statMsg.textContent = text; }

  getPlayer1() { return this.state.player1; }

  getPlayer2() { return this.state.player2; }

  getPlayer1Health() { return this.getPlayer1().health; }

  getPlayer2Health() { return this.getPlayer2().health; }

  getRound() { return this.state.round; }

  getCurrenRound() { return this.getRound().curr; }

  getPlayer1FirePower() { return this.getPlayer1().power; }

  getPlayer2FirePower() { return this.getPlayer2().power; }

  getPlayer1Wins() { return this.getPlayer1().wins; }

  getPlayer2Wins() { return this.getPlayer2().wins; }

  generatePower() { return (Math.floor(Math.random() * 5) + 1); }


  setPlayer1FirePower() {
    let player1Stat = this.getPlayer1();
    player1Stat.power = this.generatePower();
    this.setState({
      turn: this.getTurn(),
      status: this.state.status,
      player1: player1Stat,
      player2: this.getPlayer2(),
      round: this.getRound(),
    });

    this.setStatMsg(`Player 1 Power set ${player1Stat.power}`);
  }

  setPlayer2FirePower() {
    let player2Stat = this.getPlayer2();
    player2Stat.power = this.generatePower();

    this.setState({
      turn: this.getTurn(),
      status: this.state.status,
      player1: this.getPlayer1(),
      player2: player2Stat,
      round: this.getRound(),
    });

    this.setStatMsg(`Player 2 Power set to ${player2Stat.power}`);
  }

  setPlayer1Health() {
    let player1Stat = this.getPlayer1();
    player1Stat.health -= 20 * this.getPlayer2FirePower();

    //player1Stat.health = 0;

    if (player1Stat.health < 0) player1Stat.health = 0;

    this.setState({
      turn: this.getTurn(),
      status: this.state.status,
      player1: player1Stat,
      player2: this.getPlayer2(),
      round: this.getRound(),
    });
  }

  setPlayer2Health() {
    let player2Stat = this.getPlayer2();
    player2Stat.health -= 20 * this.getPlayer1FirePower();
    if (player2Stat.health < 0) player2Stat.health = 0;

    //console.log(this.getPlayer1FirePower());

    this.setState({
      turn: this.getTurn(),
      status: this.state.status,
      player1: this.getPlayer1(),
      player2: player2Stat,
      round: this.getRound(),
    });
  }

  getTurn() { return this.state.turn; }

  switchTurn() {
    let turn;
    if (this.getTurn() === this.player1) {
      turn = this.player2;
    } else {
      turn = this.player1;
    }

    this.setState({
      turn: turn,
      status: this.state.status,
      player1: this.getPlayer1(),
      player2: this.getPlayer2(),
      round: this.getRound(),
    });
  }

  nextRound() {
    let roundStat = this.getRound();
    roundStat.curr += 1;

    this.setState({
      turn: this.getTurn(),
      status: this.state.status,
      player1: this.getPlayer1(),
      player2: this.getPlayer2(),
      round: roundStat,
    });
  }

  isPLayer1Turn() { return (this.getTurn() === this.player1); }

  fireTo(player) {
    if (player === this.player1) {
      this.setPlayer1Health();
      this.setStatMsg(`Player 2 Fires`);
    } else {
      this.setPlayer2Health();
      this.setStatMsg(`Player 1 Fires`);
    }
  }

  whoWon() {
    if (this.getPlayer1Health() <= 0) {
      return this.player2;
    }
    if (this.getPlayer2Health() <= 0) {
      return this.player1;
    }

    return false;
  }

  getChamp() {
    if (this.getPlayer1().wins < this.getPlayer2().wins) {
      let roundReqDrawMatch = this.getPlayer2().wins - this.getPlayer1().wins;
      let roundsLeft = this.getRound().total - this.getCurrenRound();
      if (roundsLeft < roundReqDrawMatch) {
        return this.player2;
      }
    } else {
      if (this.getPlayer2().wins < this.getPlayer1().wins) {
        let roundReqDrawMatch = this.getPlayer1().wins - this.getPlayer2().wins;
        let roundsLeft = this.getRound().total - this.getCurrenRound();
        if (roundsLeft < roundReqDrawMatch) {
          return this.player1;
        }
      }
    }

    return false;
  }

  setWin(player) {
    let playerStat;

    if (player === this.player1) {
      playerStat = this.getPlayer1();
      playerStat.wins += 1;
      this.setState({
        turn: this.getTurn(),
        status: this.state.status,
        player1: this.getPlayer1(),
        player2: this.getPlayer2(),
        round: this.getRound(),
      });
    } else {
      playerStat = this.getPlayer2();
      playerStat.wins += 1;
      this.setState({
        turn: this.getTurn(),
        status: this.state.status,
        player1: this.getPlayer1(),
        player2: this.getPlayer2(),
        round: this.getRound(),
      });
    }
  }

  resetHealthPower() {
    let player1Stat = this.getPlayer1();
    player1Stat.health = 100;
    player1Stat.power = 0;

    let player2Stat = this.getPlayer2();
    player2Stat.health = 100;
    player2Stat.power = 0;

    this.setState({
      turn: this.getTurn(),
      status: this.state.status,
      player1: player1Stat,
      player2: player2Stat,
      round: this.getRound(),
    });
  }

  setWinner(champ) {
    if (champ === this.player1) {
      this.setStatMsg('PLAYER 1 WINNER!');
      this.player1Ref.current.classList.add('winner');
    } else {
      this.setStatMsg('PLAYER 2 WINNER!');
      this.player2Ref.current.classList.add('winner');
    }
  }

  routine() {
    let tId = setTimeout(() => {
      this.switchTurn();
      //tArr.pop();
      this.filterTID(tId);
      this.gameManager();
    }, 2000);

    return tId;
  }

  gameManager() {
    //console.log('game manager');

    let survivor = this.whoWon();

    //console.log(tArr);

    if (survivor) {
      //console.log(champ);
      this.setWin(survivor);

      let champ = this.getChamp();

      if (champ) {
        this.setWinner(survivor);
      } else {
        this.setStatMsg(`Starting Round ${this.getCurrenRound() + 1}`);

        this.resetHealthPower();

        let tId = setTimeout(() => {
          this.nextRound();
          //tArr.pop();
          tArr.push(this.routine());
          this.filterTID(tId);
        }, 2000);

        tArr.push(tId);
      }

      /*if ((this.getCurrenRound() + 1) <= this.getRound().total) {

        this.setStatMsg(`Startig Round ${this.getCurrenRound() + 1}`);

        this.resetHealthPower();

        let tId = setTimeout(() => {
          this.nextRound();
          //tArr.pop();
          tArr.push(this.routine());
          this.filterTID(tId);
        }, 2000);

        tArr.push(tId);

      } else {
        this.setWinner(survivor);
      }*/
    } else {
      if (this.isPLayer1Turn()) {
        //console.log('player 1');

        this.setPlayer1FirePower();

        let tId = setTimeout(() => {
          this.fireTo(this.player2);
          //tArr.pop();
          tArr.push(this.routine());
          //tArr.filter((etId) => (etId !== tId) ? true : false);
          this.filterTID(tId);
        }, 2000);

        tArr.push(tId);

      } else {
        this.setPlayer2FirePower();
        //console.log('player 2');

        let tId = setTimeout(() => {
          this.fireTo(this.player1);
          tArr.push(this.routine());
          //tArr.pop();
          this.filterTID(tId);
        }, 2000);

        tArr.push(tId);

      }
    }
  }

  filterTID(tId) {
    console.log('filter ' + tArr.length + '\t' + tId);
    console.log(tArr);
    tArr = tArr.filter((etId) => (etId === tId) ? false : true);
    console.log(tArr);
    console.log('after filter ' + tArr.length);
  }

  startNewGame(event) {
    event.stopPropagation();
    this.resetGame();
    this.setStatMsg('Starting Game');
    tArr.forEach((tId) => { clearTimeout(tId); });
    tArr = [];
    setTimeout(() => {
      this.gameManager();
    }, 3000);
  }


  render() {
    return (
      <div className="game-layout">
        <div className="card">
          <div className="card-body">
            <div className="card-title">Just A Game</div>
            <div className="game-round">Round {this.getCurrenRound()}</div>
            <div className="game-body">
              <div ref={this.player1Ref} className="player one row">
                <div className="player-name col">
                  Player 1
                  <div className="bullets" style={{ fontSize: '10px' }}>Fire Power: {this.getPlayer1FirePower()}</div>
                  <div className="health-bar">
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" style={{ width: `${this.getPlayer1Health()}%` }}></div>
                    </div>
                  </div>
                </div>
                <div id="playerOneWinCount" className="win-count col">Won: <span className="count great">{this.getPlayer1Wins()}</span>
                </div>
              </div>
              <div ref={this.player2Ref} className="player two row">
                <div className="player-name col">
                  Player 2
                  <div className="bullets" style={{ fontSize: '10px' }}>Fire Power: {this.getPlayer2FirePower()}</div>
                  <div className="health-bar">
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" style={{ width: `${this.getPlayer2Health()}%` }}></div>
                    </div>
                  </div>
                </div>
                <div id="playerOneTwoCount" className="win-count col">Won: <span className="count">{this.getPlayer2Wins()}</span></div>
              </div>
              <div className="next-round-loader">
                <div id='statMsg' className="declare-winner">Player 1 Fires!</div>
                <div className="progress-setup hidden">
                  <div className="next-round-count">Round 2</div>
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <button className="new-game-button btn btn-outline-primary" onClick={this.startNewGame.bind(this)}>New Game</button>
          </div>
        </div>
      </div>
    );
  }
}



ReactDOM.render(<JustAGame />, document.querySelector("#root"))
