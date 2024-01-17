import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from '../auth/UserSession'

import NoFoundPage from '../pages/NoFoundPage'

import LoginPage from '../pages/LoginPage'
import PasswordResetPage from '../pages/PasswordResetPage'

import SignupOptionPage from '../pages/SignupOptionPage'
import SignupStudentPage from '../pages/SignupStudentPage'
import SignupVolunteerPage from '../pages/SignupVolunteerPage'

import AnnouncementPage from './../pages/AnnouncementPage'
import StudentAirportPickupAssignmentPage from '../pages/StudentAirportPickupAssignmentPage'
import StudentTempHousingAssignmentPage from '../pages/StudentTempHousingAssignmentPage'
import StudentProfilePage from '../pages/StudentProfilePage'
import StudentFlightInfoPage from '../pages/StudentFlightInfoPage'
import StudentTempHousingPage from '../pages/StudentTempHousingPage'
import StudentCommentPage from '../pages/StudentCommentPage'

import VolunteerAgreementPage from '../pages/VolunteerAgreementPage'
import VolunteerPickupNeedsPage from '../pages/VolunteerPickupNeedsPage'
import VolunteerAirportPickupAssignmentPage from '../pages/VolunteerAirportPickupAssignmentPage'
import VolunteerTempHousingAssignmentPage from '../pages/VolunteerTempHousingAssignmentPage'
import VolunteerProfilePage from '../pages/VolunteerProfilePage'
import VolunteerHousingCapacityPage from '../pages/VolunteerHousingCapacityPage'
import VolunteerPickupCapacityPage from '../pages/VolunteerPickupCapacityPage'

import ManageAnnouncementPage from '../pages/ManageAnnouncementPage'
import AdminProfilePage from '../pages/AdminProfilePage'
import ManageStudentsPage from '../pages/ManageStudentsPage'
import ManageVolunteersPage from '../pages/ManageVolunteersPage'
import ManageAirportPickupStudentsPage from '../pages/ManageAirportPickupStudentsPage'
import ManageAirportPickupVolunteersPage from '../pages/ManageAirportPickupVolunteersPage'
import ManageTempHousingStudentsPage from '../pages/ManageTempHousingStudentsPage'
import ManageTempHousingVolunteersPage from '../pages/ManageTempHousingVolunteersPage'
import ExportStudentsPage from '../pages/ExportStudentsPage'
import ExportVolunteers from '../pages/ExportVolunteers'

const CustomRouter = () => {
    const {isAuthenticated, isAdmin, isStudent, isVolunteer} = useContext(UserContext)

    if (isAuthenticated)
    {
        if(isVolunteer)
        {
            return (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<VolunteerPickupNeedsPage />} />
                        <Route path="/volunteer/agreement" element={<VolunteerAgreementPage />} />
                        <Route path="/volunteer/home" element={<VolunteerPickupNeedsPage />} />
                        <Route path="/volunteer/airport-pickup-assignment" element={<VolunteerAirportPickupAssignmentPage />} />
                        <Route path="/volunteer/temp-housing-assignment" element={<VolunteerTempHousingAssignmentPage />} />
                        <Route path="/volunteer/airport-pickup-needs" element={<VolunteerPickupNeedsPage />} />
                        <Route path="/volunteer/profile" element={<VolunteerProfilePage />} />
                        <Route path="/volunteer/airport-pickup" element={<VolunteerPickupCapacityPage />} />
                        <Route path="/volunteer/temp-housing" element={<VolunteerHousingCapacityPage />} />
                        <Route path="/login" element={<VolunteerPickupNeedsPage />} />
                        <Route path="*"  element={<NoFoundPage />}/>
                    </Routes>
                </BrowserRouter>
                );
        }
        else if(isStudent)
        {
            return (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<StudentAirportPickupAssignmentPage />} />
                        <Route path="/student/announcement" element={<AnnouncementPage />} />
                        <Route path="/student/home" element={<StudentAirportPickupAssignmentPage />} />
                        <Route path="/student/airport-pickup-assignment" element={<StudentAirportPickupAssignmentPage />} />
                        <Route path="/student/temp-housing-assignment" element={<StudentTempHousingAssignmentPage />} />
                        <Route path="/student/profile" element={<StudentProfilePage />} />
                        <Route path="/student/flight-info" element={<StudentFlightInfoPage />} />
                        <Route path="/student/temp-housing" element={<StudentTempHousingPage />} />
                        <Route path="/student/comment" element={<StudentCommentPage />} />
                        <Route path="/login" element={<StudentAirportPickupAssignmentPage />} />
                        <Route path="*"  element={<NoFoundPage />}/>
                    </Routes>
                </BrowserRouter>
                );
        }
        else if(isAdmin)
        {
            return (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<ManageAnnouncementPage />} />
                        <Route path="/admin/manage-announcement" element={<ManageAnnouncementPage />} />
                        <Route path="/admin/home" element={<ManageAnnouncementPage />} />
                        <Route path="/admin/manage-students" element={<ManageStudentsPage />} />
                        <Route path="/admin/manage-volunteers" element={<ManageVolunteersPage />} />
                        <Route path="/admin/airport-pickup-students" element={<ManageAirportPickupStudentsPage />} />
                        <Route path="/admin/airport-pickup-volunteers" element={<ManageAirportPickupVolunteersPage />} />
                        <Route path="/admin/temp-housing-students" element={<ManageTempHousingStudentsPage />} />
                        <Route path="/admin/temp-housing-volunteers" element={<ManageTempHousingVolunteersPage />} />
                        <Route path="/admin/export-students" element={<ExportStudentsPage />} />
                        <Route path="/admin/export-volunteers" element={<ExportVolunteers />} />
                        <Route path="/admin/profile" element={<AdminProfilePage />} />
                        <Route path="/login" element={<ManageAnnouncementPage />} />
                        <Route path="*"  element={<NoFoundPage />}/>
                    </Routes>
                </BrowserRouter>
                );
        }
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