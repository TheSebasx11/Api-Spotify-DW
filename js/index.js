const ApiControl = (function () {
  const clientId = "ea0c085fe8f84a52aa667afac309890c";
  const clientSecret = "c4612bbc3f1d47c494918d3264e991a8";

  // private methods
  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
  };

  const _getArtist = async (token, artistName) => {
    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=1`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const data = await result.json();
    return data.artists.items[0];
  };

  const _getAlbumsFromArtist = async (token, artistId) =>{
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`,
    {
        method: 'GET',
        headers:{
            Authorization: "Bearer " + token 
        }
    }
    );
    const data = await result.json();
    return data.items;
  }

  const _getTopSongsFromArtist = async (token, artistId) =>{
    const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
    {
        method: 'GET',
        headers:{
            Authorization: "Bearer " + token 
        }
    }
    );
    const data = await result.json();
    return data;
  }

  return {
    getToken() {
      return _getToken();
    },

    getArtist(token, artistName) {
      return _getArtist(token, artistName);
    },

    getAlbumsFromArtist(token, artistId){
        return _getAlbumsFromArtist(token, artistId);
    },

    getTopSongsFromArtist(token, artistId){
        return _getTopSongsFromArtist(token, artistId);
    }
  };
})();

const UIController = (function (){
    
})

mostrarCosita = async () => {
  const token = await ApiControl.getToken();
  const nombre = "Pink Floyd";
  const artista = await ApiControl.getArtist(token, nombre);
  const artistID = artista.id;
  const albumes = await ApiControl.getAlbumsFromArtist(token, artistID);
  const topSongs = await ApiControl.getTopSongsFromArtist(token, artistID);
  console.log(topSongs);
};
