import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';

const Messages = ({ socket }) => {
    const [ messageReceived, setMessagesReceived] = useState([]);

    const messagesColumnRef = useRef(null);

    // Runs whenever a socket event is recieved from the server
    useEffect(()=>{
        socket.on('receive_message', (data) =>{
            console.log(data);

            setMessagesReceived((state)=> [
                ...state,
                {
                    message: data.message,
                    username: data.username,
                    __createdtime__: data.__createdtime__,
                },
            ]);
        });

        // Remove event listener on component unmount
        return () => socket.off('receive_message');

    },[socket]);

    useEffect(() => {

        socket.on('last_100_messages', (last100Messages) => {
            console.log("Last 100 messages: ", JSON.parse(last100Messages));

            last100Messages = JSON.parse(last100Messages);

            // Sort these messages by __createdtime__
            last100Messages = sortMessagesByDate(last100Messages);
            setMessagesReceived((state)=> [...last100Messages, ...state]);
        });
    },[socket]);

    // Scroll to the most recent message
    useEffect(()=>{
        messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }, [messageReceived]);
    
    // dd/mm/yyy, hh:mm:ss
    const formatDateFromTimeStamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    // Sort messages 
    const sortMessagesByDate = (messages) => {
        return messages.sort(
            (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    };


    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
            {messageReceived.map((msg, i)=>(
                <div className={styles.message} key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-beteen'}}>
                        <span className={styles.msgMeta}> {msg.username}</span>
                        <span className={styles.msgMeta}>
                            {formatDateFromTimeStamp(msg.__createdtime__)}
                        </span>
                        <p className={styles.msgText}>{msg.message} </p>
                        <br/>
                    </div>
                </div>
            ))}
        </div>
    );
};



export default Messages;
