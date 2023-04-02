import React, { useState } from "react";
import { axiosClient } from "../api/api.ts";

export const UpdateProduct = ({ selectedItem, closeModal, updateSuccess, updateError }) => {
  const [formData, setFormData] = useState(selectedItem);
  const [inputStep, setInputStep]=useState(selectedItem.productType === '1' ? '0.01' : '1' );

  const handleChange = (event) => {
    const { name } = event.target;
    const { value } = event.target;
    if(name === 'productType') {
      formData.quantity = '';    // revisar
      setInputStep(value === '1' ? '0.01' : '1');
    }
    setFormData((values) => ({ ...values, [name]: value }));
  };
  
  const submitForm = (event) => {
    event.preventDefault();
    axiosClient
      .put("api/products", {
        product: formData
      })
      .then(() => {
        updateSuccess();
      })
      .catch((err) => {
        console.warn(err);
        updateError();
      });
  };

  return (
    <div className="container mt-3">
      <form onSubmit={submitForm} >
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
          <select className="form-select" aria-label="Tipo de articulo" id="productType" name="productType" onChange={handleChange}
          defaultValue={formData.productType} required disabled style={{cursor: 'not-allowed'}}>
            <option value="">Seleccione tipo (Litros / Unidades)</option>
            <option value="1">Litros</option>
            <option value= "2">Unidades</option>
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
            min="0"
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

        <div className="p-3 mb-2 bg-info text-light rounded">
          <b>Porcentaje de ganancias: </b> 
          {(formData.purchasePrice && formData.sellingPrice ) ? (((formData.sellingPrice / formData.purchasePrice) - 1 ) * 100).toFixed(2) + '%' : '----%' }
        </div>

        <div className="d-flex justify-content-end">
         <input type="button" className="btn btn-secondary mb-2" value="Cancelar" onClick={closeModal}/>
          <input
            type="submit"
            className="btn btn-warning ms-2 mb-2"
            value="Modificar"
          />
        </div>
      </form>
    </div>
  );
};
