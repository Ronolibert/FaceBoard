import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ProgressCircle } from 'react-desktop/macOs';
import { getRoomMessages } from '../actions/room';
import { makeChatMenu } from '../actions/menu';
import RoomSelect from './roomSelect';
import RoomChatInput from './roomChatInput';
import Message from './message';
import Users from './users';
import UserSelect from './userSelect';
import { showUserSelect } from '../actions/userActions';


class RoomChat extends React.Component {
  constructor (props) {
    super(props);
  }

  componentWillMount () {
    const { router } = this.props;
    this.props.dispatch(getRoomMessages(global.localStorage.currentRoom));
    makeChatMenu(router);
  }

  componentDidUpdate () {
    const { router } = this.props;
    var node = this.refs.roomChat;
    this.shouldScroll = Math.abs((node.scrollTop + node.offsetHeight) - node.scrollHeight) < (node.scrollTop / 3);
    if (!this.firstScroll) {
      this.shouldScroll = true;
      this.firstScroll = true;
    }
    this.scrollToBottomAtStart();
    makeChatMenu(router);
  }

  scrollToBottomAtStart () {
    if (this.shouldScroll) {
      var node = this.refs.roomChat;
      node.scrollTop = node.scrollHeight;
    }
  }

  leaveRoom () {
    const { router } = this.props;
    global.localStorage.currentRoom = 'lobby';
    router.replace('/');
  }

  showSelect (e) {
    showUserSelect();
  }

  render () {
    const { roomMsgs } = this.props;
    if (!roomMsgs.length) {
      <div className="progresscircle">
        <ProgressCircle size={40}/>
      </div>
    }

    return (
      <div className="lobby">
        <div className="mainHeader">
          {global.localStorage.currentRoom}
          <img src="../static/imgs/plus.png" onClick={this.showSelect.bind(this)}/>
           <span className="btn btn-default pull-right icon icon-home" onClick={this.leaveRoom.bind(this)}>
           </span>
           <div className="pull-right">
             <div className="users-search">
               <Users />
             </div>
           </div>
        </div>
        <div className="chat-container">
          <div className="chatBox" ref="roomChat">
            <table className="table-striped">
              <tbody>
                {roomMsgs.map(message => <Message key={message.id} userid={message.id} user={message.username} text={message.text} timestamp={message.createdAt}/>)}
              </tbody>
            </table>
          </div>
          <RoomChatInput />
        </div>
        <UserSelect />
        <RoomSelect />
      </div>
    );
  }
};

const { arrayOf, shape, number, string } = React.PropTypes;

RoomChat.propTypes = {
  roomMsgs: arrayOf(shape({
    id: number.isRequired,
    username: string.isRequired,
    text: string.isRequired
  }))
};

const mapStateToProps = (state) => state.roomChatReducer
export default connect(mapStateToProps)(withRouter(RoomChat));
