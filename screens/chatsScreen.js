import { StatusBar } from "react-native"
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Button } from 'react-native';
import { chatSocket } from '../socketio';
import '../socketio'
import { purpleBackground } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';



const styles = StyleSheet.create({
    settingsButton: {
        position: "absolute",
        top: 0,
        right: 35,
        textAlign: "right"
    },
    timeText: {
        fontSize: 11,
        
        color: "gray"
    },
    senderText: {
        color: "rgb(119, 190, 119)"
    },

    adminSenderText: {
        color: "red"
    },
    messageText: {
        color: "rgb(106, 154, 172)"
    },
    messageContainer: {
        padding: 8,
        flexDirection: "row"
    },  

    keyboardContainer: {
        marginLeft: 10,
        marginBottom: 30,
        // flex: 1,
        backgroundColor: "transparent",
        marginRight: 10,
    },
    keyboard: {
        borderRadius: 8,
        color: "white",
        overflow: "visible",
        
        paddingLeft: 6,
        backgroundColor: "purple",
    },
    content: {
        // paddingTop: 50,
        padding: 0,
        margin: 0,
        justifyContent: "center",
        alignItems: "stretch",
        flex: 1,
    },
    background: {
        backgroundColor: purpleBackground,
        justifyContent: "center",
        height: "100%"
    },
    white: {
        color: "#fff",
        padding: 6,
        flex: 1,
    },
    container: {
        flex: 1,
        //marginTop: 40,
        color: "white",
    },
    hidden: {
        position: "absolute",
        top: 1000,
        left: 1000
    },
});

const CustomTextInput = () => {
    const [text, setText] = useState("");
    const [height, setHeight] = useState(25)
    
    return (
        <View style={[styles.keyboardContainer, {height: height}]}>
            <TextInput
            value={text}
            blurOnSubmit={false}
            style={[styles.keyboard, {height: height}]}
            onChangeText={(text)=>{
                setText(text)
            }}
            // multiline
            // enablesReturnKeyAutomatically={true}
            returnKeyType='done'
            onSubmitEditing={(e)=>{
                chatSocket.emit("sent-message", {
                    message: e.nativeEvent.text,
                    sender: global.clientID.user,
                    time: new Date().getTime()
                })
                setText("")
            }}
            />
            <Text style={styles.hidden} onLayout={(e)=>{
                var h = e.nativeEvent.layout.height;
                h = h >= 25 ? h : 25
                setHeight(h)
            }}>{text}</Text>
        </View>
    )
}

class Chat extends React.PureComponent {

    constructor(props) {
        super(props)
        this.props = props;
    }

    render() {

        var style = "senderText"
        // if (this.props.sender == "Admin") {
        //     style = "adminSenderText"
        // }
    
        return (
            <View style={styles.messageContainer}>
                {/* <Text style={styles.timeText}>{new Date(props.time).toLocaleString()}: </Text> */}
                <Text style={styles[style]}>&lt;{this.props.sender}&gt;</Text>
                <Text style={styles.messageText}> {this.props.message}</Text>
                </View>
        )
    }
}

class Chats extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            chats: [],
            toScroll: 1,
            scrollToEnd: true,
        }
        this.props = props;
    }

    componentDidMount() {
        chatSocket.on("all-messages", (messages)=>this.setState({chats:messages}))

        // chatSocket.emit("req-all-messages")

        chatSocket.on("load-messages-count-res", (mes)=>{
            this.setState({chats: [...mes, ...this.state.chats]})
        })

        chatSocket.emit("load-messages-count", -30, -1)

        chatSocket.on("chat-message", (message) => {
            this.setState({chats: this.state.chats.concat([message]), scrollToEnd: true})
        });
    } 

    loadMoreChats(e) {
        if(e.nativeEvent.contentOffset.y < 10) {
            // alert("loading more messages")
            // alert(-(this.state.toScroll + 10) + ":" + (-this.state.toScroll - 1))
            chatSocket.emit("load-messages-count", -(this.state.toScroll + 30), -this.state.toScroll - 1)
            this.setState({toScroll: this.state.toScroll + 30})
        }
    }

    render() {
        return (
            <FlatList 
            onScrollEndDrag={this.loadMoreChats.bind(this)}
            data={this.state.chats}
            renderItem={(chat)=> {
                return <Chat sender={chat.item.sender} time={chat.item.time} message={chat.item.message} />
            }}
            keyExtractor={(item, index)=>index}
            ref={ref => {this.scrollView = ref}}
            onContentSizeChange={()=>{
                // console.log(this.state.scrollToEnd);
                if (this.state.scrollToEnd) {
                    this.scrollView.scrollToEnd({animated: false})
                    this.setState({ scrollToEnd: false })
                } 
            }}
            />
        )
    }
}

const PeopleOnline = (props) => {
    const [peopleOnline, setPeopleOnline] = useState(0)

    useEffect(()=>{
        chatSocket.on("people-online", (number)=>{
            // console.log(number);
            setPeopleOnline(number)
        })
    },[])

    return (
        <Text>{peopleOnline}</Text>
    )
}



export const ChatScreen = ({ navigation }) => {
    return (
        <View style={styles.background}>
            <Button 
            style={styles.settingsButton}
            title="Logout"
            onPress={ async ()=>{
                

                global.clientID.userID = "expired";
                await AsyncStorage.setItem("username", "");
                await AsyncStorage.setItem("password", "");

                navigation.replace("Login")

            }}
            />
            <KeyboardAvoidingView
                keyboardVerticalOffset={useHeaderHeight() } style={styles.content} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Chats />
                    </TouchableWithoutFeedback>
                </View>
                <CustomTextInput />
            </KeyboardAvoidingView>
            <StatusBar style="auto" />
        </View>
    )
}