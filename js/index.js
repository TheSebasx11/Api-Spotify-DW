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
      `https://api.spotify.com/v1/artists/${artistId}/albums?limit=40`,
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
    return data.tracks;
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

Mostrar = async () => {
  const token = await ApiControl.getToken();
  //const nombre = "Pink Floyd";
  const tf = document.getElementById("search_input");
  let nombre = tf.value;
  const artista = await ApiControl.getArtist(token, nombre);
  const artistID = artista.id;
  const albumes = await ApiControl.getAlbumsFromArtist(token, artistID);
  const topSongs = await ApiControl.getTopSongsFromArtist(token, artistID);
  console.log(artista);
};

Mostrar_albumes = async () => {
  const token = await ApiControl.getToken();
  const tf = document.getElementById("search_input");
  const element = document.createElement("div");
  let nombre = tf.value;
  const divApp = document.getElementById("table_container");
  const artist = await ApiControl.getArtist(token, nombre);
  const id = artist.id;
  const albumes = await ApiControl.getAlbumsFromArtist(token, id);
  //creamos la tabla
  let htmlTabla = `
        <table id="tabla" class="w-full border-collapse border">
            <thead>
                <tr class="border">
                    <th class="text-left text-white border p-2 bg-[#024532]">Numero</th>
                    <th class="text-left text-white border p-2 bg-[#024532]">Titulo</th>
                    <th class="text-left text-white border p-2 bg-[#024532]">Fecha de publicacion</th>
                    <th class="text-left text-white border p-2 bg-[#024532]">Total de canciones</th>
                    <th class="text-left text-white border p-2 bg-[#024532]">Escuchar</th>
                </tr>
            </thead>
            <tbody>    
        `;
  albumes.forEach((element, index) => {
    htmlTabla += `
        <tr>
            <td class="text-white border p-2 ">${index + 1}</td>
            <td class="text-white border p-2">${element.name}</td>
            <td class="text-white border p-2">${element.release_date}</td>
            <td class="text-white border p-2">${element.total_tracks}</td>
            <td class="text-white border p-2"><a href="${
              element.external_urls.spotify
            }" target="_blank" class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: #000 transform: ;msFilter:;" class=" hover:scale-125 duration-150 hover:fill-white"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="m9 17 8-5-8-5z"></path>
            </svg>
            </a>
            </td>
        </tr>
        `;
  });
  htmlTabla += `</tbody></table>`;
  element.innerHTML = htmlTabla;
  if (divApp.childElementCount >= 1) {
    divApp.innerHTML = "";
  }
  divApp.appendChild(element);
};

function milistomins(ms) {
  (min = Math.floor((ms / 1000 / 60) << 0)),
    (sec = Math.floor((ms / 1000) % 60));
  minS = min < 10 ? `0${min}` : `${min}`;
  secS = sec < 10 ? `${sec}0` : `${sec}`;
  return `${minS}:${secS}`;
}

Mostrar_top = async () => {
  const token = await ApiControl.getToken();
  const tf = document.getElementById("search_input");
  const element = document.createElement("div");
  let nombre = tf.value;
  const divApp = document.getElementById("table_container");
  const artist = await ApiControl.getArtist(token, nombre);
  const id = artist.id;
  const topSongs = await ApiControl.getTopSongsFromArtist(token, id);

  let htmlTabla = `
  <table id="tabla2" class="w-full border-collapse border">
        <thead>
            <tr class="bg-grey-100 border">
                <th class="text-left text-white border p-2 bg-[#024532]">Numero</th>
                <th class="text-left text-white border p-2 bg-[#024532]">Titulo</th>
                <th class="text-left text-white border p-2 bg-[#024532]">Duracion</th>
                <th class="text-left text-white border p-2 bg-[#024532]">Album</th>
                <th class="text-left text-white border p-2 bg-[#024532]">Colaborador</th>
                <th class="text-left text-white border p-2 bg-[#024532]">Escuchar</th>
            </tr>
        </thead>
    <tbody>  
  `;
  colab = ``;
  topSongs.forEach((element, index) => {
    element.artists.forEach((element2, index) => {
      if (index != element.artists.length - 1) {
        colab += `${element2.name}, `;
      }else{
        colab += `${element2.name}`;
      }
    });
    htmlTabla += `
    <tr class="h-15 ">
        <td class="text-white border p-2">${index + 1}</td>
        <td class="text-white border p-2">${element.name}</td>
        <td class="text-white border p-2">${milistomins(
          element.duration_ms
        )}</td>
        <td class="text-white border p-2">${element.album.name}</td>
        <td class="text-white border p-2">${colab}</td>
        <td class="text-white border p-2">
            <a href="${element.external_urls.spotify}" target="_blank" class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: #000 transform: ;msFilter:;" class="hover:scale-125 duration-150 hover:fill-white"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="m9 17 8-5-8-5z"></path>
            </svg>
            </a>
        </td>
    </tr>
`;
    colab = ``;
  });
  htmlTabla += `</tbody></table>`;
  element.innerHTML = htmlTabla;
  if (divApp.childElementCount >= 1) {
    divApp.innerHTML = "";
  }
  divApp.appendChild(element);
};

Mostrar_Artista = async ()=> {
  const token = await ApiControl.getToken();
  const tf = document.getElementById("search_input");
  const element = document.createElement("div");
  let nombre = tf.value;
  const divApp = document.getElementById("table_container");
  const artist = await ApiControl.getArtist(token, nombre);
  let genre = ``;
  artist.genres.forEach((element,index)=>{
    if(index != artist.genres.length - 1) {
      genre += `${element}, `;
    }else{
      genre += `${element}`;
    }
  });
  let html = `<div class="">
    <div class="flex items-center justify-center pt-2"><img class="h-80" src="${artist.images[0].url}"></div>
    <div class="flex items-center justify-center text-2xl"><p class="text-white font-bold pt-2">Nombre: <span class="font-extralight">${artist.name}</span></p></div>
    <div class="flex items-center justify-center text-2xl"><p class="text-white font-bold">Nro de seguidores: <span class="font-extralight">${artist.followers.total}</span></p></div>
    <div class="flex items-center justify-center text-2xl"><p class="text-white font-bold">Genero(s): <span class="font-extralight">${genre}</span></p></div>
    <div class="h-12 text-white font-bold flex items-center justify-center text-2xl">Ir a escuchar : <a href=" ${artist.external_urls.spotify}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" style="fill: #000 transform: ;msFilter:;" class="hover:scale-125 duration-150 hover:fill-white mt-1"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="m9 17 8-5-8-5z"></path>
    </svg></a></div>
  </div>`;
  element.innerHTML=html;
  if (divApp.childElementCount >= 1) {
    divApp.innerHTML = "";
  }
  divApp.appendChild(element);
};