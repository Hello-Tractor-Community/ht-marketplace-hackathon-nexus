// src/features/seller/components/CreateListingForm.js
const CreateListingForm = () => {
    const [listingData, setListingData] = useState({
      name: '',
      sku: '',
      category: 'tractor',
      description: '',
      make: '',
      model: '',
      serviceHours: 0,
      price: { amount: 0, currency: 'USD' }
    });
  
    const handleImageUpload = () => {
      // Cloudinary widget component - you mentioned you have this ready
      window.cloudinaryWidget.open();
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Redux action to create listing
    };
  
    return (
      <div className="create-listing-form">
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <button 
            type="button" 
            onClick={handleImageUpload}
          >
            Upload Images (via Cloudinary Component)
          </button>
        </form>
      </div>
    );
  };