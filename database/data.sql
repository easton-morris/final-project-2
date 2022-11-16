INSERT INTO pokemon ("statusMove", "physicalMove", "specialMove", "dexNumber", "pkmnName", "sprite") VALUES
  ('Growl', 'Tackle', 'Hidden Power', 1, 'Bulbasaur', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'),
  ('Growl', 'Tackle', 'Hidden Power', 4, 'Charmander', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'),
  ('Growl', 'Tackle', 'Hidden Power', 5, 'Squirtle', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png');

INSERT INTO leaders ("leaderName", "leaderPic", "leaderPkmn") VALUES
  ('Brock', 'https://static.wikia.nocookie.net/pokemon/images/1/13/Brock_Let%27s_Go%2C_Pikachu%21_and_Let%27s_Go%2C_Eevee%21.png', 1),
  ('Misty', 'https://static.wikia.nocookie.net/pokemon/images/2/25/Misty_Let%27s_Go%2C_Pikachu%21_and_Let%27s_Go%2C_Eevee%21.png', 2),
  ('Lt. Surge', 'https://static.wikia.nocookie.net/pokemon/images/1/16/Lt._Surge_Let%27s_Go%2C_Pikachu%21_and_Let%27s_Go%2C_Eevee%21.png', 3);

INSERT INTO users ("username", "password", "email") VALUES
  ('admin', 'GottaCatchEmAll', 'bob@example.co');
