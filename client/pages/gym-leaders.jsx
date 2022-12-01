import React from 'react';
import AppContext from '../lib/app-context';

// Import custom CSS
import '../scss/styles.scss';

// Import all of Bootstrap's JS
// eslint-disable-next-line
import * as bootstrap from 'bootstrap';

export default class GymLeaders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leadersList: [],
      selectedLeader: {}
    };

    this.LeaderCard = this.LeaderCard.bind(this);
    this.GymLeaderList = this.GymLeaderList.bind(this);
    this.battleHandler = this.battleHandler.bind(this);
    this.leaderSelectHandler = this.leaderSelectHandler.bind(this);
  }

  componentDidMount() {
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));

    fetch('/api/leader-list/all', {
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
      .then(list => {
        this.setState({
          leadersList: list
        });
      })
      .catch(err => console.error(err));
  }

  GymLeaderList() {
    const gymLeaderList = this.state.leadersList;
    const listItems = gymLeaderList.map(leader => {
      return <this.LeaderCard key={leader.leaderId} leaderId={leader.leaderId} leaderName={leader.leaderName} leaderPic={leader.leaderPic} leaderPkmn={leader.leaderPkmn} />;
    });

    return (
      listItems
    );
  }

  LeaderCard(props) {

    const { leaderName, leaderPic, leaderPkmn, leaderId } = props;

    return (
      <div className='col-md-4'>
        <div className="card">
          <div className='container text-center'>
            <img src={leaderPic} className="" alt={`${leaderName} Picture`} />
          </div>
          <div className="card-body">
            <h5 className="card-title">{leaderName}</h5>
            <p className="card-text">{`Pokemon: ${leaderPkmn.pkmnName}`}</p>
            <img src={leaderPkmn.sprite} className='pkmn-leader-img img-thumbnail' alt={leaderPkmn.pkmnName} />
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item text-bg-success">Physical Move: {leaderPkmn.physicalMove}</li>
            <li className="list-group-item text-bg-danger">Special Move: {leaderPkmn.specialMove}</li>
            <li className="list-group-item text-bg-warning">Status Move: {leaderPkmn.statusMove}</li>
          </ul>
          <div className="card-footer">
            <a type='button' className="btn btn-primary" data-leader-id={leaderId} data-bs-toggle="modal" data-bs-target="#battleConfirm" onClick={this.leaderSelectHandler}>Battle</a>
          </div>
        </div>
      </div>
    );
  }

  leaderSelectHandler(event) {
    const compareInt = parseInt(event.target.dataset.leaderId, 10);
    const newLeader = this.state.leadersList.find(element => {
      return (element.leaderId === compareInt);
    });

    this.setState({
      selectedLeader: newLeader
    });

    event.preventDefault();
  }

  battleHandler(event) {
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));

    let recordId;
    const battleData = {
      userId: currUser.user.userId,
      userPkmn: currUser.user.userPkmn,
      leaderPkmn: this.state.selectedLeader.leaderPkmn.pokemonId,
      leaderName: this.state.selectedLeader.leaderName
    };

    fetch('/api/battles/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': currUser.token
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
      .then(data => {
        recordId = data.recordId;
        window.location.href = `#battle?recordId=${recordId}`;
      })
      .catch(err => console.error(err));

    event.preventDefault();
  }

  render() {
    if (this.state.leadersList.length > 0) {
      return (
        <div className='container m-4'>
          <div className='row g-4'>
            <this.GymLeaderList />
          </div>
          <div className="modal fade" id="battleConfirm" tabIndex="-1" aria-labelledby="battleConfirmLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="battleConfirmLabel">Confirm Battle</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                  Are you ready to battle {this.state.selectedLeader.leaderName}?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={this.battleHandler}>Let&apos;s go!</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      );
    } else {
      return (
        <div>
          <h1>Oops! Cannot find any Gym Leaders to battle...</h1>
        </div>
      );
    }
  }
}

GymLeaders.contextType = AppContext;
