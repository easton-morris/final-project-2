import React from 'react';
import AppContext from '../lib/app-context';

// Import custom CSS
import '../scss/styles.scss';

// Import all of Bootstrap's JS
// eslint-disable-next-line
import * as bootstrap from 'bootstrap';

import { parseRoute } from '../lib';

export default class Battles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        userId: 0,
        pkmn: {
          dexNumber: 0,
          physicalMove: '',
          pkmnName: '',
          pokemonId: 0,
          specialMove: '',
          sprite: '',
          statusMove: ''
        }
      },
      opponent: {
        leader: {
          leaderId: 0,
          leaderName: '',
          leaderPic: '',
          leaderPkmn: 0
        },
        pkmn: {
          dexNumber: 0,
          physicalMove: '',
          pkmnName: '',
          pokemonId: 0,
          specialMove: '',
          sprite: '',
          statusMove: ''
        }
      },
      battleResult: '',
      params: {}
    };

    this.onMoveSelectHandler = this.onMoveSelectHandler.bind(this);
    this.battleHandler = this.battleHandler.bind(this);
    this.battleUpdater = this.battleUpdater.bind(this);
    this.returnHomeHandler = this.returnHomeHandler.bind(this);
  }

  componentDidMount() {
    let dbBattleStatus = 'pending';

    const route = parseRoute(window.location.hash);
    const incParams = route.params;
    const newParams = {};
    for (const [item, value] of incParams.entries()) {
      newParams[`${item}`] = value;
    }

    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));
    const battleStatus = localStorage.getItem('battleStatus');

    if (currUser && !battleStatus) {
      fetch(`/api/battles/status/${newParams.recordId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currUser.token
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Something went wrong.');
          } else {
            return res.json();
          }
        })
        .then(status => {
          dbBattleStatus = status;
        })
        .catch(err => console.error(err));

      // using localStorage for battleStatus until auth is applied
      const battleStatus = localStorage.getItem('battleStatus');

      if (!battleStatus && dbBattleStatus === 'pending') {
        localStorage.setItem('battleStatus', 'in progress');
      } else if (!battleStatus && dbBattleStatus !== 'pending') {
        localStorage.setItem('battleStatus', `complete: ${dbBattleStatus}`);
      }

      fetch(`/api/pkmn-list/${newParams.userPkmn}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currUser.token
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Something went wrong.');
          } else {
            return res.json();
          }
        })
        .then(newPkmn => {
          const oldUser = this.state.user;
          this.setState({
            user: {
              ...oldUser,
              pkmn: newPkmn
            }
          });
        })
        .catch(err => console.error(err));

      fetch(`/api/pkmn-list/${newParams.leaderPkmn}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currUser.token
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Something went wrong.');
          } else {
            return res.json();
          }
        })
        .then(newPkmn => {
          const oldOpp = this.state.opponent;
          this.setState({
            opponent: {
              ...oldOpp,
              pkmn: newPkmn
            }
          });
        })
        .catch(err => console.error(err));

      fetch(`/api/leader-list/${newParams.leaderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currUser.token
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Something went wrong.');
          } else {
            return res.json();
          }
        })
        .then(newLeader => {
          const oldOpp = this.state.opponent;
          this.setState({
            opponent: {
              ...oldOpp,
              leader: newLeader
            }
          });
        })
        .catch(err => console.error(err));

      const oldUser = this.state.user;

      this.setState({
        user: {
          ...oldUser,
          userId: newParams.userPkmn
        },
        params: newParams
      });
    }
  }

  battleUpdater(result) {
    const battleData = {
      recordId: this.state.params.recordId,
      battleResult: result
    };
    fetch('/api/battles/result', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.context.user.token
      },
      body: JSON.stringify(battleData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong.');
        } else {
          return res.json();
        }
      })
      .then(record => {
        // using localStorage for battleStatus until auth is applied
        const battleStatus = localStorage.getItem('battleStatus');

        if (battleStatus === 'in progress') {
          localStorage.setItem('battleStatus', `complete: ${record.result}`);
        }
      })
      .catch(err => console.error(err));
  }

  battleHandler(userMove) {
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
    }

    // using localStorage for battleStatus until auth is applied
    const battleStatus = localStorage.getItem('battleStatus');
    if (battleStatus.includes('complete')) {
      const completedToast = document.getElementById('battleCompleted');
      const toast = new bootstrap.Toast(completedToast);

      toast.show();
    } else {
      // initialize the result modal
      const resultModal = new bootstrap.Modal('#battleResult', {
        keyboard: false
      });

      const leaderMove = getRandomIntInclusive(1, 3);

      if (leaderMove === 1) {
        if (userMove === 1) {
          this.setState({
            battleResult: 'tie'
          });
          resultModal.show();
        }
        if (userMove === 2) {
          this.setState({
            battleResult: 'win'
          });
          this.battleUpdater('win');
          resultModal.show();
        }
        if (userMove === 3) {
          this.setState({
            battleResult: 'loss'
          });
          this.battleUpdater('loss');
          resultModal.show();
        }
      } else if (leaderMove === 2) {
        if (userMove === 2) {
          this.setState({
            battleResult: 'tie'
          });
          resultModal.show();
        }
        if (userMove === 3) {
          this.setState({
            battleResult: 'win'
          });
          this.battleUpdater('win');
          resultModal.show();
        }
        if (userMove === 1) {
          this.setState({
            battleResult: 'loss'
          });
          this.battleUpdater('loss');
          resultModal.show();
        }
      } else if (leaderMove === 3) {
        if (userMove === 3) {
          this.setState({
            battleResult: 'tie'
          });
          resultModal.show();
        }
        if (userMove === 1) {
          this.setState({
            battleResult: 'win'
          });
          this.battleUpdater('win');
          resultModal.show();
        }
        if (userMove === 2) {
          this.setState({
            battleResult: 'loss'
          });
          this.battleUpdater('loss');
          resultModal.show();
        }
      }
    }
  }

  onMoveSelectHandler(event) {
    if (event.target.className === 'btn btn-success') {
      this.battleHandler(1);
    } else if (event.target.className === 'btn btn-danger') {
      this.battleHandler(2);
    } else if (event.target.className === 'btn btn-warning') {
      this.battleHandler(3);
    }

    event.preventDefault();
  }

  returnHomeHandler(event) {
    // using localStorage for battleStatus until auth is applied
    const battleStatus = localStorage.getItem('battleStatus');

    if (battleStatus === 'in progress') {
      const inProgressToast = document.getElementById('battleInProgress');
      const toast = new bootstrap.Toast(inProgressToast);

      toast.show();
    }

    if (battleStatus.includes('complete')) {
      // using localStorage until Auth is in place
      localStorage.removeItem('battleStatus');

      window.location.href = '#';
    }

    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card m-2">
              <div className='container text-center'>
                <img src={this.state.opponent.leader.leaderPic} className="small-img" alt={`${this.state.opponent.leader.leaderName} Picture`} />
              </div>
              <div className="card-body">
                <h5 className="card-title">{this.state.opponent.leader.leaderName}</h5>
                <p className="card-text">{`Pokemon: ${this.state.opponent.pkmn.pkmnName}`}</p>
                <img src={this.state.opponent.pkmn.sprite} className='pkmn-leader-img img-thumbnail' alt={this.state.opponent.pkmn.pkmnName} />
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item text-bg-success">Physical Move: {this.state.opponent.pkmn.physicalMove}</li>
                <li className="list-group-item text-bg-danger">Special Move: {this.state.opponent.pkmn.specialMove}</li>
                <li className="list-group-item text-bg-warning">Status Move: {this.state.opponent.pkmn.statusMove}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card m-2">
              <div className="card-body text-center">
                <img src={this.state.user.pkmn.sprite} className="small-img" alt={`${this.state.user.pkmn.pkmnName} Picture`} />
                <p className="card-title">Your Pok&eacute;mon: <strong>{this.state.user.pkmn.pkmnName}</strong></p>
                <div className="btn-group btn-group-lg" role="group" aria-label="Basic mixed styles example">
                  <button type="button" className="btn btn-success" onClick={this.onMoveSelectHandler}>Physical: {this.state.user.pkmn.physicalMove}</button>
                  <button type="button" className="btn btn-danger" onClick={this.onMoveSelectHandler}>Special: {this.state.user.pkmn.specialMove}</button>
                  <button type="button" className="btn btn-warning" onClick={this.onMoveSelectHandler}>Status: {this.state.user.pkmn.statusMove}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="battleResult" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="battleResultLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="battleResultLabel">Modal title</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                Battle result: {this.state.battleResult}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                {(this.state.battleResult === 'tie') ? <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Try Again</button> : <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={this.returnHomeHandler}>Home</button>}
              </div>
            </div>
          </div>
        </div>
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div id="battleInProgress" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Warning!</strong>
              <small>Battle Issue</small>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" />
            </div>
            <div className="toast-body">
              Battle has not yet concluded, please wait.
            </div>
          </div>
        </div>
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div id="battleCompleted" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Warning!</strong>
              <small>Battle Issue</small>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" />
            </div>
            <div className="toast-body">
              Battle has already completed, please return to Home.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Battles.contextType = AppContext;
