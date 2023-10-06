import React, { useEffect, useState, useRef } from 'react'
import socketIOClient from "socket.io-client";
import ChatBoxReciever, { ChatBoxSender } from './ChatBox';
import InputText from './InputText';
import UserLogin from './UserLogin';
import {Avatar , Image} from 'antd'
import { CommentOutlined } from '@ant-design/icons'



export default function ChatContainer() {
  
    let socketio  = socketIOClient("http://localhost:7000")
    const [chats , setChats] = useState([])
    const [user, setUser] = useState(localStorage.getItem("user"))
    const avatar = localStorage.getItem('avatar')
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }    

    useEffect(() => {
      scrollToBottom()
    }, [chats])

    useEffect(()=> {
        socketio.on('chat', senderChats => {
            setChats(senderChats)
        })
    })


    function sendChatToSocket(chat){
        socketio.emit("chat" , chat)
    }

    function addMessage(chat){
        const newChat = {...chat , user , avatar}
        setChats([...chats , newChat])
        sendChatToSocket([...chats , newChat])
    }

    function logout(){
        localStorage.removeItem("user")
        localStorage.removeItem("avatar")
        setUser("")   
    }

    function ChatsList(){
        return( <div style={{ height:'75vh' , overflow:'scroll' , overflowX:'hidden' }}>
              {
                 chats.map((chat, index) => {
                  if(chat.user === user) return <ChatBoxSender  key={index} message={chat.message} avatar={chat.avatar} user={chat.user} />
                  return <ChatBoxReciever key={index} message={chat.message} avatar={chat.avatar} user={chat.user} />
              })
              }
               <div ref={messagesEndRef} />
        </div>)
       
    }

  return (
    <div>
            <h1 style={{margin:10, textAlign:'center', }}><CommentOutlined color={'green'} />  Group Chat </h1>

        {
        user ?
         <div>
        
         <div style={{display:'flex', flexDirection:"row", justifyContent: 'space-between'}} >
         <div  style={{display:'flex', justifyContent:'flex-start' , flexDirection:'row'}} >
            <Avatar
            size={50}
            src={<Image
                src={avatar}
                style={{
                    objectFit:'cover',
                    width:45,
                    height:45,
                    borderRadius: "100%"
                }}
            
                />}
            />
            <p style={{  height:"auto",width:"auto", backgroundColor:'#fff', borderRadius: 10  }} >
            <strong> User: {user} </strong>
              
            </p>

    </div>
       
          <p onClick={()=> logout()} style={{borderRadius:'10',color:"red", cursor:'pointer'}} >Log Out</p>
           </div>
            <ChatsList
             />
            
            <InputText addMessage={addMessage} />
        </div>
        : <UserLogin setUser={setUser} />
        }

    
     
    </div>
  )
}
