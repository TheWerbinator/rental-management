import React from 'react';
import './Header.css';
import glass from '../../assets/magnifying-glass.png'
import logo from '../../assets/logo.png'
import { useRent } from '../../providers/rent_provider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const { loggedIn, changeRoute, openModal, signOut } = useRent();
  return (
    <div className='header-wrapper'>
      <div className='header-search'>
        <img src={glass} alt="search" />
        <p>Search Inventory...</p>
      </div>
      <div className='logo-wrapper' onClick={() => changeRoute('home')}>
        <img src={logo} alt="logo" />
      </div>
      {loggedIn ?
        <div className='header-auth'>
          <p onClick={() => changeRoute('profile')}>Profile</p>
          <p onClick={() => {
            signOut()
            toast.success("Logged Out", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              })
          }}>Sign Out</p>
        </div>
      : 
        <div className='header-auth'>
          <p onClick={() => openModal()}>Sign In</p>
        </div>
      }
    </div>
  );
}

export default Header