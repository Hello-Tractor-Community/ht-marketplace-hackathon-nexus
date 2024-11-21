import React, { useEffect, useState } from 'react';
import './admin-client.css'; // Import CSS file for styling
import { useAppContext } from './AppContext';

import { FaEye, FaEyeSlash, FaCopy, FaTrash } from 'react-icons/fa';
import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = 'https://api-netconn.brosfe.com';

const AdminClientList = () => {
    const { currentLanguage } = useAppContext();

    const [isLoading, setIsLoading] = useState(true);
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState({ image: '', name: '', note: '' });
    const [isClipboardCopied, setIsClipboardCopied] = useState(false);
    const [originalUrl, setOriginalUrl] = useState('');
    const [convertedUrl, setConvertedUrl] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchClient();
        }
    }, []);




    useEffect(() => {
        if (isClipboardCopied) {
            setTimeout(() => {
                setIsClipboardCopied(false);
            }, 1000);
        }
    }, [isClipboardCopied]);
  
    const fetchClient = async () => {
        const response = await axios.get(`${API_URL}/api/clients`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setClients(response.data);
        setIsLoading(false);
    };
    const handleClientChange = (e) => {
        setNewClient({ ...newClient, [e.target.name]: e.target.value });
    };

    const handleClientsSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/clients`, newClient, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            setNewClient({ image: '', name: '', note: '' });
            fetchClient();
        } catch (error) {
            console.error('Error creating client:', error);
        }
    };

    const handleClientDelete = async (id) => {
        await axios.delete(`${API_URL}/api/clients/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        fetchClient();
    };





    const convertUrl = () => {
        // Regular expression to extract the file ID from the original URL
        const fileIdMatch = originalUrl.match(/https:\/\/drive\.google\.com\/file\/d\/(.+?)\/view/);
        if (fileIdMatch) {
            const fileId = fileIdMatch[1];
            // Construct the converted URL in thumbnail format
            const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}`;
            setConvertedUrl(thumbnailUrl);
        } else {
            setConvertedUrl('Invalid URL');
        }
    };

    // Function to copy the converted URL to the clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(convertedUrl)
            .then(() => {
                // alert('Converted URL copied to clipboard!');
                setIsClipboardCopied(true);
            })
            .catch(() => {
                alert('Failed to copy the URL');
            });
    };

    useEffect(() => {
        if (isClipboardCopied) {
            setTimeout(() => {
                setIsClipboardCopied(false);
            }, 1000);
        }
    }, [isClipboardCopied]);


    return (
        < >
            {currentLanguage === 'English' && (

                <div className='sub-container'>

                    <div className="thumbnail-url-converter">
                        {isClipboardCopied && <p style={{
                            color: 'green',
                            position: 'absolute', top: '10px', right: '20px', backgroundColor: 'lightgrey'
                        }}>Copied to clipboard!</p>}
                        <p>Google Drive Thumbnail URL Converter</p>
                        
                        <div>
                            <input
                                type="text"
                                placeholder="Enter original Google Drive URL"
                                value={originalUrl}
                                onChange={(e) => setOriginalUrl(e.target.value)}
                            />
                          
                            <button onClick={convertUrl}>Convert URL</button>
                           
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Converted thumbnail URL"
                                value={convertedUrl}
                                readOnly
                            />
                          
                            <button onClick={copyToClipboard}>
                                <FaCopy style={{ marginRight: '5px' }} /> Copy URL
                            </button>
                        </div>
                    </div>
                    <div className='admin-content-form'>
                       
                        <form onSubmit={handleClientsSubmit}>
                        <h3>Manage your Client connections here</h3>

                            <input
                                type="text"
                                name="image"
                                placeholder="Image URL"
                                value={newClient.image}
                                onChange={handleClientChange}
                            />


                            <input
                                type="text"
                                name="name"
                                placeholder="Name or company"
                                value={newClient.name}
                                onChange={handleClientChange}
                            />

                           
                            <textarea
                                name="note"
                                placeholder="Note about client.."
                                value={newClient.note}
                                onChange={handleClientChange}
                            ></textarea>

                            <button type="submit">Add client</button>
                        </form>
                        {isLoading && <p>Loading...</p>}
                        <h4>Client list</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Client Logo</th>
                                    <th>Client Name</th>
                                    <th>Note</th>
                                    <th>Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client) => (
                                    <tr key={client._id}>
                                        <td><img src={client.image}></img></td>
                                        <td>{client.name}</td>
                                        <td>{client.note}</td>
                                        <td>
                                            <button onClick={() => handleClientDelete(client._id)}><FaTrash /> </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>







                </div>

            )}
            {currentLanguage === 'አማርኛ' && (
                <div className='sub-container'>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h1>መነሻ ገጽ</h1>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminClientList;