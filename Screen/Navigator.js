import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import WellCome from './WellCome';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Admin from './Admin';
import Users from './Users';
import Icon from 'react-native-vector-icons/Ionicons';
import ForgotPassword from './ForgotPassword';
import Favourite from './Favourite';
import Notification from './Notification';
import Detail from './Detail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNav({ userId }) { // Nhận userId từ props
  const [favorites, setFavorites] = useState([]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Trang chủ') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Yêu thích') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Thông báo') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Tài khoản') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
      })}>
      <Tab.Screen name="Trang chủ">
        {props => (
          <Home {...props} favorites={favorites} setFavorites={setFavorites} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Yêu thích">
        {props => (
          <Favourite
            {...props}
            favorites={favorites}
            setFavorites={setFavorites}
            userId={userId} // Truyền userId vào đây
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Thông báo" component={Notification} />
      <Tab.Screen name="Tài khoản" component={Users} />
    </Tab.Navigator>
  );
}


function Navigator() {
  //const [user, setUser] = useState(null);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {paddingTop: 0},
        }}
        initialRouteName="WellCome">
        <Stack.Screen name="WellCome" component={WellCome} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="BottomTabNav" component={BottomTabNav} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="Favourite" component={Favourite} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
