import { createContext, useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';


const UserContext = createContext();

const UserSession = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState({});
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
      const storedToken = localStorage.getItem('faith-path-access-token')
      const storedProfile = localStorage.getItem('profile');

      setToken(storedToken);

      if(storedToken !== null)
      {
        setIsAuthenticated(true);
      }

      if(storedProfile !== null)
      {
        const parsedProfile= JSON.parse(storedProfile);
        setProfile(parsedProfile);
        setUserId(parsedProfile.userId);
        setIsAdmin(parsedProfile.role === 'admin');
        setIsStudent(parsedProfile.role === 'student');
        setIsVolunteer(parsedProfile.role === 'volunteer');
      }

      setIsLoading(false);
    };

    fetchSession();
  }, []);

  const startSession = (token, profile) => {
      localStorage.setItem('faith-path-access-token', token);
      localStorage.setItem('profile', JSON.stringify(profile));
      setToken(token);
      setProfile(profile);
      setIsAuthenticated(true);
      setFullName('Jason Chen')
      setUserId(profile.userId);
      setIsAdmin(profile.role === 'admin');
      setIsStudent(profile.role === 'student');
      setIsVolunteer(profile.role === 'volunteer');
  };

  const endSession = () => {
    localStorage.removeItem('faith-path-access-token');
    localStorage.removeItem('profile');
    setToken(null);
    setProfile({});
    setIsAuthenticated(false);
    setUserId(null);
    setFullName(null)
    setIsAdmin(false);
    setIsStudent(false);
    setIsVolunteer(false);
  }

  if(isLoading)
  {
    return (
      <UserContext.Provider value={{ token, profile, isAuthenticated, isAdmin, isStudent, isVolunteer, fullName, userId, setFullName, startSession, endSession }}>
        <div className="loader-page">
          <Spinner animation="border"/>
        </div>
      </UserContext.Provider>
    );
  }
  else
  {
    return (
      <UserContext.Provider value={{ token, profile, isAuthenticated, isAdmin, isStudent, isVolunteer, fullName, userId, setFullName, startSession, endSession }}>
        {children}
      </UserContext.Provider>
    );
  }
};
  
export { UserContext, UserSession };
