import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Spinner } from 'components';
import Pagination from 'components/Pagination';
import { SortArrow, nextDirection } from 'components/SortArrow';
import { Layout } from 'components/employees';
import CurrencyFormat from 'react-currency-format';
import { employeeService } from 'services';

export default Index;

const PAGE_SIZE = 5;
const CURRENCY_NUM_DECIMALS = 2;

// Define initial sorting state
const initialSortState = {
  column: null,
  direction: null,
};

function Index() {
  const [employees, setEmployees] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [sortState, setSortState] = useState(initialSortState);

  useEffect(() => {
    employeeService.getAll({
      page: currentPage,
      pageSize: PAGE_SIZE,
      sortColumn: sortState.column,
      sortDirection: sortState.direction,
    }).then(({ data, totalPages }) => {
      setEmployees(data);
      setTotalPages(totalPages);
    });
  }, [currentPage, sortState.column, sortState.direction]); // Add sort state dependencies

  function deleteEmployee(id) {
    setEmployees(employees =>
      employees.map(x => {
        if (x.id === id) {
          x.isDeleting = true;
        }
        return x;
      })
    );
  
    employeeService.delete(id).then(() => {
        employeeService.getAll({
            page: currentPage,
            pageSize: PAGE_SIZE,
            sortColumn: sortState.column,
            sortDirection: sortState.direction,
        }).then(({ data, totalPages }) => {
            setTotalPages(totalPages);
            if (data.length === 0 && totalPages > 0) {
                setCurrentPage(currentPage - 1);
            }
            else {
                setEmployees(data);
            }
            
        });
    });
  }
  

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handleSort(column) {
    setSortState(prevState => {
      if (prevState.column === column) {
        // If the same column is clicked again, toggle the sort direction
        return {
          column: column,
          direction: nextDirection(prevState.direction),
        };
      } else {
        // If a new column is clicked, set the sort column and direction
        return {
          column: column,
          direction: 'asc',
        };
      }
    });
  }
  
  useEffect(() => {
    if (sortState.column === null) {
      // Reset to sort by 'id' when sort column is null
      setSortState({ column: 'id', direction: 'asc' });
    }
  }, [sortState.column]);
  

  return (
    <Layout>
      <h1>EMPLOYEES</h1>
      <div className="overflow-auto mb-2">
        <table className="table">
          <thead>
            <tr>
              <th
                style={{ width: '30%', cursor: 'pointer' }}
                onClick={() => handleSort('firstName')}
              >
                First Name {sortState.column === 'firstName' && <SortArrow direction={sortState.direction} />}
              </th>
              <th
                style={{ width: '30%', cursor: 'pointer' }}
                onClick={() => handleSort('lastName')}
              >
                Last Name {sortState.column === 'lastName' && <SortArrow direction={sortState.direction} />}
              </th>
              <th
                style={{ width: '30%', cursor: 'pointer' }}
                onClick={() => handleSort('salary')}
              >
                Salary {sortState.column === 'salary' && <SortArrow direction={sortState.direction} />}
              </th>
              <th style={{ width: '10%', textAlign: 'center' }}>Options</th>
            </tr>
          </thead>
          <tbody>
          {employees && employees.map(employee =>
              <tr key={employee.id}>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>
                  <CurrencyFormat decimalScale={CURRENCY_NUM_DECIMALS} value={employee.salary} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link href={`/employees/edit/${employee.id}`} className="btn btn-edit me-1">Edit</Link>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
                    className="btn btn-delete"
                    style={{ width: '60px' }}
                    disabled={employee.isDeleting}
                  >
                    {employee.isDeleting ? <span className="spinner-border spinner-border-sm"></span> : <span>Delete</span>}
                  </button>
                </td>
              </tr>
            )}
            {!employees &&
              <tr>
                <td colSpan="4">
                  <Spinner />
                </td>
              </tr>
            }
            {employees && !employees.length &&
              <tr>
                <td colSpan="4" className="text-center">
                  <div className="p-2">No Employees To Display</div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      {/* Wrap the Add Employee button in a div to put it in a row above the pagination elements */}
      <div className="d-flex">
        <Link href="/employees/add" className="btn btn-primary ms-auto mb-2">Add Employee</Link>
      </div>
      {totalPages && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </Layout>
  );
}
