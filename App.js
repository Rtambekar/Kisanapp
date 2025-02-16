import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/screens/LoginPage';
import RegisterPage from './src/screens/RegisterPage';
import ListingPage from './src/screens/ListingPage';
import DetailsPage from './src/screens/DetailsPage';
import './i18n';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Listing" component={ListingPage} />
        <Stack.Screen name="Details" component={DetailsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;