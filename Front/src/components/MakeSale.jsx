import React, { useState } from "react";
import Select from "react-select";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axiosClient } from "../api/api.ts";

export const MakeSale = ({ items, closeModal, sellSuccess }) => {
  // TODO: mejorar codigo
  const [selectedItem, setSelectedItem] = useState();
  const [quantity, setQuantity] = useState();
  const [inputStep, setInputStep] = useState("1");
  const [sellList, setSellList] = useState([]);
  const [saleTotal, setSaleTotal] = useState(0);
  const [client, setClient] = useState();
  const [payment, setPayment] = useState(false);

  const options = items.map((item) => {
      return {
        value: item,
        label: item.name,
      };
  }).filter((option) => option.value.quantity > 0);

  const changeSelectedItem = ({ value }) => {
    setSelectedItem(null);
    setQuantity(null);
    setTimeout(() => {
      setInputStep(value.productType === "1" ? "0.01" : "1");
      setSelectedItem(value);
    }, 1000);
  };

  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const handleClient = (e) => {
    setClient(e.target.value);
  };

  const submitForm = (e) => {
    e.preventDefault();
    const isItemInList = sellList.some(
      (s) => s.item.name === selectedItem.name
    );
    if (!isItemInList) {
      const newItemSell = {
        // Cada item a vender tiene su item(descripcion) y cantidad a vender
        item: selectedItem,
        quantity: quantity,
      };
      setSellList([...sellList, newItemSell]);
      setSaleTotal(
        (saleTotal) => saleTotal + selectedItem.sellingPrice * quantity
      );
      setSelectedItem(null);
      setQuantity(null);
    } else {
      console.warn("esta en lista");
    }
  };

  const dropItem = (itemSell) => {
    setSaleTotal(
      (saleTotal) => saleTotal - itemSell.item.sellingPrice * itemSell.quantity
    );
    setSellList(sellList.filter((s) => s.item.name !== itemSell.item.name));
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  const onFinish = () => {
    axiosClient
      .post("api/sales/new", {
        sellList,
        client,
        paid: payment,
        saleTotal,
      })
      .then(() => {
        sellSuccess("sell");
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <>
      <form onSubmit={submitForm} className="mb-2">
        <div className="mb-2">
          <label htmlFor="client">Cliente</label>
          <input
            type="text"
            className="form-control"
            id="client"
            name="client"
            placeholder="Ingrese nombre del cliente"
            onChange={handleClient}
            required
          />
        </div>
        <div className="mb-2">
          <label>Seleccione el articulo</label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            placeholder="Seleccione"
            noOptionsMessage={({ inputValue }) =>
              !inputValue ? "" : "Articulo no encontrado o sin stock"
            }
            value={selectedItem?.item}
            name="item"
            options={options}
            onChange={(e) => changeSelectedItem(e)}
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="quantity">Cantidad</label>
          {selectedItem && (
            <>
              <input
                type="number"
                className="form-control"
                id="quantity"
                name="quantity"
                min={inputStep}
                max={selectedItem.quantity}
                step={inputStep}
                onKeyPress={(event) => event.charCode >= 48}
                placeholder="Ingrese cantidad a vender"
                onChange={handleQuantity}
                required
              />
            </>
          )}
        </div>
        <div className="d-flex justify-content-end">
          <input
            type="submit"
            className="btn btn-success mb-2 ms-2"
            disabled={!quantity}
            value="Agregar"
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
              onChange={handlePayment}
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
              onChange={handlePayment}
              required
            />
            <label className="form-check-label" htmlFor="radioTwo">
              No paga
            </label>
          </div>
        </div>
      </form>
      <hr />
      <p>
        <b>Articulos a vender:</b>
      </p>
      {sellList.length > 0 &&
        sellList.map((s) => {
          return (
            <div
              className="d-flex justify-content-between align-items-center mb-1"
              key={s.item.name}
            >
              <div>
                {s.item.name} - Precio: ${s.item.sellingPrice} -  Cantidad: {s.quantity} - Total {s.item.sellingPrice * s.quantity}
              </div>
              <button
                className="btn btn-danger ms-2"
                title="Eliminar articulo"
                onClick={() => dropItem(s)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          );
        })}
      {sellList.length > 0 && (
        <div className="p-3 mb-2 bg-info text-light rounded">
          Total de venta:
          {" " + "$" + saleTotal.toFixed(2)}
        </div>
      )}
      <div className="d-flex justify-content-end mt-3">
        <input
          type="button"
          className="btn btn-secondary mb-2"
          value="Cancelar"
          onClick={closeModal}
        />
        <input
          type="button"
          className="btn btn-primary ms-2 mb-2"
          disabled={!sellList.length}
          value="Finalizar"
          onClick={onFinish}
        />
      </div>
    </>
  );
};
