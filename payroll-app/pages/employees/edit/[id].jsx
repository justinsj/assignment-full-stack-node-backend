import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Layout, AddEdit } from 'components/employees';
import { Spinner } from 'components';
import { employeeService, alertService } from 'services';

export default Edit;

function Edit() {
    const router = useRouter();
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        const { id } = router.query;
        if (!id) return;

        // fetch employee and set default form values if in edit mode
        employeeService.getById(id)
            .then(x => setEmployee(x))
            .catch(alertService.error)
    }, [router]);

    return (
        <Layout>
            <h1>Edit Employee</h1>
            {employee ? <AddEdit employee={employee} /> : <Spinner />}
        </Layout>
    );
}