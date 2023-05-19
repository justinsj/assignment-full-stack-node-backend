import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { employeeService, alertService } from 'services';

export { AddEdit };

function textUndecorate(text) {
    return text.replace(/,/g, '').replace('$', '');
}
function textDecorate(text) {
    return '$' + parseFloat(textUndecorate(text)).toLocaleString('en');
}

function AddEdit(props) {
    const employee = props?.employee;
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),

        // Remove commas and symbols
        salary: Yup.string()
            .transform(x => textUndecorate(x))
            .required('Salary is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (employee) {
        formOptions.defaultValues = props.employee;
        if (props.employee.salary) {
            const value = props.employee.salary.toString();
            formOptions.defaultValues.salary = textDecorate(value);
        }
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit(data) {
        alertService.clear();
        try {
            // create or update employee based on employee prop
            let message;
            if (employee) {
                await employeeService.update(employee.id, data);
                message = 'Employee updated';
            } else {
                await employeeService.register(data);
                message = 'Employee added';
            }

            // redirect to employee list with success message
            router.push('/employees');
            alertService.success(message, true);
        } catch (error) {
            alertService.error(error);
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">First Name</label>
                    <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>
                <div className="mb-3 col">
                    <label className="form-label">Last Name</label>
                    <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>
            </div>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">Salary</label>
                    <input name="salary" type="text" {...register('salary')} className={`form-control ${errors.salary ? 'is-invalid' : ''}`} 
                        onBlur={e => {
                            const { value } = e.target;
                            e.target.value = textDecorate(value);
                        }}
                        onFocus={e => {
                            const { value } = e.target;
                            e.target.value = textUndecorate(value);
                        }}
                    />
                    <div className="invalid-feedback">{errors.salary?.message}</div>
                </div>
            </div>
            <div className="mb-3">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary me-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Save
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href="/employees" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}