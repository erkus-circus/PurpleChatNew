import React from 'react';
import { StyleSheet, View, Button, ScrollView } from 'react-native';
import '../socketio'

const styles = StyleSheet.create({})

export class MainScreen extends React.Component {
    constructor(props) {
        this.props = props;
    }

    getConversations () {
        // get every conversation then set them 
    }

    render() {
        return (

            // content
            <View>

            {/* new chat button */}
            <Button />

            {/* Chats ScrollView */}
            <ScrollView></ScrollView>
                
            </View>
        )
    }
}