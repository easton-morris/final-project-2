import React from 'react';
import AppContext from '../lib/app-context';

// Import custom CSS
import '../scss/styles.scss';

// Import all of Bootstrap's JS
// eslint-disable-next-line
import * as bootstrap from 'bootstrap';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.loginClickHandler = this.loginClickHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);

  }

  loginClickHandler(event) {
    window.location.href = '#sign-in';

    event.preventDefault();
  }

  logoutHandler(event) {
    window.localStorage.removeItem('currentUser');
    window.localStorage.removeItem('battleHistory');
    window.localStorage.removeItem('currentUserPkmn');
    window.localStorage.removeItem('currentBattle');
    this.context.resetUserState();
    window.location.href = '#';

    event.preventDefault();
  }

  render() {
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));
    const currUserPkmn = JSON.parse(window.localStorage.getItem('currentUserPkmn'));
    return (
      <nav className = 'navbar navbar-expand-lg bg-light' >
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>Gym Battle</a>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon' />
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <a className='nav-link active' aria-current='page' href='#'>Home</a>
              </li>
              <li className='nav-item'>
                <a className={currUser ? 'nav-link active' : 'nav-link disabled'} href='#' data-bs-toggle="modal" data-bs-target="#pokePicker">Choose Pok&eacute;mon</a>
              </li>
              <li className='nav-item dropdown'>
                <a className={currUser ? 'nav-link dropdown-toggle active' : 'nav-link dropdown-toggle disabled'} href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                  Actions
                </a>
                <ul className='dropdown-menu'>
                  <li><a className='dropdown-item' href='#gym-leaders'>Gym Leaders</a></li>
                  <li><a className='dropdown-item' href='#'>Battle User (coming soon)</a></li>
                </ul>
              </li>
              <li className='nav-item'>
                <a className={currUser ? 'nav-link active' : 'nav-link disabled'} role='button' onClick={this.logoutHandler}>Logout</a>
              </li>
            </ul>
            {(!currUser)
              ? <button className="btn btn-outline-primary d-flex justify-content-center" aria-label='Profile Button' onClick={this.loginClickHandler} >
                <i className="bi bi-person-circle" aria-hidden="true" />
                <p className='login-btn'>Login</p>
              </button>
              : <img className='user-pkmn-badge rounded-circle img-thumbnail' src={currUserPkmn ? currUserPkmn.sprite : ''} alt="User's Pokemon" />
              }
          </div>
        </div>
      </nav>
    );
  }
}

NavBar.contextType = AppContext;
