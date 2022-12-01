import React from 'react';
import { AppContext } from '../lib';

// Import custom CSS
import '../scss/styles.scss';

// Import all of Bootstrap's JS
// eslint-disable-next-line
import * as bootstrap from 'bootstrap';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.signinHandler = this.signinHandler.bind(this);
    this.signupHandler = this.signupHandler.bind(this);
    this.demoSignInHandler = this.demoSignInHandler.bind(this);
  }

  // signs in the demo account with one click //

  demoSignInHandler(event) {
    fetch('/api/users/sign-in', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'GottaCatchEmAll'
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong.');
        } else {
          return res.json();
        }
      })
      .then(response => {
        const currentUserId = response.user.userId;
        const currentUserToken = response.token;

        fetch(`/api/battles/history/${currentUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': currentUserToken
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
            const currBattleHistory = window.localStorage.getItem('battleHistory');
            if (currBattleHistory) {
              window.localStorage.removeItem('battleHistory');
            }
            window.localStorage.setItem('battleHistory', JSON.stringify(records));
          })
          .catch(err => console.error(err));

        const currentUser = window.localStorage.getItem('currentUser');
        if (currentUser) {
          window.localStorage.removeItem('currentUser');
        }
        window.localStorage.setItem('currentUser', JSON.stringify(response));

        this.context.getUserInfo();
        this.context.getUserPkmnInfo();

        window.location.href = '#?user=signin';
      })
      .catch(err => console.error(err));

    event.preventDefault();
  }

  // takes the sign in input values and submits them to the back in and //
  // roues accordingly //

  signinHandler(event) {
    const $username = document.getElementById('inputUNSignin');
    const $password = document.getElementById('inputPWSignin');
    const $signinPWWarn = document.getElementById('signinPWWarn');

    fetch('/api/users/sign-in', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: $username.value,
        password: $password.value
      })
    })
      .then(res => {
        if (res.status === 401) {
          $signinPWWarn.className = 'alert alert-danger d-none';

          $signinPWWarn.className = 'alert alert-danger';
        } else if (res.status === 200) {
          return res.json();
        }
      })
      .then(response => {
        const currentUserId = response.user.userId;
        const currentUserToken = response.token;

        fetch(`/api/battles/history/${currentUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': currentUserToken
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
            const currBattleHistory = window.localStorage.getItem('battleHistory');
            if (currBattleHistory) {
              window.localStorage.removeItem('battleHistory');
            }
            window.localStorage.setItem('battleHistory', JSON.stringify(records));
          })
          .catch(err => console.error(err));

        const currentUser = window.localStorage.getItem('currentUser');
        if (currentUser) {
          window.localStorage.removeItem('currentUser');
        }
        window.localStorage.setItem('currentUser', JSON.stringify(response));

        this.context.getUserInfo();
        this.context.getUserPkmnInfo();

        window.location.href = '#?user=signin';
      })
      .catch(err => console.error(err));

    event.preventDefault();
  }

  // takes the sign up input values and submits them to the backend and updates accordingly //

  signupHandler(event) {
    const $username = document.getElementById('inputUNSignup');
    const $email = document.getElementById('inputEmailSignup');
    const $password = document.getElementById('inputPWSignup');
    const $signupUNWarn = document.getElementById('signupUNWarn');

    fetch('/api/users/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: $username.value,
        email: $email.value,
        password: $password.value
      })
    })
      .then(res => {
        if (res.status === 500) {
          $signupUNWarn.className = 'alert alert-danger';
        } else {
          return res.json();
        }
      })
      .then(newUser => {
        const currentUserId = newUser.user.userId;
        const currentUserToken = newUser.token;

        fetch(`/api/battles/history/${currentUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': currentUserToken
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
            const currBattleHistory = window.localStorage.getItem('battleHistory');
            if (currBattleHistory) {
              window.localStorage.removeItem('battleHistory');
            }
            window.localStorage.setItem('battleHistory', JSON.stringify(records));
          })
          .catch(err => console.error(err));

        const currentUser = window.localStorage.getItem('currentUser');
        if (currentUser) {
          window.localStorage.removeItem('currentUser');
        }
        window.localStorage.setItem('currentUser', JSON.stringify(newUser));

        window.location.href = '#?user=signup';
      })
      .catch(err => console.error(err));

    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <div id="loginArea">
          <h1>
            Please Sign In or Sign Up
          </h1>
          <hr />
          <div>
            <h2>Sign In</h2>
            <form onSubmit={this.signinHandler} id='signin'>
              <div className="mb-3">
                <label htmlFor="inputUNSignin" className="form-label">Username</label>
                <input type="text" className="form-control" id="inputUNSignin" aria-describedby="signinHelp" required />
                <div id="signinHelp" className="form-text">Please enter your username.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="inputPWSignin" className="form-label">Password</label>
                <input type="password" className="form-control" id="inputPWSignin" required />
                <div id="signinPWWarn" className="alert alert-danger d-none">
                  Password or username is incorrect.
                </div>
              </div>
              <button type="submit" form='signin' className="m-2 btn btn-primary">Sign In</button>
              <button onClick={this.demoSignInHandler} className="m-2 btn btn-info">Click Here for Demo Account</button>
            </form>
          </div>
          <hr />
          <div>
            <h2>Sign Up</h2>
            <form onSubmit={this.signupHandler} id='signup'>
              <div className="mb-3">
                <label htmlFor="inputUNSignup" className="form-label">Username</label>
                <input type="text" className="form-control" id="inputUNSignup" aria-describedby="signupHelp" required />
                <div id="signupHelp" className="form-text">Please enter your desired username.</div>
                <div id="signupUNWarn" className="alert alert-danger d-none">
                  Username already exists.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="inputEmailSignup" className="form-label">Email address</label>
                <input type="email" className="form-control" id="inputEmailSignup" aria-describedby="emailHelp" required />
                <div id="emailHelp" className="form-text">We&apos;ll never share your email with anyone else.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="inputPWSignup" className="form-label">Password</label>
                <input type="password" className="form-control" id="inputPWSignup" required />
              </div>
              <button type="submit" form='signup' className="btn btn-primary">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

SignIn.contextType = AppContext;
