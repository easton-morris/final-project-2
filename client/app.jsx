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
      user: null
    };

    this.getUserPkmnInfo = this.getUserPkmnInfo.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getUserBattleInfo = this.getUserBattleInfo.bind(this);
    this.resetUserState = this.resetUserState.bind(this);
  }

  resetUserState() {
    this.setState({
      userPkmnInfo: null,
      user: null
    });
  }

  getUserPkmnInfo() {
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));
    if (currUser) {
      fetch(`/api/pkmn-list/${currUser.user.userPkmn}`, {
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
    } else if (!currUser && this.state.userPkmnInfo !== null) {
      window.localStorage.removeItem('currentUserPkmn');
      this.setState({
        userPkmnInfo: null
      });
    }
  }

  getUserInfo(updatedValue) {
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
          if (userInfo[updatedValue] !== currUser[updatedValue]) {
            const newUserInfo = currUser;
            newUserInfo.user[updatedValue] = userInfo[updatedValue];
            // currUser = { ...currUser, user: { ...currUserData, : userInfo[updatedValue] } };

            window.localStorage.setItem('currentUser', JSON.stringify(newUserInfo));

            return this.setState({
              user: currUser
            });
          }
        })
        .catch(err => console.error(err));
    } else if (!currUser && this.state.user !== null) {
      window.localStorage.removeItem('currentUserPkmn');
      this.setState({
        user: null
      });
    }
  }

  getUserBattleInfo() {

  }

  componentDidMount() {
    this.getUserInfo();
    this.getUserPkmnInfo();
    this.getUserBattleInfo();

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
    const { getUserPkmnInfo, getUserInfo, getUserBattleInfo, resetUserState } = this;
    const { userPkmnInfo, user } = this.state;
    const contextVal = { userPkmnInfo, user, getUserPkmnInfo, getUserInfo, getUserBattleInfo, resetUserState };
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
