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
    let query = function (artistName) {
      const regex = / /i;
      artistName.replace(regex, "%20");
    };
    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
      method: "GET",
      headers: {
        headers: { Authorization: "Bearer " + token },
      },
    });
    const data = await result.json();
    return data.playlists.items;
  };

  return {
    getToken() {
      return _getToken();
    },

    getArtist(token, artistName){
        return _getArtist(token, artistName);
    }

  };
})();

function mostrarCosita() {
  ApiControl.getArtist().then((data)=>{
    const divApp = document.getElementsByClassName("contenedor");
    const element = document.createElement("p");
    let html = `<p>${data.artist}</p>`;
    element.innerHTML = html;
    divApp[0].appendChild(element);
  });
}
