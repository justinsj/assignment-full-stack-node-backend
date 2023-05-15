import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { employeeService, alertService } from 'services';

export { AddEdit };

function AddEdit(props) {
    const employee = props?.employee;
    const isAddMode = !employee;
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
   
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        salary: Yup.number()
            .required('Salary is required'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (!isAddMode) {
        const { password, confirmPassword, ...defaultValues } = employee;
        formOptions.defaultValues = defaultValues;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return isAddMode
            ? createEmployee(data)
            : updateEmployee(employee.id, data);
    }

    function createEmployee(data) {
        return employeeService.create(data)
            .then(() => {
                alertService.success('Employee added', { keepAfterRouteChange: true });
                router.push('.');
            })
            .catch(alertService.error);
    }

    function updateEmployee(id, data) {
        return employeeService.update(id, data)
            .then(() => {
                alertService.success('Employee updated', { keepAfterRouteChange: true });
                router.push('..');
            })
            .catch(alertService.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{isAddMode ? 'Add Employee' : 'Edit Employee'}</h1>
            <div className="form-row">
                <div className="form-group col-5">
                    <label>First Name</label>
                    <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>Last Name</label>
                    <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-7">
                    <label>Salary</label>
                    <input name="salary" type="text" {...register('salary')} className={`form-control ${errors.salary ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.salary?.message}</div>
                </div>
            
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href="/employees" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}