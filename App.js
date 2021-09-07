import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { chatSocket } from './socketio';
import { ChatScreen } from './screens/chatsScreen';
import { SettingsScreen } from './screens/settingsScreen';
import { purpleBackground } from './styles';
import { LoginScreen } from './screens/loginScreen';
import { RegisterScreen } from './screens/registerScreen';
import { chatListScreen } from './screens/chatListScreen';

const Stack = createStackNavigator();

/*
<message>
    time: sender: message
*/



const App = () => {
    useEffect(()=>{

        chatSocket.on("connect", ()=>{
            console.log("c");
        })
        chatSocket.on("disconnect", ()=>{
            console.log("d");
        })

        chatSocket.on('connect_error', (err) => {
            console.log(err)
        })

        return () => {
            // socket.disconnect()
        }
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: purpleBackground,
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: 'gray'
                },
            }} >
                <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    title: 'Login',
                }}
                />
                <Stack.Screen name="Chats" component={ChatScreen} />
                <Stack.Screen name="ChatsList" component={chatListScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>

        </NavigationContainer>
    );
}



export default App;