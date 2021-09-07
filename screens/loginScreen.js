import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, Button } from 'react-native';
import { accountSocket } from '../socketio';
import "../socketio"
import { purpleBackground } from '../styles';

import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: purpleBackground,
        justifyContent: "flex-start",
        alignContent: "space-around"
    },
    input: {
        // flex: 1,
        margin: 20,
        padding: 5,
        borderRadius: 6,
        backgroundColor: "white"
    },
    label: {
        // flex: 1.
        color: "white"
    },
    errorMessage: {
        color: "red",
        textAlign: "center",
        margin: 12,
    },
    buttons: {
        // flex: 1,
        flexDirection: "row",
        marginTop: 60,
        justifyContent: "center"
    },
    button: {

    }
})

export class LoginScreen extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        
        this.state = {
            username: "",
            password: "",
            errorMessage: "",
        }
    }
    
    loginSubmit() {
        this.setState({errorMessage: "Logging in. Please Wait."})
        accountSocket.emit("auth-user", this.state.username, this.state.password)
    }

    async componentDidMount() {
        

        accountSocket.on("auth-user-res", async (res)=>{
            if(res) {
                global.clientID = res
                await AsyncStorage.setItem("username", res.user)
                await AsyncStorage.setItem("password", this.state.password)
                
                this.props.navigation.replace("Chats")
            } else {
                this.setState({ errorMessage: "Error logging in. Check username and password." })
            }
        });

        var username = await AsyncStorage.getItem("username")
        var password = await AsyncStorage.getItem("password")
        console.log(username, password);

        if (username) {
            this.setState({username: username, errorMessage: "Logging in. Please Wait."})
            
            accountSocket.emit("auth-user", username, password)
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                    <Text style={styles.label} >Username: </Text>
                    <TextInput style={styles.input} onChangeText={(text)=>this.setState({username: text})} value={this.state.username} autoCorrect={false} autoCapitalize={"none"} />
                    <Text style={styles.label} >Password: </Text>
                    <TextInput style={styles.input} onChangeText={(text)=>this.setState({password: text})} value={this.state.password} onSubmitEditing={this.loginSubmit.bind(this)} blurOnSubmit secureTextEntry />
        
                    <View style={styles.buttons}>
                        <Button title="Register" onPress={()=>this.props.navigation.navigate("Register")}></Button>
                        <Button title="Login" onPress={this.loginSubmit.bind(this)}></Button>
                    </View>
                </View>   
            </TouchableWithoutFeedback>
        )
    }
}