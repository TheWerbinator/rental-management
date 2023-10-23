import React, { useState } from 'react';
import './Login.css';
import x from '../../assets/close.png'
import useRent from '../../providers/rent_provider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { loginModal, setLoginModal, addUser, checkUser, authModalType, setAuthModalType } = useRent();

  const [errorModal, setErrorModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');

  const submitLogin = async (e) => {
    e.preventDefault();
    await checkUser(emailInput, passwordInput).then((response) => {
      if (response === true) {
        setLoginModal(false);
        toast.success('Logged In', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else if (response === false) {
        setErrorModal(true);
        toast.error('Incorrect Login', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    });
    
  }

  const submitSignup = async (e) => {
    e.preventDefault();
    if(passwordInput !== confirmInput) {
      setErrorModal(true)
    } else {
      setLoginModal(false)
      setErrorModal(false)
      await addUser(nameInput, phoneInput, emailInput, passwordInput)
        .then(() => {
          toast.success("Registered", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            })
        })
        .catch(() => {
          toast.error("Could not register user", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            })
        })
    }
  }

  return (
    <div className={loginModal ? 'login-modal' : 'login-modal hide'}>
      {authModalType === 'signin' ?
        <>
          <h2>Sign In</h2>
          <img src={x} onClick={() => setLoginModal(false)}></img>
          <form className='login-inputs' onSubmit={(e) => submitLogin(e)}>
            <input placeholder='Email' type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
            <input placeholder='Password' type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}/>
            <input className='submit-btn' type='submit' />
          </form>
          <button onClick={() => setAuthModalType('create')}>Don't have an Account? Sign Up...</button>
        </>
      :
        <>
          <h2>Create Account</h2>
          <img src={x} onClick={() => setLoginModal(false)}></img>
          <form className='login-inputs' onSubmit={(e) => submitSignup(e)}>
            <input placeholder='Name' type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)}/>
            <input placeholder='Phone Number' type="text" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)}/>
            <input placeholder='Email' type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
            <input placeholder='Password' type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}/>
            <input placeholder='Confirm Password' type="password" value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)}/>
            <p className={errorModal ? 'submit-error' : 'submit-error hide'} ></p>
            <input className='submit-btn' type='submit' />
          </form>
          <button onClick={() => setAuthModalType('signin')}>Have an Account? Log In...</button>
        </>
      }
      
      {/* <p onClick={() => {
        localStorage.setItem('user', undefined)
      }}>Create Fake User in LocalStorage</p> */}
    </div>
  );
}

export default Login;