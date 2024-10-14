import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Login from '../Screen/Login';
import Register from '../Screen/Register';
import MainNavigator from './MainNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPassword from '../Screen/ForgotPassword';

const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
    
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='Login' component={Login}/>
            <Stack.Screen name='Register' component={Register}/>
            <Stack.Screen name='Main' component={MainNavigator}/>
            <Stack.Screen name='ForgotPassword' component={ForgotPassword}/>
        </Stack.Navigator>
  )
}

export default AuthNavigator

const styles = StyleSheet.create({})