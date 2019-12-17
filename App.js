import React from 'react';
import {StyleSheet} from 'react-native';
import Login from './src/Login'
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AdminTimeTableNav from './src/Navigation/AdminTimeTableNav'
import { View } from 'native-base';

export default function App() {
return (
    <AdminTimeTableNav />
);
}