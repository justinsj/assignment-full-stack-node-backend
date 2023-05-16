import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Spinner } from 'components';
import { Layout } from 'components/employees';
import CurrencyFormat from 'react-currency-format';
import { employeeService } from 'services';
import Pagination from 'components/Pagination';


export default Index;

const PAGE_SIZE = 5;
// TODO add sorting
function Index() {
    const [employees, setEmployees] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);

    useEffect(() => {
        employeeService.getAll({ page: currentPage, pageSize: PAGE_SIZE }).then(({ data, totalPages }) => {
            setEmployees(data);
            setTotalPages(totalPages);
        });
    }, [currentPage]);
    
    function deleteEmployee(id) {
        const updatedEmployees = employees.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        });
        setEmployees(updatedEmployees);
        // Handle case of deleting the last employee on the page
        employeeService.delete(id).then(() => {
            const index = updatedEmployees.findIndex(x => x.id === id);
            const newEmployees = [...updatedEmployees.slice(0, index), ...updatedEmployees.slice(index + 1)];
            if (newEmployees.length === 0 && totalPages > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                setEmployees(newEmployees);
            }
        });
    }

    
  function handlePageChange(page) {
    setCurrentPage(page);
  }
    

    return (
        <Layout>
            <h1>EMPLOYEES</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>First Name</th>
                        <th style={{ width: '30%' }}>Last Name</th>
                        <th style={{ width: '30%' }}>Salary</th>
                        <th style={{ width: '10%' }}>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {employees && employees.map(employee =>
                        <tr key={employee.id}>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td><CurrencyFormat value={employee.salary} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={`/employees/edit/${employee.id}`} className="btn btn-edit me-1">Edit</Link>
                                <button onClick={() => deleteEmployee(employee.id)} className="btn btn-delete" style={{ width: '60px' }} disabled={employee.isDeleting}>
                                    {employee.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
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
            {/* {totalPages && totalPages > 1 &&
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</a>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <a className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</a>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</a>
                        </li>
                    </ul>
                </nav>
            } */}

{totalPages && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
            {/* Put button on the right */}
            <Link href="/employees/add" className="btn btn-success float-end">Add Employee</Link>
        </Layout>
    );
}
