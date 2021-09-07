import * as React from "react";
import { chatSocket } from "../socketio";

export class chatListScreen extends React.Component {
    constructor (props) {
        super(props);

        this.props = props;

        this.state = {
            enrolledChats: []
        }
    }

    render() {

    }

    componentDidMount () {
        chatSocket.emit("get-enrolled-chats", )
    }
}