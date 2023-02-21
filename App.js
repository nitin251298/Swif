import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Splash from './Pages/Splash';
import FirstPage from './Pages/FirstPage';
import LoginScreen from './Pages/LoginScreen';
import { persistStore } from 'redux-persist';
import { createStore } from 'redux';
import { PersistGate } from 'redux-persist/integration/react'
import reducers from './src/ReduxFloder/Reducer';
import { Provider } from 'react-redux';
import Profile from './Pages/Profile';
import CreateTable from './Pages/CreateTable';
import Dashboard from './Pages/Dashboard';
import Notification from './Pages/Notification';
import Orderlist from './Pages/Orderlist';
import Sync from './Pages/Sync';
import Comment from './Pages/Comment';
import Loader from './Pages/Loader';
import Loading from './Pages/Loading';
import Dashboard2 from './Pages/Dashboard2';
import EditProfile from './Pages/EditProfile';
import SignList from './Pages/SignList';
import FinalSing from './Pages/FinalSing';
import OnboardingStep1 from './Pages/OnboardingStep1';
import OnboardingStep2 from './Pages/OnBoardingStep2';

const store = createStore(reducers);
const persistor = persistStore(store)
const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
    <NavigationContainer>
    <Stack.Navigator initialRouteName="OnboardingStep1"
            screenOptions={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}>
              <Stack.Screen
              name="Splash"
              component={Splash}
              options={{ title: 'Splash', headerShown: false }}
            />
            <Stack.Screen
              name="FirstPage"
              component={FirstPage}
              options={{ title: 'FirstPage', headerShown: false }}
            />
            <Stack.Screen
              name="OnboardingStep1"
              component={OnboardingStep1}
              options={{ title: 'FirstPage', headerShown: false }}
            />
            <Stack.Screen
              name="OnboardingStep2"
              component={OnboardingStep2}
              options={{ title: 'FirstPage', headerShown: false }}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ title: 'LoginScreen', headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ title: 'Profile', headerShown: false }}
            />
            <Stack.Screen
              name="CreateTable"
              component={CreateTable}
              options={{ title: 'CreateTable', headerShown: false }}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ title: 'Dashboard', headerShown: false }}
            />
            <Stack.Screen
              name="Dashboard2"
              component={Dashboard2}
              options={{ title: 'Dashboard', headerShown: false }}
            />
            <Stack.Screen
              name="Notification"
              component={Notification}
              options={{ title: 'Notification', headerShown: false }}
            />
            <Stack.Screen
              name="Orderlist"
              component={Orderlist}
              options={{ title: 'Orderlist', headerShown: false }}
            />
            <Stack.Screen
              name="Sync"
              component={Sync}
              options={{ title: 'Sync', headerShown: false }}
            />
            <Stack.Screen
              name="Comment"
              component={Comment}
              options={{ title: 'Comment', headerShown: false }}
            />
            <Stack.Screen
              name="Loader"
              component={Loader}
              options={{ title: 'Loader', headerShown: false }}
            />
            <Stack.Screen
              name="Loading"
              component={Loading}
              options={{ title: 'Loading', headerShown: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ title: 'EditProfile', headerShown: false }}
            />
            <Stack.Screen
              name="SignList"
              component={SignList}
              options={{ title: 'SignList', headerShown: false }}
            />
            <Stack.Screen
              name="FinalSing"
              component={FinalSing}
              options={{ title: 'FinalSing', headerShown: false }}
            />
            </Stack.Navigator>
  </NavigationContainer>
  </PersistGate>
  </Provider>
  )
}

export default App