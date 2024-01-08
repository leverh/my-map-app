import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import MapComponent from './components/MapComponent';
import WelcomePage from './components/WelcomePage';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/map"><button>Map</button></Link>
            <Link to="/signout"><button>Sign Out</button></Link>
          </>
        ) : null}

        <Routes>
          <Route path="/" element={<WelcomePage />} />  {/* WelcomePage as the default route */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/signout" element={<SignOut />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;