import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill1Wave,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { axiosClient } from "../api/api.ts";

export const SaleItem = ({ item, successAlert, errorAlert }) => {
  const [itemsModal, setItemsModal] = useState(false);
  const [items, setItems] = useState();

  /* Bootstrap react modal */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const updateSale = (item) => {
    axiosClient
      .put("api/sales", { sale: item })
      .then(() => {
        successAlert("Venta cobrada éxitosamente");
      })
      .catch((err) => {
        console.warn(err);
        errorAlert("No se pudo cobrar la venta, (No olvide levantar Back)");
      });
  };

  const deleteSale = (item) => {
    axiosClient
      .delete(`api/sales/${item.id}`)
      .then(() => {
        successAlert("Venta eliminada éxitosamente");
      })
      .catch((err) => {
        errorAlert("No se pudo eliminar la venta, (No olvide levantar Back)");
        console.warn(err);
      });
  };

  const seeSaleItems = (item) => {
    axiosClient
      .get(`api/sales/items/${item.id}`)
      .then(({ data }) => {
        setItemsModal(true);
        setShow(true);
        setItems(data);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <>
      <tr className={item.paid === 1 ? `table-success` : `table-warning`}>
        <td>{item.client}</td>
        <td>$ {Number(item.saleTotal).toFixed(2)}</td>
        <td>{item.paid === 1 ? "Pagado" : "No pagado"}</td>
        <td>{new Date(item.create_at).toLocaleDateString("es-AR")}</td>
        <td>
          {item.paid === 0 ? (
            <button
              className="btn btn-success text-light me-2"
              title="Cobrar venta"
              onClick={() => updateSale(item)}
            >
              <FontAwesomeIcon icon={faMoneyBill1Wave} />
            </button>
          ) : (
            ""
          )}
          <button
            className="btn btn-info text-light me-2"
            title="Ver articulos vendidos"
            onClick={() => seeSaleItems(item)}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="btn btn-danger"
            title="Eliminar venta"
            onClick={() => deleteSale(item)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
      </tr>

      {/* Modal articulos vendidos */}
      {itemsModal && (
        <Modal backdrop="static" centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Articulos de la venta</Modal.Title>
          </Modal.Header>
          <Modal.Body className="mb-2">
            {
              <ListGroup as="ol" numbered>
                {items.map((item) => {
                  return (
                    <ListGroup.Item
                      key={item.name}
                      as="li"
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{item.name}</div>
                        <b>Precio de venta:</b> ${item.sellingPrice}
                      </div>
                      <Badge bg="primary" pill>
                        Cantidad: {item.quantity}
                      </Badge>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            }
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
