import { createContext, useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

const UserContext = createContext();

const UserSession = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [fullName, setFullName] = useState('Jason Chen');

  useEffect(() => {
    // Fetch data from API and set it in the state
    // For demonstration purposes, assuming you have a function fetchDataFromApi
    // Replace this with your actual API fetching logic
    const fetchSession = () => {
      const storedToken = sessionStorage.getItem('faith-path-access-token')
      const storedProfile = sessionStorage.getItem('profile');

      if(storedToken !== null)
      {
        setIsAuthenticated(true);
      }

      if(storedProfile !== null)
      {
        const parsedProfile= JSON.parse(storedProfile);
        setUserId(parsedProfile.userId);
        setIsAdmin(parsedProfile.role === 'Admin');
        setIsStudent(parsedProfile.role === 'Student');
        setIsVolunteer(parsedProfile.role === 'Volunteer');
        setFullName(parsedProfile.firstName + ' ' + parsedProfile.lastName);
      }

      setIsLoading(false);
    };

    fetchSession();
  }, []);

  // Update the session data
  const updateSession = (profile) => {
    let currentProfile = JSON.parse(sessionStorage.getItem('profile'));
    let updatedProfile = { ...currentProfile, ...profile };
    sessionStorage.setItem('profile', JSON.stringify(updatedProfile));
    setUserId(updatedProfile.userId);
    setIsAdmin(updatedProfile.role === 'Admin');
    setIsStudent(updatedProfile.role === 'Student');
    setIsVolunteer(updatedProfile.role === 'Volunteer');
    setFullName(updatedProfile.firstName + ' ' + updatedProfile.lastName);
  }

  const startSession = (token, profile) => {
      sessionStorage.setItem('faith-path-access-token', token);
      sessionStorage.setItem('profile', JSON.stringify(profile));
      setIsAuthenticated(true);
      setFullName(profile.firstName + ' ' + profile.lastName);
      setUserId(profile.userId);
      setIsAdmin(profile.role === 'Admin');
      setIsStudent(profile.role === 'Student');
      setIsVolunteer(profile.role === 'Volunteer');
  };

  const endSession = () => {
    sessionStorage.removeItem('faith-path-access-token');
    sessionStorage.removeItem('profile');
    setIsAuthenticated(false);
    setUserId(null);
    setFullName(null)
    setIsAdmin(false);
    setIsStudent(false);
    setIsVolunteer(false);
  }

  const getUserId = () => {
    return userId;
  }

  // If the session data is still being fetched, display a loading indicator
  if(isLoading)
  {
    return (
      <UserContext.Provider value={{ isAuthenticated, isAdmin, isStudent, isVolunteer, fullName, userId, getUserId, setFullName, startSession, updateSession, endSession }}>
        <div className="spinner-div">
          <Spinner animation="border"/>
        </div>
      </UserContext.Provider>
    );
  }
  else
  {
    return (
      <UserContext.Provider value={{ isAuthenticated, isAdmin, isStudent, isVolunteer, fullName, userId, getUserId, setFullName, startSession, updateSession, endSession }}>
        {children}
      </UserContext.Provider>
    );
  }
};
  
export { UserContext, UserSession };
