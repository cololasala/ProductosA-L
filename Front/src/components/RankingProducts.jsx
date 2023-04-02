import React, { useState, useEffect } from "react";
import { Loading } from "./Loading";
import { GoogleCharts } from "./GoogleCharts";
import Modal from "react-bootstrap/Modal";
import { axiosClient } from "../api/api.ts";

export const RankingProducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Bootstrap react modal */
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    axiosClient
      .get("api/sales/ranking")
      .then(({ data }) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const showCharts = () => {
    setShow(true);
  };

  if (loading) {
    return (
      <>
        <h2 className="text-center mt-2 mb-2">Ranking de ventas</h2>
        <Loading />
      </>
    );
  }

  return (
    <>
      <h2 className="text-center mt-2 mb-2">Ranking de ventas</h2>
      {!loading && items.length > 0 && (
        <>
          <button className="btn btn-info" onClick={showCharts} style={{color: "white"}}>
            Ver gráficos
          </button>
          <table className="table table-hover animate__animated animate__fadeIn mt-3">
            <thead>
              <tr>
                <th>Articulo</th>
                <th>Total vendido (Litros/Unidades)</th>
              </tr>
            </thead>
            <tbody className="table-light">
              {items.map((i, index) => {
                return (
                  <tr key={index}>
                    <td>{i.name}</td>
                    <td>{parseFloat(i.total.toFixed(2))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {show && (
            <Modal size="lg" backdrop="static" centered show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Gráficos de torta y barras</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <GoogleCharts items={items} />
              </Modal.Body>
            </Modal>
          )}
        </>
      )}

      {!loading && items.length === 0 && (
        <h3 className="text-center text-danger">Sin ventas registradas</h3>
      )}
    </>
  );
};
