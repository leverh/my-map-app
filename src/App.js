import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import MapComponent from './components/MapComponent';
import WelcomePage from './components/WelcomePage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import 'leaflet/dist/leaflet.css';
import './App.css';

const Navigation = ({ isLoggedIn }) => {
  const location = useLocation();

  return (
    <>
      {isLoggedIn && location.pathname !== "/map" && (
        <Link to="/map"><button className="map-button">Map</button></Link>
      )}
    </>
  );
};

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
        <Navigation isLoggedIn={isLoggedIn} />

        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route 
            path="/signup" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} redirectPath="/map">
                <SignUp />
              </ProtectedRoute>
            } 
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
