import React, { useState } from "react";
import { axiosClient } from "../api/api.ts";

export const SellingForm = ({
  selectedItem,
  closeModal,
  sellSuccess,
  sellError,
}) => {
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((values) => ({ ...values, [name]: value }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    axios
      .post("api/sales", {
        sale: {
          ...formData,
          product: selectedItem.name,
          idProduct: selectedItem.id,
          sellTotal: selectedItem.sellingPrice * formData.quantity
        },
      })
      .then(() => {
        sellSuccess();
      })
      .catch((err) => {
        console.warn(err);
        sellError();
      });
  };

  return (
    <>
      <form onSubmit={submitForm}>
        <div className="mb-2">
          <label htmlFor="client">Cliente</label>
          <input
            type="text"
            className="form-control"
            id="client"
            name="client"
            placeholder="Ingrese nombre del cliente"
            value={formData.client || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="client">Cantidad</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            min={selectedItem.productType === "1" ? "0.01" : "1"}
            max={selectedItem.quantity}
            step={selectedItem.productType === "1" ? "0.01" : "1"}
            onKeyPress={(event) => event.charCode >= 48}
            placeholder="Ingrese cantidad a vender"
            value={formData.quantity || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paid"
              id="radioOne"
              value="1"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="radioOne">
              Paga
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paid"
              id="radioTwo"
              value="0"
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="radioTwo">
              No paga
            </label>
          </div>
        </div>
        <div className="p-3 mb-2 bg-info text-light rounded">
          Total de venta:
          {formData.quantity
            ? " $" + (selectedItem.sellingPrice * formData.quantity).toFixed(2)
            : ""}
        </div>
        <div className="d-flex justify-content-end">
          <input
            type="button"
            className="btn btn-secondary mb-2"
            value="Cancelar"
            onClick={closeModal}
          />
          <input
            type="submit"
            className="btn btn-primary mb-2 ms-2"
            value="Aceptar"
          />
        </div>
      </form>
    </>
  );
};
