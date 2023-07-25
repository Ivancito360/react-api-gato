import React, { Fragment, useEffect, useState } from 'react';
import './App.css';

const API_URL = "https://api.thecatapi.com/v1/images/search?limit=12";

function Gato({ item, onFavorito, onBloquear, showQuitarFavorito }) {
  return (
    <div className='col-xs-12 col-sm-6 col-md-4'>
      <div className="card">
        <img src={item.url} className="card-img-top" alt="Gato" />
        <div className="card-body">
          <h5 className="card-title">Gatito {item.id}</h5>
          <a href={item.url} target='_blank' rel='noreferrer' className="btn btn-primary">Ver Gatito</a>
          <button onClick={() => onFavorito(item)} className="btn btn-outline-info m-1">Favorito</button>
          <button onClick={() => onBloquear(item)} className="btn btn-outline-danger m-1">{showQuitarFavorito ? "Quitar de favoritos" : "Bloquear"}</button>
        </div>
      </div>
    </div>
  );
}

function Estadisticas({ total, favoritos, bloqueados }) {
  return (
    <div className="estadisticas">
      <h3>Estadísticas</h3>
      <p>Total de elementos: {total}</p>
      <p>Favoritos: {favoritos}</p>
      <p>Bloqueados: {bloqueados}</p>
    </div>
  );
}

function App() {
  const [gatos, setGatos] = useState([]);
  const [buscarInput, setBuscarInput] = useState("");
  const [gatosFavoritos, setGatosFavoritos] = useState([]);
  const [gatosBloqueados, setGatosBloqueados] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setGatos(data.map((gato, index) => ({ id: index + 1, url: gato.url })));
        }
      })
      .catch(error => {
        console.log("ERROR: " + error);
      });
  }, []);

  const agregarFavorito = (gato) => {
    setGatosFavoritos(prevFavoritos => [...prevFavoritos, gato]);
  };

  const bloquearGato = (gato) => {
    if (gatosFavoritos.some(favorito => favorito.id === gato.id)) {
      quitarFavorito(gato);
    }
    if (!gatosBloqueados.some(bloqueado => bloqueado.id === gato.id)) {
      setGatosBloqueados(prevBloqueados => [...prevBloqueados, gato]);
    }
  };

  const desbloquearGato = (gato) => {
    setGatosBloqueados(prevBloqueados => prevBloqueados.filter(item => item.id !== gato.id));
  };

  const quitarFavorito = (gato) => {
    setGatosFavoritos(prevFavoritos => prevFavoritos.filter(item => item.id !== gato.id));
  };

  const gatosFiltrados = gatos.filter(gato => gato.id.toString().includes(buscarInput.toLowerCase()));
  const gatosFavoritosFiltrados = gatosFavoritos.filter(gato => gato.id.toString().includes(buscarInput.toLowerCase()));
  const gatosBloqueadosFiltrados = gatosBloqueados.filter(gato => gato.id.toString().includes(buscarInput.toLowerCase()));

  return (
    <Fragment>
      <header className='header'>
        <h1>10 Imágenes random de gatitos</h1>
      </header>

      <div className='container'>
        <div className='row'>
          <div className='main-content col-md-9'>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar gatito por Numero"
                aria-label="Buscar gatito por Numero"
                aria-describedby="button-addon2"
                value={buscarInput}
                onChange={(e) => setBuscarInput(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
                onClick={() => setBuscarInput("")}
              >
                Borrar
              </button>
            </div>
            <div className='row'>
              {gatosFiltrados.map(gato => (
                <Gato
                  key={gato.id}
                  item={gato}
                  onFavorito={agregarFavorito}
                  onBloquear={bloquearGato}
                  showQuitarFavorito={gatosFavoritos.some(favorito => favorito.id === gato.id)}
                />
              ))}
            </div>
          </div>

          <div className='aside col-md-3'>
            <div className='aside-favoritos'>
              <h3>Favoritos</h3>
              <ul>
                {gatosFavoritosFiltrados.map(gato => (
                  <li key={gato.id}>Gatito {gato.id}</li>
                ))}
              </ul>
            </div>

            <div className='aside-bloqueados'>
              <h3>Bloqueados</h3>
              <ul>
                {gatosBloqueadosFiltrados.map(gato => (
                  <li key={gato.id}>Gatito {gato.id} <button onClick={() => desbloquearGato(gato)} className="btn btn-outline-danger m-1">Desbloquear</button></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Estadisticas total={gatosFiltrados.length} favoritos={gatosFavoritosFiltrados.length} bloqueados={gatosBloqueadosFiltrados.length} />

      <footer className="footer">
        Sitio Web realizado por: Yamila Seleme e Iván Ruiz
      </footer>
    </Fragment>
  );
}

export default App;





