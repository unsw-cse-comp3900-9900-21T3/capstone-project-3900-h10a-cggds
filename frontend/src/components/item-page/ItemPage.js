import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import BasicSelect from '../buttons-and-sections/BasicSelect.js';
import TextField from '@mui/material/TextField';
import Modal from 'react-modal';
import { Typography } from '@material-ui/core';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
<<<<<<< HEAD
import CloseIcon from '@mui/icons-material/Close';
=======
import CloseIcon from '@material-ui/icons/Close';
import Cookies from 'js-cookie';
>>>>>>> cart-frontend-backend

import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import ReviewContainer from '../buttons-and-sections/ReviewContainer.js';
import Accordian from '../buttons-and-sections/Accordian.js';
import './ItemPage.css';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAVOqrvODx6KS-xBGs5guJTrKBJjduEjRI',
  authDomain: 'nocta-tech.firebaseapp.com',
  projectId: 'nocta-tech',
  storageBucket: 'nocta-tech.appspot.com',
  messagingSenderId: '1002605988200',
  appId: '1:1002605988200:web:e91efebc3765fd58b0eedd',
  measurementId: 'G-5HBFEX2BNM',
};

const firebaseApp = initializeApp(firebaseConfig);
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp);

function ItemPage({ match }) {
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [tag, setTag] = useState('');
  const [reviews, setReviews] = useState([]);
  const [units, setUnits] = useState(0);
  const [reviewIds, setReviewIds] = useState(0);
  const [reviewNewImg, setReviewNewImg] = useState(null);
  const [review, setReview] = useState({
    product_id: match.params.itemId,
    first_name: 'temp',
    last_name: 'user',
    star_rating: 0,
    title: '',
    content: '',
    likes: 0,
    image: '',
    date_posted: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const list = ['1', '2', '3', '4', '5'];
  const [quantity, setQuantity] = useState('');
  const [ratings, setRatings] = useState('');
  const [accordianName, setAccordianName] = useState('');
  const fileInput = React.useRef(null);

  async function getItemData() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await fetch(`/product/${match.params.itemId}`, requestOptions);
    if (res.status === 400) {
      alert('Product not found!');
    } else if (res.status === 200) {
      const data = await res.json();
      setCategory(data.data.category);
      setDesc(data.data.description);
      setImg(data.data.image);
      setName(data.data.name);
      setPrice(data.data.price);
      setTag(data.data.tag);
      setReviews(data.data.reviews);
      setUnits(data.data.units_sold);
      setReviewIds(data.data.reviewIds);
      setAccordianName(`Reviews (${data.data.reviews.length})`);

      // Calculate avg star ratings
      var avg = 0;
      for (var i = 0; i < data.data.reviews.length; i++) {
        avg += data.data.reviews[i].star_rating;
      }
      if (avg !== 0 && data.data.reviews.length !== 0) {
        avg /= data.data.reviews.length;
        var rounded = Math.round(avg * 10) / 10;
        setRatings(`${rounded} (${data.data.reviews.length})`);
      } else {
        setRatings(`0.0 (${data.data.reviews.length})`);
      }
    }
  }

  async function postReview() {
    // Uploading image to retrieve link
    if (reviewNewImg !== null) {
      const storageRef = ref(storage, reviewNewImg.name);
      let snapshot = await uploadBytes(storageRef, reviewNewImg);
      let url = await getDownloadURL(ref(storage, reviewNewImg.name));
      review.image = url;
    }

    var today = new Date();
    today.setHours(today.getHours() + 9);
    const newDate = today.toISOString().replace('T', ' ').substring(0, 19);
    setReview({ ...review, date_posted: newDate });
    const newReviewIds = reviewIds + 1;

    const newBody = {
      product_id: match.params.itemId,
      name: name,
      category: category,
      image: img,
      price: price,
      reviews: reviews,
      description: desc,
      tag: tag,
      units_sold: units,
      review_ids: newReviewIds,
      review: {
        product_id: match.params.itemId,
        review_id: reviewIds,
        first_name: review.first_name,
        last_name: review.last_name,
        star_rating: review.star_rating,
        title: review.title,
        content: review.content,
        likes: review.likes,
        image: review.image,
        date_posted: newDate,
      },
    };

    setReviewIds(reviewIds + 1);

    const requestOptionsPut = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(newBody),
    };

    // TODO: change time format..?idk
    // TODO: like, edit, delete reviews
    // post can be done by using idx of review?
    // probably need to save review field for each user
    // e.g. review >> [{product id, review id}]
    // liked_reviews >> [{product_id, review id}] -- this is needed to prevent like spamming from one user
    // TODO: retrieve user's name, check if user has actually bought the item && do i check if user has already posted a review?
    // hmm review gets overwritten if user posts it twice without refreshing
    // TODO style the code
    // TODO style item page itself
    // TODO admin can delete all reviews
    // TODO add alerts
    // TODO maybe make input fields red if required inputs are not typed
    // TODO reduce scroll when accordian is closed
    // TODO remove img break icon if pictures are removed? idk when i have time lol
    // pls make it responsive

    fetch(`/product`, requestOptionsPut).then(async (response) => {
      try {
        const data = await response.json();
        console.log('response data', data);
      } catch (error) {
        console.log('Error happened');
        console.error(error);
      }
    });
  }

  const handleRemove = (e) => {
    fileInput.current.value = null;
    setReviewNewImg(null);
  };

  const handleClick = (e) => {
    fileInput.current.click();
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setReviewNewImg(e.target.files[0]);
    }
  };

  const addTocart = async () => {
    // const uid = Cookies.get('user');
    // const productId = match.params.itemId;
    // const productQuantity = quantity;
    const addToCartBody = {
      uid: Cookies.get('user'),
      productId: match.params.itemId,
      productQuantity: quantity,
    };
    console.log(addToCartBody);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(addToCartBody),
    };

    const response = await fetch('/cart', requestOptions);
    if (response.status != 200) {
      alert('Failed to add to cart!');
    } else if (response.status === 200) {
      const data = await response.json();
      // TODO: Implement "Succefully Added to Cart" Pop-up
      alert('Added to Cart!');
    }
  };

  useEffect(() => {
    getItemData();
  }, []);

  return (
    <div id='ItemPage'>
      <div id='product-category'>
        <Typography style={{ marginLeft: '30px', marginTop: '10px' }}>
          {category}
        </Typography>
      </div>
      <div id='ItemPage-flex'>
        <div id='product-wrapper'>
          <img id='product-image' src={img} alt={img} />
          <div id='product-info'>
            <Typography
              variant='h4'
              style={{ fontWeight: '700', marginBottom: '50px' }}
            >
              {name}
            </Typography>
            <div id='product-ratings'>
              <Rating
                name='customized-1'
                defaultValue={1}
                max={1}
                size='large'
                readOnly
              />
              <Typography variant='h6'>{ratings}</Typography>
            </div>
            <Typography
              variant='h4'
              style={{ fontWeight: '600', marginTop: '30px' }}
            >
              ${price}
            </Typography>
            <Typography
              variant='body1'
              style={{ marginTop: '50px', marginBottom: '20px' }}
            >
              Tag: {tag}
            </Typography>
            <div id='product-info-buttons'>
              <BasicSelect
                name='Quantity'
                list={list}
                selected={quantity}
                handleChange={(e) => setQuantity(e.target.value)}
              />
              <Button
                onClick={() => {
                  addTocart();
                }}
                type='submit'
                id='add-cart-button'
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>
        <div id='product-description'>
          <Typography variant='h5' style={{ marginBottom: '30px' }}>
            Description
          </Typography>
          <Typography variant='body'>{desc}</Typography>
        </div>
        <div className='ItemPage-flex-vert'>
          <div className='ItemPage-box'>
            <b>Reviews</b>
            <br />
            <Button
              onClick={() => {
                setModalOpen(true);
              }}
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '16px',
              }}
              size='large'
              variant='contained'
            >
              Write a review
            </Button>
            <Accordian
              title={accordianName}
              content={reviews
                .slice(0)
                .reverse()
                .map((rev, id) => (
                  <ReviewContainer
                    key={id}
                    first_name={rev.first_name}
                    last_name={rev.last_name}
                    star_rating={rev.star_rating}
                    title={rev.title}
                    content={rev.content}
                    likes={rev.likes}
                    image={rev.image}
                    date_posted={rev.date_posted}
                  />
                ))}
            />
          </div>
          <Modal
            isOpen={modalOpen}
            style={{
              zIndex: 1,
              overlay: { backgroundColor: 'rgba(0,0,0, 0.5)' },
              content: {
                top: '50px',
                left: '250px',
                right: '250px',
                bottom: '50px',
              },
            }}
          >
            <IconButton
              style={{ float: 'right' }}
              onClick={() => setModalOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '50px',
              }}
            >
              <Typography variant='h5'>My Review for:</Typography>
              <Typography variant='h5'>{name}</Typography>
              <Box id='review-wrapper'>
                <Box id='review-images-section'>
                  <img className='review-image' src={img} alt={img} />
                  <Box id='file-upload-section'>
                    <img
                      className='review-image'
                      src={
                        reviewNewImg ? URL.createObjectURL(reviewNewImg) : null
                      }
                      alt={reviewNewImg ? reviewNewImg.name : null}
                    />
                  </Box>
                  <Typography style={{ fontSize: '12pt' }}>
                    Image uploaded
                  </Typography>
                </Box>
                <Box id='review-inputs-section'>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography style={{ fontSize: '11pt', color: '#FF7A00' }}>
                      Overall Rating*
                    </Typography>
                    <Rating
                      value={review.star_rating}
                      onChange={(e, newValue) => {
                        setReview({ ...review, star_rating: newValue });
                      }}
                    />
                    <Typography style={{ fontSize: '11pt' }}>
                      Click to rate!
                    </Typography>
                  </Box>
                  <Divider style={{ zIndex: 2 }} />
                  <br />
                  <Typography className='Itempage-review-text'>
                    Review Title*
                  </Typography>
                  <TextField
                    label='Title'
                    multiline
                    maxRows={8}
                    value={review.title}
                    onChange={(e) =>
                      setReview({ ...review, title: e.target.value })
                    }
                    style={{ width: '400px' }}
                  />
                  <br />
                  <Divider style={{ zIndex: 2 }} />
                  <br />
                  <Typography className='Itempage-review-text'>
                    Review*
                  </Typography>
                  <TextField
                    label='Content'
                    multiline
                    maxRows={5}
                    value={review.content}
                    onChange={(e) =>
                      setReview({ ...review, content: e.target.value })
                    }
                    minRows={5}
                    style={{ width: '400px' }}
                  />
                  <br />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant='outlined'
                      style={{ width: '170px' }}
                      onClick={() => {
                        handleClick();
                      }}
                    >
                      Add photo
                    </Button>
                    <input
                      id='file-upload'
                      ref={fileInput}
                      onChange={handleChange}
                      type='file'
                    />
                    <Button
                      variant='outlined'
                      style={{ width: '170px' }}
                      onClick={() => {
                        handleRemove();
                      }}
                    >
                      Remove photo
                    </Button>
                  </Box>
                  <br />
                </Box>
              </Box>
              <Button
                id='post-review-button'
                size='large'
                onClick={() => postReview()}
              >
                Post Review
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ItemPage;
