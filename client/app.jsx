import React from 'react';
import Home from './pages/home';
import NavBar from './components/navbar';
import PokePicker from './components/poke-picker';
import GymLeaders from './pages/gym-leaders';
import Battles from './pages/battles';
import NotFound from './pages/not-found';

import { parseRoute } from './lib';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
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
    return <NotFound />;
  }

  render() {
    return (
      <>
        <NavBar />
        <PokePicker />
        {this.renderPage()}
      </>
    );
  }
}
