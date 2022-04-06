import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import validator, { validateForms } from '../../helpers/validateForm';
import { GetUSer } from '../../redux/actions/user';
import { State } from '../../redux/reducers';
import Form from '../form/Form';

interface Inputs {
    email: string,
    passUser: string
}

const Login = (): JSX.Element => {

    const dispatch=useDispatch();
    const user=useSelector((state:State)=>state.user);

    const [inputs,setInputs]=useState<Inputs>({
        email:'',
        passUser:''
    });
    const [error, setErrores] = useState<Inputs>({
        email: '',
        passUser: ''
    });

    const RegisterChange = (event: any) => {
        event.preventDefault();
        setInputs({
            ...inputs,
            [event.target.name]: event.target.value
        })
        setErrores(validator(error, event.target as HTMLInputElement) as Inputs);

    }

    const RegisterFetch = (event: any) => {
        event.preventDefault();
        const res = validateForms(error, inputs);

        if (res) {
            return alert(res);
        }
        console.log('Envio de datos Registro');

        /**
         * dispatch
         */

        if(!user){
            console.log('user: ',inputs);
            // dispatch(GetUSer(inputs.email,inputs.passUser))
        }


    }



    let emailStyle = error.email ? 'form-control is-invalid' : 'form-control';
    let passStyle = error.passUser ? 'form-control is-invalid' : 'form-control';

    return (
        <Form title='Login'>
            <div>
                <input type='email' placeholder='Email' id='email' name='email' className={emailStyle} onChange={RegisterChange} />
                {error.email && <b className='invalid-feedback'>{error.email}</b>}
            </div>
            <div>
                <input type='password' placeholder='Password' name='passUser' className={passStyle} onChange={RegisterChange} />
                {error.passUser && <b className='invalid-feedback'>{error.passUser}</b>}
            </div>
            
            <article>
                {
                    validateForms(error, inputs).length ?
                        <button className='btn btn-success button-links link-Router' disabled>
                            Submit
                        </button>
                        :
                        <button className='btn btn-success button-links link-Router' onClick={RegisterFetch}>
                            Submit
                        </button>
                }
                <Link to='/register' className='btn btn-secondary link-Router button-links'>
                    Register
                </Link> 
            </article>
            
        </Form>
    )
}


/**
 * danger input-->form-control is-invalid
 * input good -->form-control is-valid
 * 
 * 
 */

export default Login;