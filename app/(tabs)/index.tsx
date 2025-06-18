import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Register from "./login-register/register";

const Stack = createStackNavigator();

function App(){
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Register} />
      </Stack.Navigator>
  )
}

export default App;