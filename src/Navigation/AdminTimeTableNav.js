import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Main} from './../Main'
import {AdminTimeTable} from "../Components/AdminTimeTable";
import {AdminDoctorTimeTable} from '../Components/AdminDoctorTimeTable'

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
        }
    },
    {
        initialRouteName : 'Main',
        headerLayoutPreset: 'center'
    }
);
  
const AdminTimeTableNav = createAppContainer(MainNavigator);
  
export default AdminTimeTableNav;