import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, Button } from 'react-native';
import { accountSocket } from '../socketio';
import "../socketio"
import { purpleBackground } from '../styles';

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
    buttons: {
        flex: 1,
        flexDirection: "row",
        marginTop: 60,
        justifyContent: "center"
    },

    errorMessage: {
        color: "red",
        textAlign: "center",
        margin: 12,
    },
    button: {

    }
})

export class RegisterScreen extends React.Component {

    constructor(props) {
        super(props)
        this.props = props;

        this.state = {
            username: "",
            password: "",
            password2: "",
            email: "",
            fullname: "",
            errorMessage: ""
        }
    }

    registerSubmit() {
        // check if the inputs are valid then create the account.
        // after account is created log in.

        if(/[~`!#$%\^&*+@=\-\[\]\\';,/{}|\\":<>\? ]/g.test(this.state.username)) {
            // the username is invalid.
            this.setState({ errorMessage: "Your username cannot contain spaces or special characters." });
            return false;
        }
        if (this.state.password != this.state.password2) {
            // the passwords dont match
            this.setState({ errorMessage: "Password do not match." });
            return false;
        }
    
        if (this.state.password.length < 8) {
            this.setState({ errorMessage: "Your password must be 8 characters long." });
            return false;
        }
    
        // if all is well then create the account.
        // this process is picked up in socket.io event handler
        accountSocket.emit("create-account", this.state.username, this.state.email, this.state.password, this.state.fullname);
    
        this.setState({ errorMessage: "Your account is being created, please wait." });
    }


    componentDidMount() {
        accountSocket.on("create-account-res", (res) => {
            if (!res) {
                // the username already exists
                this.setState({errorMessage: "That username already exists! Try another one."});
                return;
            }

            this.setState({errorMessage: "Your account has been created! Please login."});
            
            // login the user
            this.props.navigation.replace("Login")
        });
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                    <Text style={styles.label} >Username: </Text>
                    <TextInput style={styles.input} onChangeText={(text)=>this.setState({username: text})} value={this.state.username} autoCorrect={false} autoCapitalize={"none"} />
                    <Text style={styles.label} >Email: </Text>
                    <TextInput style={styles.input} onChangeText={(text)=>this.setState({email: text})} value={this.state.email} autoCorrect={false} autoCapitalize={"none"} />

                    <Text style={styles.label} >Full Name: </Text>
                    <TextInput style={styles.input} onChangeText={(text)=>this.setState({fullname: text})} value={this.state.fullname} autoCorrect={false} autoCapitalize={"none"} />

                    <Text style={styles.label} >Password: </Text>
                    <TextInput style={styles.input} onChangeText={(text)=>this.setState({password: text})} value={this.state.password} blurOnSubmit secureTextEntry />
                    <Text style={styles.label} >Confirm Password: </Text>
                    <TextInput style={styles.input} onChangeText={(text)=>this.setState({password2: text})} value={this.state.password2} blurOnSubmit secureTextEntry />

                    <View style={styles.buttons}>
                        <Button title="Register" onPress={this.registerSubmit.bind(this)}></Button>

                    </View>
                </View>   
            </TouchableWithoutFeedback>
        )
    }
}