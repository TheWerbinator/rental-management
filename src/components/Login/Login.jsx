import React, { useState } from 'react';
import './Login.css';
import x from '../../assets/close.png'
import useRent from '../../providers/rent_provider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { loginModal, setLoginModal, addUser, checkUser } = useRent();

  const [window, setWindow] = useState('login');
  const [errorModal, setErrorModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');

  const submitLogin = async (e) => {
    e.preventDefault();
    if(await checkUser(emailInput, passwordInput) === true) {
      setLoginModal(false)
      toast.success('Logged In', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    } else {
      setErrorModal(true)
      toast.error('Incorrect Login', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }
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
      {window === 'login' ?
        <>
          <img src={x} onClick={() => setLoginModal(false)}></img>
          <form className='login-inputs' onSubmit={(e) => submitLogin(e)}>
            <label>email<input type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/></label>
            <label>password<input type="text" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}/></label>
            <input type='submit' />
          </form>
          <button onClick={() => setWindow('signup')}>Don't have an Account? Sign Up...</button>
        </>
      :
        <>
          <img src={x} onClick={() => setLoginModal(false)}></img>
          <form className='login-inputs' onSubmit={(e) => submitSignup(e)}>
            <label>name<input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)}/></label>
            <label>phone number<input type="text" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)}/></label>
            <label>email<input type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/></label>
            <label>password<input type="text" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}/></label>
            <label>confirm password<input type="text" value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)}/></label>
            <p className={errorModal ? 'submit-error' : 'submit-error hide'} ></p>
            <input type='submit' />
          </form>
          <button onClick={() => setWindow('login')}>Have an Account? Log In...</button>
        </>
      }  
    </div>
  );
}

export default Login;