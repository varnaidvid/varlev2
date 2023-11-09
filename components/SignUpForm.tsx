'use client';

import { signIn } from 'next-auth/react';
import { ChangeEvent, MouseEvent, useState } from 'react';

/* eslint-disable jsx-a11y/label-has-associated-control */
const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleInputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmitted = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      return;
    }

    signIn(undefined, { callbackUrl: '/' });
  };

  return (
    <div className="border border-gray-300 p-6 pb-10 rounded-2xl shadow-lg">
      <form className="flex flex-col gap-8 w-1/2 ml-auto mr-auto pt-4">
        <h3 className="text-center font-bold text-2xl">Sign Up</h3>
        <div className="flex items-center justify-between">
          <label htmlFor="email" className="flex-1 text-base">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="shadow-inner p-4 px-8 text-sm text-gray-500 border border-gray-300 rounded-2xl outline-none flex-1"
            value={formData.email}
            onChange={handleInputChanged}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="flex-1 text-base">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="shadow-inner p-4 px-8 text-sm text-gray-500 border border-gray-300 rounded-2xl outline-none flex-1"
            value={formData.password}
            onChange={handleInputChanged}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="passwordConfirm" className="flex-1 text-base">
            Confirm Password
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            className="shadow-inner p-4 px-8 text-sm text-gray-500 border border-gray-300 rounded-2xl outline-none flex-1"
            value={formData.passwordConfirm}
            onChange={handleInputChanged}
          />
        </div>
        <button
          type="button"
          className="p-4 px-8 bg-green-500 text-white rounded-2xl shadow-md"
          onClick={handleFormSubmitted}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
