const pkmnArr = [];

const ii = 0;

fetch(`https://pokeapi.co/api/v2/pokemon/${ii}/`)
  .then(res => {
    if (!res.ok) {
      throw Error('failed to retrieve pokemon');
    } else {
      return res.json();
    }
  })
  .then(pkmnList => {
    pkmnArr.push(pkmnList[0].name);
  })
  .catch(err => console.error(err));
