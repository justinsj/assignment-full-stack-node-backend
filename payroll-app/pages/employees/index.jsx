import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Spinner } from 'components';
import { Layout } from 'components/employees';
import CurrencyFormat from 'react-currency-format';
import { employeeService } from 'services';


export default Index;

// TODO add pagination 
// TODO add sorting
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
            {/* Put button on the right */}
            <Link href="/employees/add" className="btn btn-success float-end">Add Employee</Link>
        </Layout>
    );
}
