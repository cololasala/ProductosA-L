import React, { useState, useEffect } from "react";
import { SaleItem } from "./SaleItem";
import { AlertSuccess } from "./AlertSuccess";
import { Pagination } from "./Pagination";
import { AlertError } from "./AlertError";
import { Loading } from "./Loading";
import { axiosClient } from "../api/api.ts";


export const SalesList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [message, setMessage] = useState("");

  /* Filter search */
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  /* Cambio de pagina */
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getSales = () => {
    setLoading(true);

    setTimeout(() => {    //TODO: probar que siempre actualiza
      axiosClient
        .get("api/sales/new")
        .then(({ data }) => {
          setItems(data);
          setFilteredItems(data); // filtrados
          setLoading(false);
        })
        .catch((err) => {
          console.warn(err);
          setItemsError(true);
        });
    }, 1000);
  };

  const searchSaleByDate = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length) {
      setCurrentPage(1); // para que se muestre en la pagina 1
      setFilteredItems(
        items.filter(({ create_at }) => {
          const date = new Date(create_at).toLocaleDateString("es-AR");
          return date.indexOf(searchValue.toLocaleLowerCase()) > -1;
        })
      );
    } else {
      setFilteredItems(items);
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  const openSuccessAlert = (message) => {
    setMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setMessage("");
    }, 2500);
  };

  const openErrorAlert = (message) => {
    setMessage(message);
    setShowAlertError(true);
    setTimeout(() => {
      setShowAlertError(false);
      setMessage("");
    }, 2500);
  };

  if (loading) {
    return (
      <>
        <h2 className="text-center mt-2 mb-2">Listado de ventas</h2>
        <Loading />
      </>
    );
  }

  return (
    <>
      <h2 className="text-center mt-2 mb-2">Listado de ventas</h2>
      {itemsError ? (
        <>
          <h3 className="text-center text-danger">
            No se pudieron cargar las ventas
          </h3>
          <h4 className="text-center text-danger">(No olvide levantar Back)</h4>
        </>
      ) : (
        ""
      )}
      {showAlert ? <AlertSuccess message={message} /> : ""}
      {showAlertError ? <AlertError message={message} /> : ""}
      <>
        <input
          type="text"
          className="form-control w-25 mb-3"
          id="searchSale"
          name="searchSale"
          placeholder="Buscar por fecha (d/m/a)..."
          value={searchValue}
          onChange={searchSaleByDate}
        />
        <table className="table table-hover animate__animated animate__fadeIn">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Total de venta</th>
              <th>Estado</th>
              <th>Fecha del pedido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              return (
                <SaleItem
                  item={item}
                  key={index}
                  successAlert={(message) => {
                    getSales();
                    openSuccessAlert(message);
                  }}
                  errorAlert={(message) => {
                    openErrorAlert(message);
                  }}
                />
              );
            })}
          </tbody>
        </table>

        {searchValue && searchValue.length && !filteredItems.length && (
          <div className="d-flex justify-content-center">
            <h2 className="text-danger">Fecha no encontrado</h2>
          </div>
        )}

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredItems.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </>
    </>
  );
};
