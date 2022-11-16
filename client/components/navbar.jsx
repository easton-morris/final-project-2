import React from 'react';

// Import custom CSS
import '../scss/styles.scss';

// Import all of Bootstrap's JS
// eslint-disable-next-line
import * as bootstrap from 'bootstrap';

export default function NavBar(props) {
  return (
    <nav className='navbar navbar-expand-lg bg-light'>
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
              <a className='nav-link' href='#' data-bs-toggle="modal" data-bs-target="#pokePicker">Choose Pok&eacute;mon</a>
            </li>
            <li className='nav-item dropdown'>
              <a className='nav-link dropdown-toggle' href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                Dropdown
              </a>
              <ul className='dropdown-menu'>
                <li><a className='dropdown-item' href='#gym-leaders'>Gym Leaders</a></li>
                <li><a className='dropdown-item' href='#'>Battle User (coming soon)</a></li>
                <li><hr className='dropdown-divider'/></li>
                <li><a className='dropdown-item' href='#'>Something else here</a></li>
              </ul>
            </li>
            <li className='nav-item'>
              <a className='nav-link disabled'>Disabled</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
