import React from 'react';
import { useRent } from '../../providers/rent_provider';
import './Home.css';

const Home = () => {
  const { equipment, rentItem, saveItem } = useRent();
  const remainingEquipment = equipment.filter((item) => !item.isRented);
  return (
    <>
      <div className='hero-wrapper'>
        <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcapitalremanexchange.com%2Fwp-content%2Fuploads%2F2017%2F02%2FRental-3-1024x683.jpg&f=1&nofb=1&ipt=a60a93ed07dc5d0bf0e4c8148ef2910ef810e87ee01557b9f0fc20362cc426e1&ipo=images" alt="Equipment Hero Image" />
      </div>
      <div className='equipment-gallery'>
        {equipment.length && remainingEquipment.map((item) => {
          return <div className='equipment-gallery-item' key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="item-btn-wrapper">
              <button onClick={() => rentItem(item)}>Rent</button>
              <button onClick={() => saveItem(item)}>Save for Later</button>
            </div>
          </div>
        })}
      </div>
    </>
  );
}

export default Home;