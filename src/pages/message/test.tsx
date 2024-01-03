import { useSession, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Layout from "~/components/layout/Layout";

const Test = () => {
    const supabase = useSupabaseClient();

    const user1 = '65d058bb-bfad-4c2d-9737-dcb5ef2c2824'
    const user2 = '6d669922-389d-4cb5-92b8-165bd648223f'
    const userID = getCookie("UserID");
    const session = useSession();
    const [currentUserID,setCurrentUserID] = useState(session?.user.id)
    const [newMessage, setNewMessage] = useState({
        content : '',
        sender_id : userID,
        recipient_id : user2,
    });
    const clientID = 1;
    const [messages, setMessages] = useState<any[]>([]);

    const handleSend = async (e) => {
        e.preventDefault()
        console.log(messages)
        const {data, error} =await supabase.from('chat_message').insert(newMessage)
        console.log(error)
        // setMessages([...messages, newMessage])
    }

    const user = useSession();
    const getData = async() => {

        console.log('User',user?.user)
        await supabase.from('chat_message').select("*").then((data)=>{
            console.log(data)
            setMessages(data.data)
        })
    }
    useEffect(() => {
        getData();
        
        setCurrentUserID(session?.user.id || '')
        const channel = supabase.channel("*")
        .on(
            "postgres_changes",
            {event:"INSERT",schema: "public", table: "chat_message"},
            (payload) => {
                const newMessage = payload.new as any;
                if(!messages.find((message) => message.id === newMessage.id)){
                    console.log("In subscription",messages)
                    setMessages([...messages, newMessage]);
                };
            }
        ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    },[session]
    )

    return (
        <Layout>
            {/* {userID} */}
            {messages.map((message) => {
                return <div key={message.id} style={{backgroundColor:message.sender_id == userID ? "green":'blue', color:'white'}}>{message.content}</div>
            })}
            <input onChange={(e)=>{newMessage.content = e.target.value; setNewMessage(newMessage)}}></input>
            <button onClick={handleSend}>Send</button>
        </Layout>
    );
}

export default Test;