import React, { useState } from 'react';
import { useRent } from '../../providers/rent_provider';
import './Home.css';
import x from '../../assets/close.png'
import bookmark from '../../assets/bookmark.png'

const Home = () => {
  const { currentUser, equipment, rentItem, saveItem, savedForLater, searchText, loggedIn, loginModalSwitch, setAuthModalType } = useRent();
  const remainingEquipment = equipment.filter((item) => !item.isRented);
  const [productModal, setProductModal] = useState(false)
  const [currentItem, setCurrentItem] = useState({})

  return (
    <>
      <div className='hero-wrapper'>
        <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcapitalremanexchange.com%2Fwp-content%2Fuploads%2F2017%2F02%2FRental-3-1024x683.jpg&f=1&nofb=1&ipt=a60a93ed07dc5d0bf0e4c8148ef2910ef810e87ee01557b9f0fc20362cc426e1&ipo=images" alt="Equipment Hero Image" />
      </div>
      <h2>Available Equipment</h2>
      <div className='equipment-gallery'>
        {equipment.length && remainingEquipment.map((item) => {
          let bookmarkClass = '';
          if(currentUser !== null && savedForLater.filter((savedItem) => savedItem.userId === currentUser.id && savedItem.equipmentId === item.id).length) {
            bookmarkClass = 'bookmark'
          } else bookmarkClass = 'bookmark hidden'
          if(item.name.toLowerCase().includes(searchText)) {
            return <div className='equipment-gallery-item' key={item.id}>
              <img className={bookmarkClass} src={bookmark} alt="bookmark" />
              <h3>{item.name}</h3>
              <img src={item.image} alt={item.name} onClick={() => {
                setProductModal(true)
                setCurrentItem(item)
              }}/>
              <button onClick={() => {
                setProductModal(true)
                setCurrentItem(item)
              }}>More Info</button>
            </div>
          }
        })}
      </div>
      {productModal && 
        <div className="product-modal">
          <img src={x} onClick={() => setProductModal(false)}></img>
          <h3>{currentItem.name}</h3>
          <img className='product-image' src={currentItem.image} alt={currentItem.name} />
          <p>{currentItem.description}</p>
          <div className="item-btn-wrapper">
            <button onClick={() => {
              if(loggedIn) {
                setProductModal(false)
                rentItem(currentItem)
              } else {
                setAuthModalType('signin')
                setProductModal(false)
                loginModalSwitch()
              }
            }}>Rent</button>
            
            {currentUser !== null && savedForLater.filter((item) => {
                if(item.userId === currentUser.id && 
                item.equipmentId === currentItem.id){ 
                  return item 
                }
              }).length ? 
                <h3 className='saved-notice'>Item Already Saved</h3>
              : <button onClick={() => {
                if(loggedIn) {
                    saveItem(currentItem)
                  } else {
                    setAuthModalType('signin')
                    setProductModal(false)
                    loginModalSwitch()
                  }
              }}>Save for Later</button>
            }
          </div>
        </div>
      }
    </>
  );
}

export default Home;