import React from 'react';
import { Link } from 'react-router-dom';
import { Fragment, useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const onChange_fun = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign In to Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange_fun(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            Name
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange_fun(e)}
            minLength='6'
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
