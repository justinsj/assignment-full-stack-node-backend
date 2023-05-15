import { AddEdit } from 'components/employees';
import { employeeService } from 'services';

export default AddEdit;

export async function getServerSideProps({ params }) {
    const employee = await employeeService.getById(params.id);

    return {
        props: { employee }
    }
}