import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { uploadDocuments } from '../../../store/slices/OnboardingSlice';
import Button from '../../../common/button/Button';
import './DocumentUpload.scss';

const REQUIRED_DOCUMENTS = [
  {
    id: 'registration',
    title: 'Registration Certificate',
    description: 'Official registration certificate from relevant authorities',
    acceptedFormats: '.pdf,.jpg,.jpeg,.png'
  },
  {
    id: 'accreditation',
    title: 'Accreditation Certificate',
    description: 'Current accreditation certificate from recognized body',
    acceptedFormats: '.pdf,.jpg,.jpeg,.png'
  },
  {
    id: 'license',
    title: 'Operating License',
    description: 'Valid operating license from education department',
    acceptedFormats: '.pdf,.jpg,.jpeg,.png'
  },
  {
    id: 'tax',
    title: 'Tax Registration',
    description: 'Tax registration certificate or equivalent document',
    acceptedFormats: '.pdf,.jpg,.jpeg,.png'
  }
];

const DocumentUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, uploadedDocs } = useSelector(
    (state) => state.institutes.documents
  );
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem('token');

 

  const [documents, setDocuments] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});



  const handleFileChange = useCallback((docId, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [docId]: file
      }));
      // Reset progress when new file is selected
      setUploadProgress(prev => ({
        ...prev,
        [docId]: 0
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(documents).forEach(docId => {
      formData.append(docId, documents[docId]);
    });
  
    try {
      await dispatch(uploadDocuments(formData)).unwrap();
      
      navigate('/admin/dashboard', {
        state: { message: 'Documents uploaded successfully. They will be reviewed shortly.' }
      });
    } catch (err) {
      console.error('Document upload failed:', err);
    }
  };

  const isDocumentUploaded = (docId) => {
    return uploadedDocs.some(doc => doc.type === docId);
  };

  // if (!token || !user) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <div className="document-upload">
      <div className="document-upload__header">
        <h1>Document Verification</h1>
        <p>Please upload the following documents to verify your institute's credentials.</p>
      </div>

      {error && (
        <div className="document-upload__error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="document-upload__form">
        <div className="document-upload__grid">
          {REQUIRED_DOCUMENTS.map((doc) => (
            <div key={doc.id} className="document-upload__item">
              <h3>{doc.title}</h3>
              <p>{doc.description}</p>
              
              <div className="document-upload__input-wrapper">
                <input
                  type="file"
                  id={doc.id}
                  accept={doc.acceptedFormats}
                  onChange={(e) => handleFileChange(doc.id, e)}
                  disabled={loading}
                  className="document-upload__input"
                />
                
                {uploadProgress[doc.id] > 0 && (
                  <div className="document-upload__progress">
                    <div 
                      className="document-upload__progress-bar"
                      style={{ width: `${uploadProgress[doc.id]}%` }}
                    />
                  </div>
                )}
                
                {isDocumentUploaded(doc.id) && (
                  <span className="document-upload__status document-upload__status--uploaded">
                    ✓ Uploaded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="document-upload__actions">
          <Button
            type="submit"
            disabled={loading || Object.keys(documents).length === 0}
            className="document-upload__submit"
          >
            {loading ? 'Uploading Documents...' : 'Submit Documents for Verification'}
          </Button>
        </div>

        <div className="document-upload__info">
          <h4>Important Notes:</h4>
          <ul>
            <li>All documents must be clear and legible</li>
            <li>Maximum file size: 5MB per document</li>
            <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
            <li>Documents will be reviewed by our verification team</li>
            <li>You will be notified once verification is complete</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;