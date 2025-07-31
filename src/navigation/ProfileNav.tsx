import { createStackNavigator } from "@react-navigation/stack";
import Perfil from "../screens/Perfil";
import EditProfile from "../screens/EditProfile";

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

export default ProfileStack;