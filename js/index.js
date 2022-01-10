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

  const _getAlbumsFromArtist = async (token, artistId) => {
    const result = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await result.json();
    return data.items;
  };

  const _getTopSongsFromArtist = async (token, artistId) => {
    const result = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await result.json();
    return data;
  };

  return {
    getToken() {
      return _getToken();
    },

    getArtist(token, artistName) {
      return _getArtist(token, artistName);
    },

    getAlbumsFromArtist(token, artistId) {
      return _getAlbumsFromArtist(token, artistId);
    },

    getTopSongsFromArtist(token, artistId) {
      return _getTopSongsFromArtist(token, artistId);
    },
  };
})();

const UIController = (function () {
  const DOMElements = {
    textfield: "#search_input",
    album_button: "#album_button",
    top_buttom: "#top_button",
    table_container: "#table_container",
  };

  return {

    createAlbumItem(data,index){
        let item = `
            <tr>
                <td>${data[index].name}</td>
                <td>${data[index].release_date}</td>
                <td>${data[index].total_tracks}</td>
                <td><a href="${data[index].href}">Escuchar</a></td>
            </tr>
        `;
        return item;
    },

    createAlbumTable() {
      const container = document.getElementById(DOMElements.table_container);
      const html = `
        <table id="tabla">
            <thead>
                <tr>
                    <th>Titulo</th>
                    <th>Fecha de publicacion</th>
                    <th>Total de canciones</th>
                    <th>Escuchar</th>
                </tr>
            </thead>    
        `;
    },
  };
})();

mostrarCosita = async () => {
  const token = await ApiControl.getToken();
  //const nombre = "Pink Floyd";
  const tf = document.getElementById("search_input");
  let nombre = tf.value;
  const artista = await ApiControl.getArtist(token, nombre);
  const artistID = artista.id;
  const albumes = await ApiControl.getAlbumsFromArtist(token, artistID);
  const topSongs = await ApiControl.getTopSongsFromArtist(token, artistID);
  console.log(albumes);
};

 Mostrar_albumes = async () => {
    const token = await ApiControl.getToken();
    const tf = document.getElementById("search_input");
    const element = document.createElement("div");
    let nombre = tf.value;
    const div = document.getElementById("table_container");
    const artist = await ApiControl.getArtist(token, nombre);
    const id = artist.id;
    const albumes = await ApiControl.getAlbumsFromArtist(token, id);
    //creamos la tabla
    let htmlTabla = `
        <table id="tabla" class="w-full border-collapse border">
            <thead>
                <tr class="bg-grey-100 border">
                    <th class="text-left">Numero</th>
                    <th class="text-left">Titulo</th>
                    <th class="text-left">Fecha de publicacion</th>
                    <th class="text-left">Total de canciones</th>
                    <th class="text-left">Escuchar</th>
                </tr>
            </thead>
            <tbody>    
        `;
    albumes.forEach((element,index) => {
        htmlTabla += `
        <tr>
            <td class="text-white">${index+1}</td>
            <td class="text-white">${element.name}</td>
            <td class="text-white">${element.release_date}</td>
            <td class="text-white">${element.total_tracks}</td>
            <td class="text-white"><a href="${element.external_urls.spotify}" target="_blank">Escuchar</a></td>
        </tr>
        `
    });
    htmlTabla += `</tbody></table>`;
    element.innerHTML = htmlTabla;
    div.appendChild(element);
}
