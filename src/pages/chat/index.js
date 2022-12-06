import styles from './styles.module.css';
import MessagesReceived from './Messages';
import SendMessage from './SendMessage';
import RoomAndUsersColumn from './RoomAndUsers';

const Chat = ({ username, room, socket }) => {
    return (
        <div className={styles.chatContainer}>
            <RoomAndUsersColumn socket={socket} username={username} room={room}
            />
            <div>
                <MessagesReceived socket={socket} />
                <SendMessage socket={socket} username={username} room={room}/>
            </div>
        </div>
    );
};

export default Chat;

