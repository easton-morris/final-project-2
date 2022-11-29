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
      userPkmn: null
    };

    this.getUserPkmnInfo = this.getUserPkmnInfo.bind(this);
  }

  getUserPkmnInfo() {
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));
    if (currUser && this.state.userPkmn === null) {
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
            userPkmn: pkmnInfo
          });
        })
        .catch(err => console.error(err));
    } else if (!currUser && this.state.userPkmn !== null) {
      this.setState({
        userPkmn: null
      });
    }
  }

  componentDidMount() {
    this.getUserPkmnInfo();

    window.addEventListener('hashchange', () => {
      this.setState(prevState => (
        { route: parseRoute(window.location.hash) }
      ));
    });
  }

  componentDidUpdate() {
    this.getUserPkmnInfo();
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
    const { userPkmn } = this.state;
    const contextVal = { userPkmn };
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
