const pkmnArr = [];

for (let ii = 1; ii <= 905; ii++) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${ii}/`)
    .then(res => {
      if (!res.ok) {
        throw Error(`failed to retrieve pokemon ${ii}`);
      } else {
        return res.json();
      }
    })
    .then(pkmn => {
      const moveset = {
        physical: null,
        special: null,
        status: null
      };

      for (let jj = 0; jj < pkmn.moves.length; jj++) {
        fetch(`${pkmn.moves[jj].move.url}`)
          .then(res => {
            if (!res.ok) {
              throw Error(`failed to retrieve move ${jj}`);
            } else {
              return res.json();
            }
          })
          .then(move => {
            let moveName = '';
            if (move.damage_class.name === 'physical' && moveset.physical === null) {
              moveName = pkmn.moves[jj].move.name;
              moveName.replace();
              moveset.physical = moveName;
            } else if (move.damage_class.name === 'special' && moveset.special === null) {
              moveset.special = moveName;
            } else if (move.damage_class.name === 'status' && moveset.status === null) {
              moveset.status = moveName;
            }
          })
          .catch(err => console.error(err));
      }
      if (moveset.physical === null) {
        moveset.physical = 'tackle';
      }
      if (moveset.special === null) {
        moveset.special = 'Hidden Power';
      }
      if (moveset.status === null) {
        moveset.status = 'Growl';
      }
      const newPkmn = {
        name: pkmn.name,
        id: pkmn.id,
        moves: moveset
      };
      pkmnArr.push(newPkmn);
    })
    .catch(err => console.error(err));
}
