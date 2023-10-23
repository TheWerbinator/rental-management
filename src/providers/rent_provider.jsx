import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  useMemo
} from 'react';

const RentContext = createContext({});

// eslint-disable-next-line react/prop-types
export const RentProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [equipment, setEquipment] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [route, setRoute] = useState('home');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('login');
  const [searchText, setSearchText] = useState('');

  const renderChecker = useRef(true);
  // const userChecker = useRef(false);

  const getDb = async (url) => {
    const options = {
      method: 'GET',
      // mode: "cors",
      // credentials: "omit",
      // headers: {
      //   "Content-Type": "application/json"
      // }
    }
    try {
      const response = await fetch(url, options).then((res) => res.json());
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    if (renderChecker.current) {
      getDb(`http://localhost:3000/equipment`).then((result) => {
        setEquipment(result);
      });

      let localUser = localStorage.getItem('user');
      if (localUser !== null && localUser !== 'undefined') {
        const newestAddition = {
          email: localUser.email,
          password: localUser.passwordHash
        }
        console.log(newestAddition);
        await fetch(`http://localhost:3000/auth/login`, {
          method: 'POST',
          body: JSON.stringify(newestAddition),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
          // mode: "cors",
          // credentials: "include",
        }).then(() => {
          setCurrentUser(JSON.parse(localUser));
          setLoggedIn(true);
        })
        
      }
    }

    renderChecker.current = false;
  }, []);

  useEffect(() => {
    if (currentUser.email) {
      getDb(`http://localhost:3000/saved/${currentUser.email}`).then((result) => {
        setSavedForLater(result);
      })
      getDb(`http://localhost:3000/rentals/${currentUser.email}`).then((result) => {
        setActiveRentals(result);
      })
    }
    
    // userChecker.current = true;
  }, [currentUser])

  const rentItem = async (item) => {
    if (loggedIn) {
      await addActiveRental(item, currentUser.id);
    } else setLoginModal(true);
  };

  const addActiveRental = async (item, userEmail) => {
    const newestAddition = {
      userId: userEmail,
      equipmentId: item.id,
    };
    try {
      await fetch(`http://localhost:3000/rentals`, {
        method: 'POST',
        body: JSON.stringify(newestAddition),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        // mode: "cors",
        // credentials: "include",
      });
      await fetch(`http://localhost:3000/equipment/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          isRented: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        // mode: "cors",
        // credentials: "include",
      });
      await getDb('http://localhost:3000/rentals').then((result) => {
        setActiveRentals(result);
      });
      await getDb('http://localhost:3000/equipment').then((result) => {
        setEquipment(result);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const saveItem = (item) => {
    if (loggedIn) {
      addSavedForLater(item, currentUser.email);
    } else setLoginModal(true);
  };

  const addSavedForLater = async (item, email) => {
    const newestAddition = {
      userEmail: email,
      rentalId: item.id,
    };
    try {
      await fetch(`http://localhost:3000/saved`, {
        method: 'POST',
        body: JSON.stringify(newestAddition),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        // mode: "cors",
        // credentials: "include",
      });
      await getDb(`http://localhost:3000/saved/${currentUser.email}`).then(
        (result) => {
          setSavedForLater(result);
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const changeRoute = (route) => {
    setRoute(route);
  };

  const loginModalSwitch = () => {
    loginModal === false ? setLoginModal(true) : setLoginModal(false);
  };

  const signOut = () => {
    setCurrentUser({});
    setRoute('home');
    setLoggedIn(false);
    localStorage.removeItem('user');
  };

  const removeRental = async (rentalId, item) => {
    try {
      await fetch(`http://localhost:3000/rentals/${rentalId}`, {
        method: 'DELETE',
        // mode: "cors",
        // credentials: "include",
      });
      await fetch(`http://localhost:3000/equipment/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          isRented: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        // mode: "cors",
        // credentials: "include",
      });
      await getDb('http://localhost:3000/activeRentals').then((result) => {
        setActiveRentals(result);
      });
      await getDb('http://localhost:3000/equipment').then((result) => {
        setEquipment(result);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const removeSaved = async (savedId) => {
    try {
      await fetch(`http://localhost:3000/saved/${savedId}`, {
        method: 'DELETE',
        // mode: "cors",
        // credentials: "include",
      });
      await getDb('http://localhost:3000/saved').then((result) => {
        setSavedForLater(result);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const registerFetch = async (user) => {
    try {
      await fetch(`http://localhost:3000/users`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        // mode: "cors",
        // credentials: "include",
      });
      let userInQuestion = [];
      await usersFetch().then((response) => {
        userInQuestion = response.filter((fetchedUser) => {
          if (
            user.email === fetchedUser.email &&
            user.password === fetchedUser.password
          ) {
            return user;
          }
        })[0];
      });
      return userInQuestion;
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = async (name, phone, email, password) => {
    let newestAddition = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      payment: {
        nameOnCard: '',
        cardNumber: '',
        exp: '',
        securityCode: '',
      },
    };
    await registerFetch(newestAddition).then((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setLoggedIn(true);
    });
  };

  // const userFetch = async (email, pw) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/users/${email}`).then(res => res.json());
  //     return response
  //   } catch (error) {
  //     console.error(error)
  //   }
  // };

  const checkUser = async (email, pw) => {
    await userFetch(email, pw).then((user) => {
      if (user.email === email) {
        setCurrentUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        setLoggedIn(true)
        loginModalSwitch()
        return true
      } else return false
    })
  };

  return (
    <RentContext.Provider
      value={{
        loginModal,
        setLoginModal,
        currentUser,
        addUser,
        checkUser,
        loggedIn,
        route,
        changeRoute,
        signOut,
        loginModalSwitch,
        equipment,
        saveItem,
        rentItem,
        savedForLater,
        removeSaved,
        activeRentals,
        removeRental,
        searchText,
        setSearchText,
        authModalType,
        setAuthModalType,
      }}
    >
      {children}
    </RentContext.Provider>
  );
};

export const useRent = () => {
  const context = useContext(RentContext);
  return {
    loginModal: context.loginModal,
    setLoginModal: context.setLoginModal,
    currentUser: context.currentUser,
    addUser: context.addUser,
    checkUser: context.checkUser,
    loggedIn: context.loggedIn,
    route: context.route,
    changeRoute: context.changeRoute,
    signOut: context.signOut,
    loginModalSwitch: context.loginModalSwitch,
    equipment: context.equipment,
    saveItem: context.saveItem,
    rentItem: context.rentItem,
    savedForLater: context.savedForLater,
    removeSaved: context.removeSaved,
    activeRentals: context.activeRentals,
    removeRental: context.removeRental,
    searchText: context.searchText,
    setSearchText: context.setSearchText,
    authModalType: context.authModalType,
    setAuthModalType: context.setAuthModalType,
  };
};

export default useRent;
