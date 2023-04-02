import React from "react";
import { axiosClient } from "../api/api.ts";

export const DeleteProduct = ({ selectedItem, closeModal, deleteSuccess, deleteError }) => {
    
  const deleteProduct = () => {
    axiosClient
      .delete(`api/products/${selectedItem.id}`)
      .then(() => {
        deleteSuccess();
      })
      .catch((err) => {
        console.warm(err);
        deleteError();
      });
  };

  return (
    <div className="d-flex justify-content-end">
      <button className="btn btn-secondary ms-2" onClick={() => closeModal()}>
        Cancelar
      </button>
      <button className="btn btn-primary ms-2" onClick={() => deleteProduct()}>
        Aceptar
      </button>
    </div>
  );
};
