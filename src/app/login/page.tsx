'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/commons/axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setToken } = useAuth(); 

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const { email, password } = data;
      const res = await axios.post('/auth/login', { email, password });
      console.log(res,'res');
      const jwToken = res.data;
      setToken(jwToken); // 設置 Token
      toast.success('Login Success');
      router.push('/'); // 跳轉到首頁
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login Failed';
      toast.error(message);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="box login-box" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              className={`input ${errors.email && 'is-danger'}`}
              type="text"
              placeholder="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value:
                    //eslint-disable-next-line
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Invalid email',
                },
              })}
            />
            {errors.email && (
              <p className="helper has-text-danger">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className={`input ${errors.password && 'is-danger'}`}
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Cannot be less than 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="helper has-text-danger">{errors.password.message}</p>
            )}
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-fullwidth is-primary">Login</button>
          </div>
        </div>
        <div className="control mt-3">
          <Link href="/register">
            <button type="button" className="button is-fullwidth is-info">
              Register Now
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
