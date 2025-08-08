import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/hooks/useAuth';
import { User } from './models/User';

interface SignupLoginProps {
  isLoginMode: boolean;
}

export const SignupLogin = ({ isLoginMode }: SignupLoginProps) => {
  const { register: registerUser, login, } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm<User>();
  const password = watch("password");

  const onSubmit = async (data: User) => {
    setErrorMessage('');
    try {
      if (isLoginMode) {
        await login(data);
      } else {
        await registerUser(data);
      }
      navigate('/transactions');
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card mt-5">
            <div className="card-header bg-primary bg-opacity-75">
              <h3 className="card-title mb-0 text-white">{isLoginMode ? 'Login' : 'Sign Up'}</h3>
            </div>
            <div className="card-body">
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password"
                    className="form-label">Password</label>
                  <input type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
                {!isLoginMode && (
                  <div className="mb-3">
                    <label htmlFor="confirmPassword"
                      className="form-label">Confirm Password</label>
                    <input type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      {...register('confirmPassword', { required: 'Confirm Password is required', validate: value => value === password || 'Passwords do not match' })} />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                  </div>
                )}
                <div className="d-grid">
                  <button type="submit"
                    className="btn btn-primary">{isLoginMode ? 'Login' : 'Sign Up'}</button>
                </div>
                <div className="text-center mt-3">
                  {isLoginMode ? (
                    <span>Don't have an account? <Link to="/signup">Sign up</Link></span>
                  ) : (
                    <span>Already have an account? <Link to="/login">Login</Link></span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};