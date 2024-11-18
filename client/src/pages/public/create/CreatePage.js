import React, { useState } from 'react';
import { Box, Button, Typography, Modal, Slider, TextField, Select, MenuItem, IconButton, Grid } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import tshirtImage from '../../../assets/images/create/wall/tshirt.png';
import mugImage from '../../../assets/images/create/wall/mug.png';
import NavBar from '../../../common/navbar/NavBar';
import CartItem from '../../../components/CartItem';

const PRODUCT_SIZE = 320;

const preMadeImages = [
    { id: '1', uri: require('../../../assets/images/create/premade/1.jpg') },
    { id: '2', uri: require('../../../assets/images/create/premade/2.jpg') },
    { id: '3', uri: require('../../../assets/images/create/premade/3.jpg') },
    { id: '4', uri: require('../../../assets/images/create/premade/4.jpg') },
    { id: '5', uri: require('../../../assets/images/create/premade/5.jpg') },
    { id: '6', uri: require('../../../assets/images/create/premade/6.jpg') },
    { id: '7', uri: require('../../../assets/images/create/premade/7.jpg') },
    { id: '8', uri: require('../../../assets/images/create/premade/8.jpg') },
    
  ];

const CreatePage = () => {
  const [product, setProduct] = useState('tshirt');
  const [color, setColor] = useState('white');
  const [placedElements, setPlacedElements] = useState([]);
  const [text, setText] = useState('');
  const [textStyle, setTextStyle] = useState({ fontSize: 16, color: 'black', fontWeight: 'normal' });
  const [showTextStyleModal, setShowTextStyleModal] = useState(false);
  const navigate = useNavigate();

  const addElement = (element) => {
    setPlacedElements([...placedElements, { ...element, id: Date.now().toString() }]);
  };

  const removeElement = (id) => {
    setPlacedElements(placedElements.filter(element => element.id !== id));
  };

  const renderProduct = () => {
    switch (product) {
      case 'tshirt':
        return <img src={tshirtImage} style={{ width: PRODUCT_SIZE, height: PRODUCT_SIZE, objectFit: 'contain', backgroundColor: color }} alt="T-Shirt" />;
      case 'mug':
        return <img src={mugImage} style={{ width: PRODUCT_SIZE, height: PRODUCT_SIZE, objectFit: 'contain', backgroundColor: color }} alt="Mug" />;
      case 'poster':
        return <Box style={{ width: PRODUCT_SIZE, height: PRODUCT_SIZE, backgroundColor: color }} />;
      default:
        return null;
    }
  };

  const ElementRenderer = ({ element }) => {
    return (
      <Box style={{ position: 'absolute', transform: `translate(${element.x}px, ${element.y}px)` }}>
        {element.type === 'image' ? (
          <img src={element.uri} alt="Placed Element" style={{ width: 100, height: 100, objectFit: 'contain' }} />
        ) : (
          <Typography style={{ fontSize: textStyle.fontSize, color: textStyle.color, fontWeight: textStyle.fontWeight }}>
            {element.content}
          </Typography>
        )}
        <IconButton onClick={() => removeElement(element.id)}><FaTimes /></IconButton>
      </Box>
    );
  };

  const renderTextStyleModal = () => (
    <Modal open={showTextStyleModal} onClose={() => setShowTextStyleModal(false)}>
      <Box style={{ padding: 20, backgroundColor: 'white', width: 400, margin: 'auto', marginTop: '20%' }}>
        <Typography>Font Size</Typography>
        <Slider
          value={textStyle.fontSize}
          min={10}
          max={30}
          onChange={(e, value) => setTextStyle({ ...textStyle, fontSize: value })}
        />
        <Typography>Color</Typography>
        <Box style={{ display: 'flex', justifyContent: 'space-around' }}>
          {['black', 'red', 'blue', 'green'].map(color => (
            <Box
              key={color}
              style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: color, cursor: 'pointer' }}
              onClick={() => setTextStyle({ ...textStyle, color })}
            />
          ))}
        </Box>
        <Typography>Font Weight</Typography>
        <Button onClick={() => setTextStyle({ ...textStyle, fontWeight: textStyle.fontWeight === 'normal' ? 'bold' : 'normal' })}>
          {textStyle.fontWeight === 'normal' ? 'Normal' : 'Bold'}
        </Button>
        <Button onClick={() => setShowTextStyleModal(false)}>Done</Button>
      </Box>
    </Modal>
  );

  const pickImage = (event) => {
    // Implement the logic for picking an image here
    const file = event.target.files[0];
    if (file) {
      // Do something with the file
      console.log(file);
    }
  };

  return (
    <Box style={{ padding: 20 }}>
      <NavBar />
      <CartItem />
      <Typography variant="h4" style={{  marginBottom: 20 }}>Create and Send Us Your Design</Typography>
      <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, 
        border: '1px solid #ccc', borderRadius: 5, padding: 10,width: '50%', margin: 'auto',
       }}>
        {renderProduct()}
        {placedElements.map((element) => (
          <ElementRenderer key={element.id} element={element} />
        ))}
      </Box>
      <Box style={{ padding: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box style={{ display: 'flex', overflowX: 'auto' }}>
              {preMadeImages.map((image) => (
                <Button key={image.id} onClick={() => addElement({ type: 'image', uri: image.uri })}>
                  <img src={image.uri} style={{ width: 80, height: 80, marginRight: 10, borderRadius: 5 }} alt="Pre-Made" />
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <Select value={product} onChange={(e) => setProduct(e.target.value)}>
            <MenuItem value="tshirt">T-Shirt</MenuItem>
            <MenuItem value="mug">Mug</MenuItem>
            <MenuItem value="poster">Poster</MenuItem>
          </Select>
          <Select value={color} onChange={(e) => setColor(e.target.value)}>
            <MenuItem value="white">White</MenuItem>
            <MenuItem value="black">Black</MenuItem>
            <MenuItem value="blue">Blue</MenuItem>
          </Select>
        </Box>
        <Box style={{ display: 'flex', marginBottom: 10 }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
            style={{ flex: 1, marginRight: 10 }}
          />
          <Button onClick={() => setShowTextStyleModal(true)}>Style</Button>
          <Button onClick={() => addElement({ type: 'text', content: text, style: textStyle })}>Add</Button>
        </Box>
        <Button onClick={() => document.getElementById('fileInput').click()}>Upload Image</Button>
        <input id="fileInput" type="file" style={{ display: 'none' }} onChange={pickImage} />
      </Box>
      {renderTextStyleModal()}
    </Box>
  );
};

export default CreatePage;
