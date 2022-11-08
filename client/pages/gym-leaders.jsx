import React from 'react';

// Import custom CSS
import '../scss/styles.scss';

// Import all of Bootstrap's JS
// eslint-disable-next-line
import * as bootstrap from 'bootstrap';

export default class GymLeaders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leadersList: []
    };

    this.LeaderCard = this.LeaderCard.bind(this);
    this.GymLeaderList = this.GymLeaderList.bind(this);
  }

  componentDidMount() {

    fetch('/api/leader-list/all')
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
      return <this.LeaderCard key={leader.leaderId} leaderName={leader.leaderName} leaderPic={leader.leaderPic} leaderPkmn={leader.leaderPkmn} />;
    });

    return (
      listItems
    );
  }

  LeaderCard(props) {

    const { leaderName, leaderPic, leaderPkmn } = props;

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
            <a href="#" className="btn btn-primary">Battle</a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.leadersList.length > 0) {
      return (
        <div className='container m-4'>
          <div className='row g-4'>
            <this.GymLeaderList />
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
