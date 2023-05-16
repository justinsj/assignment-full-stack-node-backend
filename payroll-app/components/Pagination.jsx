import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a className="page-link" onClick={() => onPageChange(currentPage - 1)}>Previous</a>
        </li>
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
            <a className="page-link" onClick={() => onPageChange(i + 1)}>{i + 1}</a>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a className="page-link" onClick={() => onPageChange(currentPage + 1)}>Next</a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
