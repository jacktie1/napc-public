import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserSession from '../auth/UserSession'
import LoginPage from '../pages/LoginPage'
import SignupOptionPage from '../pages/SignupOptionPage'
import SignupStudentPage from '../pages/SignupStudentPage'
import SignupVolunteerPage from '../pages/SignupVolunteerPage'
import PasswordResetPage from '../pages/PasswordResetPage'
import NoFoundPage from '../pages/NoFoundPage'
import HomePage from './../pages/HomePage'


const CustomRouter = () => {
    if (UserSession.isAuthenticated())
    {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<HomePage />} />
                    <Route path="*"  element={<NoFoundPage />}/>
                </Routes>
            </BrowserRouter>
            );
    }
    else
    {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup/option" element={<SignupOptionPage />} />
                    <Route path="/signup/student" element={<SignupStudentPage />} />
                    <Route path="/signup/volunteer" element={<SignupVolunteerPage />} />
                    <Route path="/password/reset" element={<PasswordResetPage />} />
                    <Route path="*"  element={<LoginPage />}/>
                </Routes>
            </BrowserRouter>
            );
    }
};

export default CustomRouter;