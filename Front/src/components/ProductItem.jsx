import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const ProductItem = ({ item, selectedItem }) => {
  const typeDescription = item.productType === "1" ? "Litros" : "Unidades";
  const dangerColor =
    (item.productType === "1" && item.quantity <= 5) ||
    (item.productType === "2" && item.quantity <= 2);
  const warningColor =
    (item.productType === "1" && item.quantity > 5 && item.quantity <= 10) ||
    (item.productType === "2" && item.quantity > 2 && item.quantity < 5);

  return (
    <tr
      className={
        dangerColor
          ? `table-danger`
          : warningColor
          ? `table-warning`
          : `table-success`
      }
    >
      <td>{item.name}</td>
      <td>{typeDescription}</td>
      <td>$ {item.purchasePrice}</td>
      <td>$ {item.sellingPrice}</td>
      <td>{item.quantity}</td>
      <td>
        <button
          className="btn btn-warning ms-2 text-light"
          title="Actualizar articulo"
          onClick={() => selectedItem(item, "update")}
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          className="btn btn-danger ms-2"
          title="Eliminar articulo"
          onClick={() => selectedItem(item, "delete")}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
};
