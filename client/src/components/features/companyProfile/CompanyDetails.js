// src/components/features/InstituteProfile/InstituteDetails.js
import React from 'react';
import Card from '../../components/Card';
import './InstituteDetails.scss';

const InstituteDetails = ({ institute }) => {
  return (
    <div className="institute-details">
      <Card title={institute.name}>
        <div className="institute-details__content">
          <p className="institute-details__type">{institute.type}</p>
          <p className="institute-details__description">{institute.description}</p>
          <div className="institute-details__location">
            <h3>Location</h3>
            <p>{institute.location.address}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InstituteDetails;

