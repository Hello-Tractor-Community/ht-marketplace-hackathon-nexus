import React, { useEffect, useRef, useState } from 'react';
import './UploadWidgetClaudinary.scss'; // Import CSS file for styling
import Button from '../../../../common/button/Button';

import { FaCopy } from 'react-icons/fa';

import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';



const UploadWidgetClaudinary = ({ folderName, setFetchedImageUrl }) => {

    const [cloudinaryUploadSuccess, setCloudinaryUploadSuccess] = useState(false);
    const [copyURL, setCopyURL] = useState(false);
    
    const uploadedImages = [];

    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        if (cloudinaryUploadSuccess) {
            setTimeout(() => {
                // setFetchedImageUrl([]);
                setCloudinaryUploadSuccess(false);
            }, 3000);
        }
    }, [cloudinaryUploadSuccess]);





    const initializeCloudinaryWidget = async () => {
        console.log('Initializing Cloudinary widget...');
        setFetchedImageUrl([]);
        console.log('Folder name:', folderName);

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
                        // Store the secure URL in the array
                        uploadedImages.push({
                            url: result.info.secure_url,
                            name: result.info.original_filename,
                        });

                        // Log the entire array for debugging
                        console.log('Uploaded Images:', uploadedImages);
                    } else if (result.event === 'close') {
                        // Call accessImageInfo once the widget is closed
                        console.log('Widget closed. Upload process completed.');
                        if (uploadedImages.length > 0) {
                            accessImageInfo(uploadedImages);
                        } else {
                            console.log('No images were uploaded.');
                        }
                    }
                }
            );

            console.log('Cloudinary widget initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Cloudinary widget:', error);
            throw error;
        }
    };

    const accessImageInfo = async (uploadedImages) => {
        console.log('Processing uploaded images...',uploadedImages);

        // Process each uploaded image
        uploadedImages.map(({ url, name }) => {
            console.log('Uploaded image URL:', url);
            console.log('Original filename:', name);

            // Set the state or perform actions for each image
            setFetchedImageUrl((prevState) => [...prevState, { url, filename: name }]);
        });

        // Indicate overall success
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


    // const copyToClipboard = () => {
    //     if (fetchedImageUrl.url) {
    //         navigator.clipboard.writeText(fetchedImageUrl.url)
    //             .then(() => {
    //                 setCopied(true);
    //                 setTimeout(() => {
    //                     setCopied(false);
    //                 }, 2000);
    //             })
    //             .catch((err) => {
    //                 console.error('Failed to copy text: ', err);
    //             });
    //     }
    // };



    return (
        < >
            <div className='cloudinary-container'
            >

                {cloudinaryUploadSuccess && <p>Image uploaded successfully</p>}

                <h3>Upload Images to Cloudinary</h3>

                <Button onClick={handleUploadClick} variant="secondary">
                    Upload images
                </Button>

                {/* {copyURL && (
                    <div className='cloudinary-uploader'>
                        <h4>Uploaded Images</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>URL</th>
                                    <th>Filename</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetchedImageUrl.map((image, index) => (
                                    <tr key={index}>
                                        <td>
                                            {image.url.length > 36 ? `${image.url.slice(0, 36)}...` : image.url}
                                        </td>
                                        <td>{image.filename}</td>
                                        <td>
                                            <button onClick={() => copyToClipboard(image.url)}>
                                                <FaCopy style={{ marginRight: '5px' }} /> {copied ? 'Copied!' : 'Copy URL'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )} */}

            </div>

        </>
    );
};

export default UploadWidgetClaudinary;