import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [videojuegos, setVideojuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoJuego, setNuevoJuego] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    precio: ''
  });

  // Cargar videojuegos
  useEffect(() => {
    fetchVideojuegos();
  }, []);

  const fetchVideojuegos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/videojuegos');
      setVideojuegos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los videojuegos: ' + err.message);
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoJuego(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Agregar nuevo videojuego
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/videojuegos', nuevoJuego);
      setNuevoJuego({ titulo: '', genero: '', plataforma: '', precio: '' });
      fetchVideojuegos(); // Recargar la lista
    } catch (err) {
      setError('Error al agregar el videojuego: ' + err.message);
    }
  };

  // Eliminar videojuego
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/videojuegos/${id}`);
      fetchVideojuegos(); // Recargar la lista
    } catch (err) {
      setError('Error al eliminar el videojuego: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Cargando videojuegos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Catálogo de Videojuegos</h1>
      </header>

      {/* Formulario para agregar nuevo videojuego */}
      <form onSubmit={handleSubmit} className="game-form">
        <h2>Agregar Nuevo Videojuego</h2>
        <div className="form-group">
          <input
            type="text"
            name="titulo"
            value={nuevoJuego.titulo}
            onChange={handleInputChange}
            placeholder="Título del juego"
            required
          />
          <input
            type="text"
            name="genero"
            value={nuevoJuego.genero}
            onChange={handleInputChange}
            placeholder="Género"
            required
          />
          <input
            type="text"
            name="plataforma"
            value={nuevoJuego.plataforma}
            onChange={handleInputChange}
            placeholder="Plataforma"
            required
          />
          <input
            type="number"
            name="precio"
            value={nuevoJuego.precio}
            onChange={handleInputChange}
            placeholder="Precio"
            step="0.01"
            required
          />
          <button type="submit">Agregar Juego</button>
        </div>
      </form>

      {/* Lista de videojuegos */}
      <main className="games-grid">
        {videojuegos.map((juego) => (
          <div key={juego.id} className="game-card">
            <h2>{juego.titulo}</h2>
            <div className="game-details">
              <p><strong>Género:</strong> {juego.genero}</p>
              <p><strong>Plataforma:</strong> {juego.plataforma}</p>
              <p><strong>Precio:</strong> ${juego.precio}</p>
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDelete(juego.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
