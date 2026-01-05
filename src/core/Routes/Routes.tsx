import { AddUser, Admins, Login, NewPassword, Settings, TwoFactor, UserProfile, Users } from "screens"
import ManageHeaderForm from "features/ManageHeader/components/ManageHeaderForm"
import { Route, Routes as ReactRoutes } from "react-router"
import Project from "screens/SafetyReport/SafetyReport"
import Service from "screens/Analytics/Analytics"
import Footer from "screens/UpdateFooter/Footer"
import AboutUs from "screens/AboutUs/AboutUs"
import Team from "screens/AddUser/AddUser"
import { ROUTES } from "constant"
import SignupForm from "features/Authentication/components/SignUp/SignUp"



const Routes = () => {
    return (
        <ReactRoutes>
            <Route path={ROUTES.ADMINS} element={<Admins />} />
            <Route path={ROUTES.USERS} element={<Users />} />
            <Route path={ROUTES.ADD_USER} element={<Team />} />
            <Route path={ROUTES.SAFETY_REPORT} element={<Project />} />
            <Route path={ROUTES.ANALYTICS} element={<Service />} />
            <Route path={ROUTES.FOOTER} element={<Footer />} />
            <Route path={ROUTES.ABOUT} element={<AboutUs />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.SIGNUP} element={<SignupForm />} />

            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.ManageHeader} element={<ManageHeaderForm />} />
            <Route path={ROUTES.TWO_FACTOR} element={<TwoFactor />} />
            <Route path={ROUTES.NEW_PASSWORD} element={<NewPassword />} />

        </ReactRoutes>
    )
}

export default Routes
