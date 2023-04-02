import React, { useState, useEffect } from "react";
import { ProductItem } from "./ProductItem";
import { UpdateProduct } from "./UpdateProduct";
import { DeleteProduct } from "./DeleteProduct";
import { AlertSuccess } from "./AlertSuccess";
import { AlertError } from "./AlertError";
import { Pagination } from "./Pagination";
import { MakeSale } from "./MakeSale";
import Modal from "react-bootstrap/Modal";
import { Loading } from "./Loading";
import { axiosClient } from "../api/api.ts";

export const ProductList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState();
  const [action, setAction] = useState();
  const [itemsError, setItemsError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [makeSale, setMakeSale] = useState(false);

  /* Bootstrap react modal */
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  /* Filter search */
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const getProducts = (firstLoad = false) => {
    setLoading(true);

    setTimeout(() => {      //TODO: probar xq a veces no actualiza
      axiosClient
      .get(`api/products`)
      .then(({ data }) => {
        setItems(data);
        setFilteredItems(data); // filtrados
        if (!firstLoad) {
          setSearchValue("");
          openSuccessAlert();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        setItemsError(true);
      });
    }, 1000)
  };

  useEffect(() => { // inicializacion
    getProducts(true);
    return () => {};
  }, []);

  useEffect(() => { //TODO:  para cambios cuando guardo en filteredItems (sigue fallando)
    currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    return () => {};
  }, [filteredItems]);

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

  /* Cambio de pagina */
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const searchProdcut = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length) {
      setCurrentPage(1); // para que se muestre en la pagina 1
      setFilteredItems(
        items.filter((item) => {
          return (
            item.name?.toLowerCase().indexOf(searchValue.toLocaleLowerCase()) >
            -1
          );
        })
      );
    } else {
      setFilteredItems(items);
    }
  };

  /* TODO: funcion de abrir modal */
  const openSaleModal = () => {
    setAction("sell");
    setShow(true);
    setMakeSale(true);
  };

  if (loading) {
    return (
      <>
        <h2 className="text-center mt-2 mb-2">Listado de articulos</h2>
        <Loading />
      </>
    );
  }

  return (
    <>
      <h2 className="text-center mt-2 mb-2">Listado de articulos</h2>
      {itemsError ? (
        <>
          <h3 className="text-center text-danger">
            No se pudieron cargar los articulos
          </h3>
          <h4 className="text-center text-danger">(No olvide levantar Back)</h4>
        </>
      ) : (
        ""
      )}
      {showAlert && action && (
        <AlertSuccess
          message={
            action === "sell"
              ? "Venta realizada éxitosamente!"
              : action === "update"
              ? "Articulo modificado éxitosamente!"
              : "Articulo eliminado éxitosamente!"
          }
        />
      )}
      {showAlertError && action && (
        <AlertError
          message={
            action === "sell"
              ? "No se pudo realizar la venta, (No olvide levantar Back)"
              : action === "update"
              ? "No se pudo modificar el articulo, (No olvide levantar Back)"
              : "No se pudo eliminar el articulo, (No olvide levantar Back)"
          }
        />
      )}
      <>
        <div className="d-flex mb-3">
          <input
            type="text"
            className="form-control w-25"
            id="searchProduct"
            name="searchProduct"
            placeholder="Buscar por nombre de articulo..."
            value={searchValue}
            onChange={searchProdcut}
          />
          <button className="btn btn-success ms-3" onClick={openSaleModal}>
            Realizar venta
          </button>
        </div>

        <table className="table table-hover animate__animated animate__fadeIn">
          <thead>
            <tr>
              <th>Nombre articulo</th>
              <th>Tipo (Litro/Unidad)</th>
              <th>Precio de compra</th>
              <th>Precio de venta</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              return (
                <ProductItem
                  item={item}
                  key={index}
                  selectedItem={(item, action) => {
                    setSelectedItem(item);
                    setAction(action);
                    setShow(true);
                  }}
                />
              );
            })}
          </tbody>
        </table>

        {searchValue && searchValue.length && !filteredItems.length && (
          <div className="d-flex justify-content-center">
            <h2 className="text-danger">Articulo no encontrado</h2>
          </div>
        )}

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredItems.length}
          currentPage={currentPage}
          paginate={paginate}
        />
        
      </>

      {/* Modal realizar venta */}
      {makeSale && action === "sell" && (
        <Modal backdrop="static" centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Realizar venta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MakeSale
              items={items}
              closeModal={handleClose}
              sellSuccess={() => {
                getProducts();
                handleClose();
              }}
            />
          </Modal.Body>
        </Modal>
      )}

      {/* Modal de modificar articulo */}
      {selectedItem?.name && action === "update" && (
        <Modal backdrop="static" centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modificar articulo: "{selectedItem.name}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UpdateProduct
              selectedItem={selectedItem}
              closeModal={handleClose}
              updateSuccess={() => {
                getProducts();
                handleClose();
              }}
              updateError={() => {
                handleClose();
                openErrorAlert();
              }}
            />
          </Modal.Body>
        </Modal>
      )}

      {/* Modal eliminar articulo */}
      {selectedItem?.name && action === "delete" && (
        <Modal backdrop="static" centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>¿Desea eliminar el articulo?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>
              <b>"{selectedItem.name}"</b>
            </h4>
            <DeleteProduct
              selectedItem={selectedItem}
              closeModal={handleClose}
              deleteSuccess={() => {
                getProducts();
                handleClose();
              }}
              deleteError={() => {
                handleClose();
                openErrorAlert();
              }}
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
