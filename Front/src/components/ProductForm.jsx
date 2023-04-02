import React, { useState } from "react";
import { AlertSuccess } from "./AlertSuccess";
import { AlertError } from "./AlertError";
import "./styles/ProductForm.css";
import { axiosClient } from "../api/api.ts";

export const ProductForm = () => {
  const [formData, setFormData] = useState({});
  const [selected, setSelected] = useState("");
  const [inputStep, setInputStep] = useState("1");
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showTomato, setShowTomato] = useState(false);

  const handleChange = (event) => {
    const { name } = event.target;
    const { value } = event.target;
    if (name === "productType") {
      formData.quantity = ""; // revisar
      setInputStep(value === "1" ? "0.01" : "1");
      setSelected(value);
    }
    setFormData((values) => ({ ...values, [name]: value }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (formData.name.toLowerCase() === "tomate") {
      tomatoGif();
    } else {
      axiosClient
        .post("api/products", { product: formData })
        .then(() => {
          setFormData({}); //reseteo el form con el state
          setSelected(""); //reseteo el select
          openSuccessAlert();
        })
        .catch((err) => {
          console.warm(err);
          openErrorAlert();
        });
    }
  };

  const tomatoGif = () => {
    setFormData({});
    setSelected("");
    setShowTomato(true);
    setTimeout(() => {
      setShowTomato(false);
    }, 5000);
  };

  const openSuccessAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2500);
  };

  const openErrorAlert = () => {
    setShowAlertError(true);
    setTimeout(() => {
      setShowAlertError(false);
    }, 2500);
  };

  return (
    <>
      {showTomato && (
        <div className="d-flex justify-content-center mt-3">
          <iframe
            src="https://giphy.com/embed/1zi2SFsjUwzB0at4h1"
            width="400"
            height="400"
            className="giphy-embed"
            allowFullScreen
          ></iframe>
          <p>
            <a href="https://giphy.com/gifs/subway-sverige-funny-cute-1zi2SFsjUwzB0at4h1"></a>
          </p>
        </div>
      )}
      <h2 className="text-center mt-2">Compra de articulos</h2>
      {showAlert ? (
        <AlertSuccess message="Articulo guardado exitosamente!" />
      ) : (
        ""
      )}
      {showAlertError ? (
        <AlertError message="No se pudo guardar el articulo, (No olvide levantar Back)" />
      ) : (
        ""
      )}
      <div className="container mt-3 w-25 form-container animate__animated animate__fadeIn">
        <form onSubmit={submitForm}>
          <div className="mb-3">
            <label htmlFor="name">Articulo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese nombre del articulo"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="productType">Tipo</label>
            <select
              className="form-select"
              aria-label="Tipo de articulo"
              id="productType"
              name="productType"
              value={selected}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione tipo (Litros / Unidades)</option>
              <option value="1">Litros</option>
              <option value="2">Unidades</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="quantity">Cantidad</label>
            <input
              type="number"
              className="form-control"
              placeholder="Ingrese cantidad a comprar"
              id="quantity"
              name="quantity"
              min="1" /* si es de tipo litro el minimo seria 0.5, si es unidad el minimo es 1, poner Regex*/
              step={inputStep}
              onKeyPress={(event) => event.charCode >= 48}
              value={formData.quantity || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="purchasePrice">Precio costo</label>
            <input
              type="number"
              className="form-control"
              placeholder="Ingrese precio de costo"
              id="purchasePrice"
              name="purchasePrice"
              min="1"
              step="0.05"
              onKeyPress={(event) => event.charCode >= 48}
              value={formData.purchasePrice || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sellingPrice">Precio venta</label>
            <input
              type="number"
              className="form-control"
              placeholder="Ingrese precio de venta"
              id="sellingPrice"
              name="sellingPrice"
              min="1"
              step="0.05"
              onKeyPress={(event) => event.charCode >= 48}
              value={formData.sellingPrice || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="p-3 mb-3 bg-info text-light rounded">
            <b>Porcentaje de ganancias: </b>
            {formData.purchasePrice && formData.sellingPrice
              ? (
                  (formData.sellingPrice / formData.purchasePrice - 1) *
                  100
                ).toFixed(2) + "%"
              : "----%"}
          </div>

          <div className="d-flex justify-content-end">
            <input
              type="submit"
              className="btn btn-success mb-2"
              value="Guardar"
            />
          </div>
        </form>
      </div>
    </>
  );
};
