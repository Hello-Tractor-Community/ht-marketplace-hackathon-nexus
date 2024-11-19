import React, { useEffect, useRef, useState } from 'react';
import './upload-widget.scss'; // Import CSS file for styling

import { FaCopy } from 'react-icons/fa';

import axios from 'axios';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = 'https://api-netconn.brosfe.com';


// require('dotenv').config();


const UploadWidgetClaudinary = ({folderName}) => {
   
    const [cloudinaryUploadSuccess, setCloudinaryUploadSuccess] = useState(false);
    const [copyURL, setCopyURL] = useState(false);
    const [fetchedImageUrl, setFetchedImageUrl] = useState({});

    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        if (cloudinaryUploadSuccess) {
            setTimeout(() => {
                setCloudinaryUploadSuccess(false);
            }, 3000);
        }
    }, [cloudinaryUploadSuccess]);



    const initializeCloudinaryWidget = async () => {
        console.log('Initializing Cloudinary widget...');


        try {
            // Get the upload signature from your server using Axios
            const signatureResponse = await axios.get(`${API_URL}/api/cloudinary/signature`);
            const { signature, timestamp, cloudName, apiKey, uploadPreset } = signatureResponse.data;
           

            cloudinaryRef.current = window.cloudinary;

            widgetRef.current = cloudinaryRef.current.createUploadWidget(
                {
                    cloudName: cloudName,
                    apiKey: apiKey,

                    uploadSignatureTimestamp: timestamp,
                    uploadSignature: signature,

                    cropping: false,
                    folder: folderName,

                    sources: ['local', 'url', 'camera', 'google_drive', 'facebook', 'instagram', 'image_search'],
                    multiple: true,



                },
                (error, result) => {
                    console.log('Widget callback triggered');
                    if (error) {
                        console.error('Error in widget callback:', error);
                        return;
                    }

                    if (result.event === 'success') {
                        console.log('Upload result:', result);
                        accessImageInfo(result.info.secure_url, result.info.original_filename);
                    } else {
                        console.log('Upload event:', result.event);
                    }
                }
            );

            // Resolve the promise once the widget is initialized
            console.log('Cloudinary widget initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Cloudinary widget:', error);
            throw error;
        }
    };

    const accessImageInfo = async (imageUrl, originalFilename) => {


        console.log('Uploaded image URL:', imageUrl);
        console.log('Original filename:', originalFilename);
        setFetchedImageUrl({ url: imageUrl, filename: originalFilename });

        setCloudinaryUploadSuccess(true);
        setCopyURL(true);

    };




    const handleUploadClick = async () => {
        console.log('Uploading image...');

        try {
            if (!widgetRef.current) {
                // Initialize the Cloudinary widget if it hasn't been initialized yet
                await initializeCloudinaryWidget();
            }
            // Call open() method only after initialization is complete
            widgetRef.current.open();
        } catch (error) {
            // console.error('Error handling upload:', error);
        }
    };


    const [copied, setCopied] = useState(false);


    const copyToClipboard = () => {
        if (fetchedImageUrl.url) {
            navigator.clipboard.writeText(fetchedImageUrl.url)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => {
                        setCopied(false);
                    }, 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err);
                });
        }
    };



    return (
        < >
            

                <div className='cloudinary-container'
                >

                    {cloudinaryUploadSuccess && <p>Image uploaded successfully</p>}

                    <h3>Upload Images to Cloudinary</h3>
                    <button onClick={handleUploadClick}>
                        Upload image(s)
                    </button>

                    {copyURL && (
                        <div className='cloudinary-uploader'>
                            <h4>Uploaded Image</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>URL</th>
                                        <th>Filename</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{fetchedImageUrl.url.length > 36 ? `${fetchedImageUrl.url.slice(0, 36)}...` : fetchedImageUrl.url}</td>
                                        <td>{fetchedImageUrl.filename}</td>
                                        <td>
                                            <button onClick={copyToClipboard}>
                                                <FaCopy style={{ marginRight: '5px' }} /> {copied ? 'Copied!' : 'Copy URL'}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>


                        </div>
                    )}



                </div>

            

        </>
    );
};

export default UploadWidgetClaudinary;