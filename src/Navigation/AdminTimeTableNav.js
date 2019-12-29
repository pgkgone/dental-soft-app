import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Main} from './../Main'
import {AdminTimeTable} from "../Screens/AdminTimeTable";
import {AdminDoctorTimeTable} from '../Screens/AdminDoctorTimeTable'
import {DoctorTimeTable} from '../Screens/DoctorTimeTable'
import {Settings} from "../Screens/Settings"
import Login from '../Login';
const MainNavigator = createStackNavigator(
    {
        Main: 
        {
            screen: Main
        },
        AdminTimeTable: 
        {
            screen: AdminTimeTable
        },
        AdminDoctorTimeTable: 
        {
            screen: AdminDoctorTimeTable
        },
        DoctorTimeTable: 
        {
            screen: DoctorTimeTable
        },
        Settings:
        {
            screen : Settings
        },
        Login:
        {
            screen:Login
        }
    
    },
    {
        initialRouteName : 'Login',
    },
);
  
const AdminTimeTableNav = createAppContainer(MainNavigator);
  
export default AdminTimeTableNav;