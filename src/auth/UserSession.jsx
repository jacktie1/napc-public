import { useState, useEffect } from 'react';

var UserSession = (function() {
    var is_authenticated = false;
    var access_token;
    var profile;

    const storedToken = localStorage.getItem('faith-path-access-token');
    const storedProfile = localStorage.getItem('profile');

    // Validate token with the server and set isAuthenticated accordingly
    // ...
    access_token = storedToken;
    is_authenticated = (storedToken !== null);
    profile = JSON.parse(storedProfile);
  
    var isAuthenticated = function() {
      return is_authenticated;
    };

    var startSession = function(token, profile) {
        localStorage.setItem('faith-path-access-token', token);
        localStorage.setItem('role', JSON.stringify(profile));
    };

    var isAdmin = function() {
        return (profile.role === 'admin')
    }

    var isStudent = function(token, profile) {
        return (profile.role === 'student')
    }

    var isVolunteer = function(token, profile) {
        return (profile.role === 'volunteer')
    }
  
    return {
      isAuthenticated: isAuthenticated,
      startSession: startSession,
      isAdmin: isAdmin,
      isStudent: isStudent,
      isVolunteer: isVolunteer,
    }
  })();
  
  export default UserSession;