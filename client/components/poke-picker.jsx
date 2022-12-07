import React from 'react';
import AppContext from '../lib/app-context';

// Import custom CSS
import '../scss/styles.scss';

// Import all of Bootstrap's JS
// eslint-disable-next-line
import * as bootstrap from 'bootstrap';

export default class PokePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pkmnList: [],
      displayPkmn: {
        dexNumber: 1,
        physicalMove: 'Tackle',
        pkmnName: 'Bulbasaur',
        pokemonId: 1,
        specialMove: 'Hidden Power',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        statusMove: 'Growl'
      },
      pkmnNameList: [],
      userPkmn: {}
    };

    this.buildLists = this.buildLists.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.choosePkmnHandler = this.choosePkmnHandler.bind(this);
  }

  componentDidMount() {
    const currUserPkmn = JSON.parse(window.localStorage.getItem('currentUserPkmn'));
    if (currUserPkmn) {
      this.setState({
        userPkmn: currUserPkmn,
        displayPkmn: currUserPkmn
      });
    }
    this.buildLists();
  }

  choosePkmnHandler(event) {
    const currUser = JSON.parse(window.localStorage.getItem('currentUser'));
    if (this.state.displayPkmn.pkmnName !== this.state.userPkmn.pkmnName) {
      this.setState({
        userPkmn: this.state.displayPkmn
      });

      const newPkmn = this.state.displayPkmn;

      if (currUser) {
        fetch(`/api/user-pkmn/${currUser.user.userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': currUser.token
          },
          body: JSON.stringify({
            pokemon: newPkmn.pokemonId
          })
        })
          .then(res => {
            if (!res.ok) {
              throw new Error('Something went wrong.');
            } else {
              this.context.getUserPkmnInfo();
              return res.json();
            }
          })
          .catch(err => console.error(err));
      }

      const pokeSuccessToast = document.getElementById('pokeSuccess');
      const toast = new bootstrap.Toast(pokeSuccessToast);

      toast.show();
    } else if (this.state.displayPkmn.pkmnName === this.state.userPkmn.pkmnName) {
      const pokeDupeToast = document.getElementById('pokeDupe');
      const toast = new bootstrap.Toast(pokeDupeToast);

      toast.show();
    }

    event.preventDefault();
  }

  buildLists() {
    fetch('/api/pkmn-list/all')
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong.');
        } else {
          return res.json();
        }
      })
      .then(listOfPkmn => {

        const newList = listOfPkmn.map((item, index) => {
          return <option key={index} value={item.pkmnName} />;
        });
        this.setState({
          pkmnList: listOfPkmn,
          pkmnNameList: newList
        });
      })
      .catch(err => console.error(err));
  }

  searchHandler(event) {
    const $pokeSearch = document.getElementById('pkmnListSearch');
    const rawValue = $pokeSearch.value.replaceAll(' ', '');
    let newPoke = {};
    if ($pokeSearch.value !== '' && rawValue !== '') {
      newPoke = this.state.pkmnList.find(element => (element.pkmnName === $pokeSearch.value));
      this.setState({
        displayPkmn: newPoke
      });
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="modal fade" id="pokePicker" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="pokePickerLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="pokePickerLabel">Pick your Pok&eacute;mon</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              <div />
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <input id='pkmnListSearch' type="text" className="form-control" list='pkmnNameList' placeholder="Search Pok&eacute;mon by name..." aria-label="Search Pok&eacute;mon by name..." aria-describedby="search-addon2"/>
                <button className="btn btn-outline-secondary" type="button" id="search-addon2" onClick={this.searchHandler}>Search</button>
                <datalist id='pkmnNameList'>{this.state.pkmnNameList}</datalist>
              </div>
              <div className="card">
                <img src={this.state.displayPkmn.sprite} className="card-img-top" alt={`${this.state.displayPkmn.pkmnName} Picture`} />
                <div className="card-body">
                  <h5 className="card-title">{this.state.displayPkmn.pkmnName}</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Move Type</th>
                        <th scope="col">Move Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="table-success">
                        <th scope="row">Physical</th>
                        <td>{this.state.displayPkmn.physicalMove}</td>
                      </tr>
                      <tr className="table-danger">
                        <th scope="row">Special</th>
                        <td>{this.state.displayPkmn.specialMove}</td>
                      </tr>
                      <tr className="table-warning">
                        <th scope="row">Status</th>
                        <td>{this.state.displayPkmn.statusMove}</td>
                      </tr>
                    </tbody>
                  </table>
                  <a className="btn btn-primary float-end" onClick={this.choosePkmnHandler}>Choose this Pok&eacute;mon</a>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div id="pokeDupe" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Warning!</strong>
              <small>Pok&eacute;Picker Issue</small>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"/>
            </div>
            <div className="toast-body">
              You already picked this Pok&eacute;mon!
            </div>
          </div>
        </div>
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div id="pokeSuccess" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Congratulations!</strong>
              <small>Pok&eacute;Picker Issue</small>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" />
            </div>
            <div className="toast-body">
              You have picked {this.state.displayPkmn.pkmnName}!
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PokePicker.contextType = AppContext;
