import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { StatusBar } from 'react-native';
import WellCome from './Screen/WellCome';
import AuthNavigator from './navigator/AuthNavigator';

export default function App() {

  const [checkWelcome, setcheckWelcome] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setcheckWelcome(false);
    }, 2000);
    return () => clearTimeout(timeout)
  }, [])

  return (
    <Provider store={store}>
      <StatusBar translucent backgroundColor={"rgba(0,0,0,0.4)"}/>
      {checkWelcome
      ? <WellCome/>
      : <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>}
    </Provider>
  );
}

