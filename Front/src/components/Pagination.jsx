import React from "react";
import "./styles/Pagination.css";

export const Pagination = ({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <nav className="d-flex justify-content-center">
        <ul className="pagination mb-1">
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`${number === currentPage ? "active" : ""} page-item`}
            >
              <a
                className="page-link me-0"
                onClick={() => {
                  paginate(number);
                }}
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {currentPage && totalItems > 0 && (
        <p className="d-flex justify-content-center">
          Página seleccionada: <b className="ms-2">{currentPage}</b>
        </p>
      )}
    </>
  );
};
