import { Layout, AddEdit } from 'components/employees';

export default Add;

function Add() {
    return (
        <Layout>
            <h1>Add Employee</h1>
            <AddEdit />
        </Layout>
    );
}