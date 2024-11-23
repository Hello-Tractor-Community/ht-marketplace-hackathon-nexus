import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './SellerListings.scss'; // Import CSS file for styling
import { FaEye, FaEyeSlash, FaCopy, FaTrash } from 'react-icons/fa';
import { authService } from '../../../../../services/api/auth';
import { messageService } from '../../../../../services/api/messages';
import MessageBox from './MessageBox';

const SellerMailbox = () => {

    const [searchResults, setSearchResults] = useState([]);
    const { user } = useSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState(true);
    const [conversationFetched, setConversationFetched] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [conversationCount, setConversationCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [msgCount, setMsgCount] = useState(0);
    const [messageFetched, setMessageFetched] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);

  
  



    const handleRowClick = (conversation) => {

        fetchMessages(conversation._id);
        setSelectedConversation(conversation); // Open overlay with the selected conversation
    };

    const closeOverlay = () => {
        setSelectedConversation(null); // Close the overlay
    };


    useEffect(() => {
        const token = authService.getToken();
        console.log("User:", user);
        const userId = user?._id;
        console.log("User ID:", userId);
        console.log("token:", token);

        if (token) {
            if (!conversationFetched) {
                fetchConversations(userId);
            }

        }
    }, [conversationFetched, user]);

    const fetchConversations = async (userId) => {

        console.log("fetchlisting.. userId", userId);

        try {
            const response = await messageService.getSellerConversations(userId);
            console.log("in sellermailbox..", response);
            if (response.success) {
                setIsLoading(false);
                setConversationFetched(true);
                setConversationCount(response.data.count);
                setConversations(response.data.data);


            }


        } catch (error) {
            console.error('Error fetching listings:', error);
            setIsLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {

        console.log("fetch messages conversationId", conversationId);

        try {
            const response = await messageService.getConversationMessages(conversationId);
            console.log("SellerMailbox messages..", response);
            if (response.success) {
                setIsLoading(false);
                setMessageFetched(true);
                setMsgCount(response.data.count);
                setMessages(response.data);


            }


        } catch (error) {
            console.error('Error fetching listings:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className='sub-container'>
            <div className='seller-listing-controller'>
                
                    <h3>Your Messages</h3>
               
                <div className='mailbox'>
                    <h2>Conversations</h2>
                    {isLoading && (
                        <p>Loading conversations...</p>

                    )}

                    <table>
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th>Message</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conversations &&conversations.map((conversation) => (
                                <tr key={conversation._id}
                                    onClick={() => handleRowClick(conversation)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{conversation.admin ? "Admin" : "Buyer"}</td>
                                    <td>{conversation.lastMessage.content.length > 50
                                        ? `${conversation.lastMessage.content.slice(0, 50)}...`
                                        : conversation.lastMessage.content}</td>

                                    <td>
                                        {new Intl.DateTimeFormat('en-KE', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            timeZone: 'Africa/Nairobi', // EAT Timezone
                                            timeZoneName: 'short'
                                        }).format(new Date(conversation.createdAt))}
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedConversation && (
                        <MessageBox
                        conversation={selectedConversation}
                        messages={messages}
                        closeOverlay={closeOverlay}
                        messageFetched={messageFetched}
                        />
                    )}

                </div>
            </div>
        </div>
    );
};

export default SellerMailbox;