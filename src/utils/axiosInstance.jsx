import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create();

// Header manipulation for every request
axiosInstance.interceptors.request.use(
  config => {
    // Check if there's a token in localStorage or any other source
    const token = sessionStorage.getItem('faith-path-access-token');

    // If a token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const transactionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0)

    config.headers['X-Transaction-Id'] = transactionId;

    return config;
  },
  error => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Logout the user if the token is expired
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle response errors
    if (error.response && (error.response.status === 401)) {
      // Clear the local session (for example, remove the token)
      sessionStorage.removeItem('faith-path-access-token');
      sessionStorage.removeItem('profile');

      alert('Session expired. Redirecting to login page...');
      
      // Redirect the user to the login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Interceptors to hide or show the spinner overlay
axiosInstance.interceptors.request.use(
  config => {
    // Show loading indicator or block the page
    // For example, display a spinner or overlay
    document.getElementById('loading-indicator').style.display = 'block';
    document.querySelector('.spinner-overlay').style.display = 'flex';
    return config;
  },
  error => {
    document.getElementById('loading-indicator').style.display = 'none';
    document.querySelector('.spinner-overlay').style.display = 'none';
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // Hide loading indicator or unblock the page
    // For example, hide the spinner or overlay
    document.getElementById('loading-indicator').style.display = 'none';
    document.querySelector('.spinner-overlay').style.display = 'none';
    return response;
  },
  error => {
    // Hide loading indicator or unblock the page
    // For example, hide the spinner or overlay
    document.getElementById('loading-indicator').style.display = 'none';
    document.querySelector('.spinner-overlay').style.display = 'none';
    return Promise.reject(error);
  }
);

export default axiosInstance;