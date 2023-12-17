import { Form } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

//types
import {Message} from "../../types/message";

interface ChatProps {
    messages: Message[];
}

export const Chat = ({ messages: serverMessages }: ChatProps) => {
    const [message, setMessage] = useState(serverMessages);

    // useEffect(() => {
    //     const channel = supabase
    //         .channel ("*")
    //         .on(
    //             "postgres_changes",
    //             { even}
    //         )

    //     }

   
return (
    <div className="flex h-full flex-col">
        <div className = "my-2">
        </div>
        <div className="mt-auto mb-5 py-2>">
            
        </div>
    </div>
)
};