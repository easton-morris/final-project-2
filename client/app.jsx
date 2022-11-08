import React from 'react';
import Home from './pages/home';
import NavBar from './components/navbar';
import PokePicker from './components/poke-picker';

export default class App extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <PokePicker />
        <Home />
      </>
    );
  }
}
