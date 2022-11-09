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
      opponent: {
        pkmn: 1
      }
    };
  }

  componentDidMount() {
    const route = parseRoute(window.location.hash);
    const newParams = route.params;

    const pkmnData = {};

    fetch(`/api/pkmn-list/${newParams.userPkmn}`)
      .then();

    this.setState({
      pkmn: pkmnData,
      leaderId: 0,
      leaderName: '',
      leaderPkmn: {}
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className='container text-center'>
                <img src="" className="" alt={`${this.state.leaderName} Picture`} />
              </div>
              <div className="card-body">
                <h5 className="card-title">{this.state.leaderPkmn.pkmnName}</h5>
                <p className="card-text">{`Pokemon: ${this.state.leaderPkmn.pkmnName}`}</p>
                <img src={this.state.leaderPkmn.sprite} className='pkmn-leader-img img-thumbnail' alt={this.state.leaderPkmn.pkmnName} />
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item text-bg-success">Physical Move: {this.state.leaderPkmn.physicalMove}</li>
                <li className="list-group-item text-bg-danger">Special Move: {this.state.leaderPkmn.specialMove}</li>
                <li className="list-group-item text-bg-warning">Status Move: {this.state.leaderPkmn.statusMove}</li>
              </ul>
              <div className="card-footer">
                <a type='button' className="btn btn-primary" data-leader-id={this.state.leaderId} data-bs-toggle="modal" data-bs-target="#battleConfirm" onClick={this.leaderSelectHandler}>Battle</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
