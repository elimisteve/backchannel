import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import notifier from 'node-notifier';

import MessageList from './MessageList';
import Throbber from '../general/Throbber';

import { playNotification } from '../../utils/audio';

class MessageBox extends Component {
  componentDidUpdate(prevProps){
    if (this.shouldScroll(prevProps)){
      this.scrollToBottom();
    }
  }

  shouldScroll(prevProps){
    let hasNewMessages = this.hasNewMessages(prevProps);
    if (hasNewMessages){
      console.log('hasNewMessages');
      this.checkNewMessages(prevProps.messages);
    }
    return prevProps.isLoadingMessages !== this.props.isLoadingMessages || hasNewMessages;
  }

  checkNewMessages(prevMessages){
    let messageIds = prevMessages.map( (message) => {
      return message.key;
    });

    let newMessages = this.props.messages.filter((message) => {
      return messageIds.indexOf(message.key) === -1;
    });

    // better logic needed, but this will play a notification if you've been mentioned.
    newMessages.forEach( (message) => {
      let content = message.msg.toLowerCase();
      let username = this.props.myUsername.toLowerCase();
      if (content.indexOf('@' + username) > -1){
        notifier.notify({
          'title': username,
          'message': message.msg
        });
        playNotification();
      }
    });
  }

  hasNewMessages(prevProps){
    return prevProps.messages.length !== this.props.messages.length;
  }

  scrollToBottom(){
    let messageContainer = ReactDOM.findDOMNode(this.refs.messages);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  render(){
    let messages = this.props.messages;
    let username = this.props.myUsername;
    let isLoadingMessages = this.props.isLoadingMessages;

    return (
      <div className="row message-box" ref="messages">
        <div className="col-md-12">
          <MessageList messages={messages} username={username} />
        </div>
        {isLoadingMessages && <Throbber />}
      </div>
    )
  }
}

export default MessageBox;
