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

    this.getUserInfo = this.getUserInfo.bind(this);
  }

  getUserInfo() {
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));
    if (currUser && this.state.user !== currUser) {
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
          return this.setState({
            userPkmnInfo: pkmnInfo,
            user: currUser
          });
        })
        .catch(err => console.error(err));
    } else if (!currUser && this.state.userPkmnInfo !== null) {
      this.setState({
        userPkmnInfo: null,
        user: null
      });
    }
  }

  componentDidMount() {
    this.getUserInfo();

    window.addEventListener('hashchange', () => {
      this.setState(prevState => (
        { route: parseRoute(window.location.hash) }
      ));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.getUserInfo();
    }
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
    const { getUserInfo } = this;
    const { userPkmnInfo, user } = this.state;
    const contextVal = { userPkmnInfo, user, getUserInfo };
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
