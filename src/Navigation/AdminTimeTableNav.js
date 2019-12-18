import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Main} from './../Main'
import {AdminTimeTable} from "../Components/AdminTimeTable";
import {AdminDoctorTimeTable} from '../Components/AdminDoctorTimeTable'
import {DoctorTimeTable} from '../Components/DoctorTimeTable'

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