import React from 'react';
import Home from './pages/home';
import NavBar from './components/navbar';
import PokePicker from './components/poke-picker';
import GymLeaders from './pages/gym-leaders';
import Battles from './pages/battles';
import SignIn from './pages/sign-in';
import NotFound from './pages/not-found';

import { parseRoute, AppContext } from './lib';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      userPkmnInfo: null,
      user: null,
      battleHistory: null
    };

    this.getUserPkmnInfo = this.getUserPkmnInfo.bind(this);
    this.getUserBattleInfo = this.getUserBattleInfo.bind(this);
    this.resetUserState = this.resetUserState.bind(this);
  }

  resetUserState() {
    this.setState({
      userPkmnInfo: null,
      user: null,
      battleHistory: null
    });
  }

  getUserPkmnInfo() {
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));
    if (currUser) {
      fetch(`/api/user-list/${currUser.user.userId}`, {
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
        .then(userInfo => {
          fetch(`/api/pkmn-list/${userInfo.userPkmn}`, {
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
            .then(pkmnInfo => {
              window.localStorage.setItem('currentUserPkmn', JSON.stringify(pkmnInfo));
              return this.setState({
                userPkmnInfo: pkmnInfo
              });
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    } else if (!currUser && this.state.userPkmnInfo !== null) {
      window.localStorage.removeItem('currentUserPkmn');
      this.setState({
        userPkmnInfo: null
      });
    }
  }

  getUserBattleInfo() {
    const currBattleHistory = JSON.parse(window.localStorage.getItem('battleHistory'));
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));

    if (currBattleHistory && currUser) {

      fetch(`/api/battles/history/${currUser.user.userId}`, {
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
        .then(records => {
          if (currBattleHistory) {
            window.localStorage.removeItem('battleHistory');
          }
          window.localStorage.setItem('battleHistory', JSON.stringify(records));
        })
        .catch(err => console.error(err));
    }
  }

  componentDidMount() {
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));
    const currBattleHistory = JSON.parse(window.localStorage.getItem('battleHistory'));
    const currUserPkmn = JSON.parse(window.localStorage.getItem('currentUserPkmn'));

    if (currUser) {
      if (!currBattleHistory) {
        this.getUserBattleInfo();
      }
      if (!currUserPkmn) {
        this.getUserPkmnInfo();
      }
      if (!this.state.user) {
        this.setState({
          user: currUser
        });
      }
    } else {
      if (currBattleHistory) {
        window.localStorage.removeItem('battleHistory');
      }
      if (currUserPkmn) {
        window.localStorage.removeItem('currentUserPkmn');
      }
    }

    window.addEventListener('hashchange', () => {
      this.setState(prevState => (
        { route: parseRoute(window.location.hash) }
      ));
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Home />;
    }
    if (route.path === 'gym-leaders') {
      return <GymLeaders />;
    }
    if (route.path === 'battle') {
      return <Battles />;
    }
    if (route.path === 'sign-in') {
      return <SignIn />;
    }
    return <NotFound />;
  }

  render() {
    const { getUserPkmnInfo, getUserBattleInfo, resetUserState } = this;
    const { userPkmnInfo, user } = this.state;
    const contextVal = { userPkmnInfo, user, getUserPkmnInfo, getUserBattleInfo, resetUserState };
    return (
      <AppContext.Provider value={contextVal} >
        <>
          <NavBar />
          <PokePicker />
          {this.renderPage()}
        </>
      </AppContext.Provider>
    );
  }
}
