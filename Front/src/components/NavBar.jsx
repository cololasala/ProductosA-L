import React from "react";
import { NavLink } from "react-router-dom";

export const NavBar = () => {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        
      >
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <NavLink
                className={({ isActive }) => {
                  return `nav-link ${isActive ? "active" : ""}`;
                }}
                to="/home"
              >
                Home
              </NavLink>
              <NavLink
                className={({ isActive }) => {
                  return `nav-link ${isActive ? "active" : ""}`;
                }}
                to="crear"
              >
                Agregar articulo
              </NavLink>
              <NavLink
                className={({ isActive }) => {
                  return `nav-link ${isActive ? "active" : ""}`;
                }}
                to="listar"
              >
                Mi almacen
              </NavLink>
              <NavLink
                className={({ isActive }) => {
                  return `nav-link ${isActive ? "active" : ""}`;
                }}
                to="ventas"
              >
                Mis ventas
              </NavLink>
              <NavLink
                className={({ isActive }) => {
                  return `nav-link ${isActive ? "active" : ""}`;
                }}
                to="ranking"
              >
                Mi ranking
              </NavLink>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
