import { useState, useEffect } from 'react';

import { Link } from 'components';
import { employeeService } from 'services';
import CurrencyFormat from 'react-currency-format';
export default Index;

function Index() {
    const [employees, setEmployees] = useState(null);

    useEffect(() => {
        employeeService.getAll().then(x => setEmployees(x));
    }, []);

    function deleteEmployee(id) {
        setEmployees(employees.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        employeeService.delete(id).then(() => {
            setEmployees(employees => employees.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>EMPLOYEES</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>First Name</th>
                        <th style={{ width: '30%' }}>Last Name</th>
                        <th style={{ width: '30%' }}>Salary</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {employees && employees.map(employee =>
                        <tr key={employee.id}>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td><CurrencyFormat value={employee.salary} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={`/employees/edit/${employee.id}`} className="btn btn-edit-employee mr-1">Edit</Link>
                                <button onClick={() => deleteEmployee(employee.id)} className="btn btn-delete-employee" disabled={employee.isDeleting}>
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
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
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
            <Link href="/employees/add" className="btn btn-success float-right mb-3">Add Employee</Link>
        </div>
    );
}
