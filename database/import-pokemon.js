const pkmnArr = [];

// todo: move the pkmn pull data to an offline file with the objects in an array and then use a setTimeout to slowly deal with the movesets.

// ping the API for each of the 905 pkmn to get their full objs
for (let ii = 1; ii <= 905; ii++) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${ii}/`)
    .then(res => {
      if (!res.ok) {
        throw Error(`failed to retrieve pokemon ${ii}`);
      } else {
        return res.json();
      }
    })
    // build the movesets
    .then(pkmn => {
      const moveset = {
        physical: null,
        special: null,
        status: null
      };

      // get the specific info for the moves
      for (let jj = 0; jj < pkmn.moves.length; jj++) {
        fetch(`${pkmn.moves[jj].move.url}`)
          .then(res => {
            if (!res.ok) {
              throw Error(`failed to retrieve move ${jj}`);
            } else {
              return res.json();
            }
          })
          // check the type of damage the move does to determine if the move should be added to the set (also fix the readability)
          .then(move => {
            let moveName = '';
            if (move.damage_class.name === 'physical' && moveset.physical === null) {
              moveName = pkmn.moves[jj].move.name;
              const hypenRemoved = moveName.replaceAll('-', ' ');
              const moveWords = hypenRemoved.split(' ');
              let finalName = '';
              for (let kk = 0; kk < moveWords.length; kk++) {
                const word = moveWords[kk];
                const uppered = word[0].toLocaleUpperCase('en-US');
                if (kk === 0) {
                  finalName = uppered;
                } else {
                  finalName = finalName + ' ' + uppered;
                }
              }
              moveset.physical = finalName;
            } else if (move.damage_class.name === 'special' && moveset.special === null) {
              moveName = pkmn.moves[jj].move.name;
              const hypenRemoved = moveName.replaceAll('-', ' ');
              const moveWords = hypenRemoved.split(' ');
              let finalName = '';
              for (let kk = 0; kk < moveWords.length; kk++) {
                const word = moveWords[kk];
                const uppered = word[0].toLocaleUpperCase('en-US');
                if (kk === 0) {
                  finalName = uppered;
                } else {
                  finalName = finalName + ' ' + uppered;
                }
              }
              moveset.special = finalName;
            } else if (move.damage_class.name === 'status' && moveset.status === null) {
              moveName = pkmn.moves[jj].move.name;
              const hypenRemoved = moveName.replaceAll('-', ' ');
              const moveWords = hypenRemoved.split(' ');
              let finalName = '';
              for (let kk = 0; kk < moveWords.length; kk++) {
                const word = moveWords[kk];
                const uppered = word[0].toLocaleUpperCase('en-US');
                if (kk === 0) {
                  finalName = uppered;
                } else {
                  finalName = finalName + ' ' + uppered;
                }
              }
              moveset.status = finalName;
            }
          })
          .catch(err => console.error(err));
      }
      // if the pkmn doesnt have a move that matches the damage type, slot in a placeholder
      if (moveset.physical === null) {
        moveset.physical = 'Tackle';
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
      // add the pokemon with their id, name, and movesets to the array for the DB
      pkmnArr.push(newPkmn);
    })
    .catch(err => console.error(err));
}

// eslint-disable-next-line
console.log(pkmnArr);
