import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./Home";
import { NavBar } from "./NavBar";
import { ProductList } from "./ProductList";
import './styles/Main.css'
import { ProductForm } from "./ProductForm.jsx";
import { SalesList } from "./SalesList";
import { RankingProducts } from "./RankingProducts";

export const Main = () => {
  return (
    <>
      <h1 className="text-center mt-3">Articulos de limpieza A&L</h1>
      <hr />
      <NavBar />

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/crear" element={<ProductForm />} />
        <Route path="/listar" element={<ProductList />} />
        <Route path="/ventas" element={<SalesList />} />
        <Route path="/ranking" element={<RankingProducts />} />
        
        <Route path="/*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
};
