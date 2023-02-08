import React from 'react';
import './App.css'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Profile from './components/Profile/Profile';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import { useRent } from './providers/rent_provider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { route } = useRent();
  return (
    <div className="App">
      <Login />
      <Header />
      {route === 'home' ?
        <Home />
      : route === 'profile' ?
        <Profile />
      : null }
      <Footer />
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"/>
    </div>
  )
}

export default App