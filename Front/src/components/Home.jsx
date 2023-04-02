import React from "react";
import image from "../assets/home-image.png";
import './styles/Home.css'

export const Home = () => {
  return (
    <>
      <div className="container d-flex justify-content-center mt-3 animate__animated animate__fadeIn">
        <div className="d-flex flex-column">
          <h2>Bienvenido a la app de Articulos</h2>
          <img src={image} alt="imagen-limpieza" />
        </div>
      </div>
    </>
  );
};
