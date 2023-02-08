import React, { useState, useEffect, createContext, useContext } from 'react';

const RentContext = createContext({});

// eslint-disable-next-line react/prop-types
export const RentProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState({});
  const [equipment, setEquipment] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [route, setRoute] = useState('home');
  const [loggedIn, setLoggedIn] = useState(false);
  const [modalState, setModalState] = useState(false);

  const fetchDb = async (url) => {
    try {
      const response = await fetch(url)
      const jsonResponse = await response.json()
      return jsonResponse;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDb('http://localhost:3000/equipment').then(result => {
      setEquipment(result);
    });
    fetchDb('http://localhost:3000/savedForLater').then(result => {
      setSavedForLater(result);
    });
    fetchDb('http://localhost:3000/activeRentals').then(result => {
      setActiveRentals(result);
    });

    const maybeUser = localStorage.getItem('user');
    if(maybeUser) {
      setCurrentUser(JSON.parse(maybeUser))
      setLoggedIn(true)
    }
  }, []);

  const rentItem = (item) => {
    if(loggedIn) {
      addActiveRental(item, currentUser.id);
    } else setModalState(true);
  }

  const addActiveRental = async (item, idOfUser) => {
    const newestAddition = {
      userId: idOfUser,
      equipmentId: item.id,
    }
    try {
      await fetch(`http://localhost:3000/activeRentals`, { 
        method: 'POST', 
        body: JSON.stringify(newestAddition),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      await fetch(`http://localhost:3000/equipment/${item.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          isRented: true,
        }),
      })
      await fetchDb('http://localhost:3000/activeRentals').then(result => {
        setActiveRentals(result);
      })
      await fetchDb('http://localhost:3000/equipment').then(result => {
        setEquipment(result);
      })
    } catch (error) {
      console.error(error);
    }
  }

  const saveItem = (item) => {
    if(loggedIn) {
      addSavedForLater(item, currentUser.id);
    } else setModalState(true);
  }

  const addSavedForLater = async (item, idOfUser) => {
    const newestAddition = {
      userId: idOfUser,
      equipmentId: item.id,
    }
    try {
      await fetch(`http://localhost:3000/savedForLater`, { 
        method: 'POST', 
        body: JSON.stringify(newestAddition),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      await fetchDb('http://localhost:3000/savedForLater').then(result => {
        setSavedForLater(result);
      });
    } catch (error) {
      console.error(error);
    }
  }

  const changeRoute = (route) => {
    setRoute(route)
  }

  const openModal = () => {
    modalState === false ? setModalState(true) : setModalState(false);
  }

  const signOut = () => {
    setCurrentUser({})
    setRoute('home')
    setLoggedIn(false)
    localStorage.removeItem('user')
  }

  const removeRental = async (rentalId, item) => {
    try {
      await fetch(`http://localhost:3000/activeRentals/${rentalId}`, { 
          method: 'DELETE', 
        },
      )
      await fetch(`http://localhost:3000/equipment/${item.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          isRented: false,
        }),
      })
      await fetchDb('http://localhost:3000/activeRentals').then(result => {
        setActiveRentals(result);
      })
      await fetchDb('http://localhost:3000/equipment').then(result => {
        setEquipment(result);
      })
    } catch (error) {
      console.error(error);
    }
  }

  const removeSaved = async (savedId) => {
    try {
      await fetch(`http://localhost:3000/savedForLater/${savedId}`, { 
          method: 'DELETE', 
        },
      )
      await fetchDb('http://localhost:3000/savedForLater').then(result => {
        setSavedForLater(result);
      })
    } catch (error) {
      console.error(error);
    }
  }

  const registerFetch = async () => {
    try {
      await fetch(`http://localhost:3000/users`, { 
        method: 'POST', 
        body: JSON.stringify(newestAddition),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
    } catch (error) {
      console.error(error);
    }
  }

  const addUser = async (email, password) => {
    return await registerFetch(email, password).then((user) => {
      localStorage.setItem('user', JSON.stringify())
      return setCurrentUser(user)
    })
  }

  const usersFetch = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/`);
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error(error);
    }
  }

  const checkUser = async (email, pw) => {
    console.log('checkUser email and password', email, pw);
    const users = await usersFetch();
    const userInQuestion = users.filter((user) => {
      if(user.email === email && user.password === pw) {
        return user
      }
    })
    console.log('fetched user name and password', userInQuestion[0].email, userInQuestion[0].password);
    if(userInQuestion[0].password === pw && userInQuestion.length === 1) {
      setCurrentUser(userInQuestion[0]);
      localStorage.setItem('user', JSON.stringify(userInQuestion[0]))
      setLoggedIn(true);
      return true;
    }
    return false;
  }

  return (
    <RentContext.Provider 
      value={{
        modalState,
        setModalState,
        currentUser,
        addUser,
        checkUser,
        loggedIn,
        route,
        changeRoute,
        signOut,
        openModal,
        equipment,
        saveItem,
        rentItem,
        savedForLater,
        removeSaved,
        activeRentals,
        removeRental
      }}>
      {children}
    </RentContext.Provider>
  )
}

export const useRent = () => {
  const context = useContext(RentContext);
  return {
    modalState: context.modalState,
    setModalState: context.setModalState,
    currentUser: context.currentUser,
    addUser: context.addUser,
    checkUser: context.checkUser,
    loggedIn: context.loggedIn,
    route: context.route,
    changeRoute: context.changeRoute,
    signOut: context.signOut,
    openModal: context.openModal,
    equipment: context.equipment,
    saveItem: context.saveItem,
    rentItem: context.rentItem,
    savedForLater: context.savedForLater,
    removeSaved: context.removeSaved,
    activeRentals: context.activeRentals,
    removeRental: context.removeRental
  }
}

export default useRent