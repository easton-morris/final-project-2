import React from 'react';

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
      }
    };

    this.onMoveSelectHandler = this.onMoveSelectHandler.bind(this);
  }

  componentDidMount() {
    const route = parseRoute(window.location.hash);
    const incParams = route.params;
    const newParams = {};
    for (const [item, value] of incParams.entries()) {
      newParams[`${item}`] = value;
    }

    fetch(`/api/pkmn-list/${newParams.userPkmn}`)
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

    fetch(`/api/pkmn-list/${newParams.leaderPkmn}`)
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

    fetch(`/api/leader-list/${newParams.leaderId}`)
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
      }
    });
  }

  onMoveSelectHandler(event) {
    if (event.target.className === 'btn btn-success') {
      alert(event.target.textContent);
    } else if (event.target.className === 'btn btn-danger') {
      alert(event.target.textContent);
    } else if (event.target.className === 'btn btn-warning') {
      alert(event.target.textContent);
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
      </div>
    );
  }
}
