import React from 'react';
import useRent from '../../providers/rent_provider';
import './Profile.css';

const Profile = () => {
  const { loggedIn, currentUser, equipment, changeRoute, savedForLater, activeRentals, removeRental, removeSaved } = useRent();
  return (
    <div className='profile-wrapper'>
      {loggedIn ? 
        <>
          <div className="user-info">
            <p>User Information</p>
            <div>
              <p>Name: {currentUser.name}</p>
            </div>
            <div>
              <p>Email: {currentUser.email}</p>
            </div>
            <div>
              <p>Phone Number: {currentUser.phone}</p>
            </div>
            <div>
              {currentUser.payment.name ? 
                <p>Payment Method: {currentUser.payment.name}</p> :
                <>
                  <p>No Payment Method On File</p>
                  <button>Add Payment Method</button>
                </>}
            </div>
          </div>
          <div className="active-rentals">
            <h2>Active Rentals</h2>
            {activeRentals.filter((entry) => entry.userId === currentUser.id).length ? 
              <div className="active-rental-wrapper">
                {activeRentals.map((rental) => {
                  return rental.userId === currentUser.id &&
                    equipment.map((item) => {
                      return rental.equipmentId === item.id &&
                        <div className='profile-rental-item' id={rental.id}>
                          <h3>{item.name}</h3>
                          <img src={item.image} alt={item.name} />
                          <p>{item.description}</p>
                          <button onClick={() => removeRental(rental.id, item)}>End Rental</button>
                        </div>
                    })
                })}
              </div> : <p>No equipment in saved for later</p>}
          </div>
          <div className="saved-for-later">
            <h2>Saved for Later</h2>
            {savedForLater.filter((entry) => entry.userId === currentUser.id).length ? 
              <div className="saved-items-wrapper">
                {savedForLater.map((savedItem) => {
                  return savedItem.userId === currentUser.id &&
                    equipment.map((item) => {
                      return savedItem.equipmentId === item.id &&
                        <div className='profile-saved-item' id={savedItem.id}>
                          <h3>{item.name}</h3>
                          <img src={item.image} alt={item.name} />
                          <p>{item.description}</p>
                          <button onClick={() => removeSaved(savedItem.id)}>Remove</button>
                        </div>
                    })
                })}
              </div> : <p>No equipment in saved for later</p>}
          </div>
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

export default Profile