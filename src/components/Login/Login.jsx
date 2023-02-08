import React, { useState } from 'react';
import './Login.css';
import x from '../../assets/close.png'
import useRent from '../../providers/rent_provider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { modalState, setModalState, addUser, checkUser } = useRent();

  const [window, setWindow] = useState('login');
  const [errorModal, setErrorModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');

  const submitLogin = (e) => {
    e.preventDefault();
    if(checkUser(e.target[0].value, e.target[1].value)) {
      setModalState(false)
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
      console.log('check user returned true');
    } else {
      setErrorModal(true)
      toast.error('Error Logging In, Please Try Again', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      console.log('check user returned false');
    }
  }

  const submitSignup = (e) => {
    e.preventDefault();
    if(e.target[1].value !== e.target[2].value) {
      setErrorModal(true)
    } else {
      setErrorModal(false)
      addUser(e.target[0].value, e.target[1].value)
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
    <div className={modalState ? 'login-modal' : 'login-modal hide'}>
      {window === 'login' ?
        <>
          <img src={x} onClick={() => setModalState(false)}></img>
          <form className='login-inputs' onSubmit={(e) => submitLogin(e)}>
            <label>email<input type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/></label>
            <label>password<input type="text" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}/></label>
            <input type='submit' />
          </form>
          <button onClick={() => setWindow('signup')}>Don't have an Account? Sign Up...</button>
        </>
      :
        <>
          <img src={x} onClick={() => setModalState(false)}></img>
          <form className='login-inputs' onSubmit={(e) => submitSignup(e)}>
            <label>username<input type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/></label>
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