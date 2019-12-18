import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Main} from './../Main'
import {AdminTimeTable} from "../Screens/AdminTimeTable";
import {AdminDoctorTimeTable} from '../Screens/AdminDoctorTimeTable'
import {DoctorTimeTable} from '../Screens/DoctorTimeTable'

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
        }
    },
    {
        initialRouteName : 'Main',
        headerLayoutPreset: 'center'
    }
);
  
const AdminTimeTableNav = createAppContainer(MainNavigator);
  
export default AdminTimeTableNav;