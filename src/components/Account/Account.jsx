import React, { useState } from 'react';
import useRent from '../../providers/rent_provider';
import './Account.css';

const Account = () => {
  const { loggedIn, currentUser, equipment, changeRoute, savedForLater, activeRentals, removeRental, removeSaved } = useRent();
  const [accountRoute, setAccountRoute] = useState('rentals');
  
  return (
    <div className='account-wrapper'>
      <div className='account-sidebar'>
        <div className="sidebar-item" onClick={() => setAccountRoute('info')}>
          <h3>Account Details</h3>
        </div>
        <div className="sidebar-item" onClick={() => setAccountRoute('rentals')}>
          <h3>Active Rentals</h3>
        </div>
        <div className="sidebar-item" onClick={() => setAccountRoute('saved')}>
          <h3>Saved for Later</h3>
        </div>
      </div>
      {loggedIn ? 
        <>
          {accountRoute === 'info' ?
            <div className="user-info">
              <h3>User Information</h3>
              
              <p>Name: {currentUser.name}</p>
              <p>Email: {currentUser.email}</p>
              {/* <p>Phone Number: {currentUser.phone}</p> */}
            
              {/* <div>
                {currentUser.payment.name ? 
                  <p>Payment Method: {currentUser.payment.name}</p> :
                  <>
                    <p>No Payment Method On File</p>
                    <button>Add Payment Method</button>
                  </>}
              </div> */}
            </div>
          : accountRoute === 'rentals' ?
            <div className="active-rentals">
              <h2>Active Rentals</h2>
                {activeRentals.map((rental) => {
                  console.log(rental);
                  return <div id={rental.id}>
                    {rental.userEmail === currentUser.email && equipment.map((item) => {
                      return rental.id === item.id &&
                        <div className='account-rental-item' id={item.id}>
                          <h3>{item.name}</h3>
                          <img src={item.image} alt={item.name} />
                          <p>{item.description}</p>
                          <button onClick={() => removeRental(rental.id, item)}>End Rental</button>
                        </div>
                    })}
                    </div>
                })}
            </div>
          : 
            <div className="saved-for-later">
              <h2>Saved for Later</h2>
              {savedForLater.length ? 
                <div className="saved-items-wrapper">
                  {savedForLater.map((savedItem) => {
                    return <div id={savedItem.id}>
                      {savedItem.userId === currentUser.id &&
                        equipment.map((item) => {
                          return savedItem.equipmentId === item.id &&
                            <div className='account-saved-item' id={item.id}>
                              <h3>{item.name}</h3>
                              <img src={item.image} alt={item.name} />
                              <p>{item.description}</p>
                              <button onClick={() => removeSaved(savedItem.id)}>Remove</button>
                            </div>
                        })}
                    </div>
                  })}
                </div> : <p>No equipment in saved for later</p>}
            </div>
          }
        </>
        :
        <div className="not-logged-in">
          You are not logged in...
          <button onClick={() => changeRoute('signIn')}>Sign In</button>
        </div>
      }
    </div>
  );
}

export default Account