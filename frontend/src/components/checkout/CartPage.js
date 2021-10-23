import React, { useState, useEffect } from 'react';
import TextButton from '../buttons-and-sections/TextButton.js';
import { Link } from 'react-router-dom';

import './CartPage.css';
import CartItem from '../buttons-and-sections/CartItem.js';
import Accordian from '../buttons-and-sections/Accordian.js';
import CustomerDetailsSection from './CustomerDetailsSection.js';
import Cookies from 'js-cookie';

function CartPage({ token }) {
  // TODO: useEffect to retrieve information from the backend about the current user's
  // cart, including: Items, Quantity of Items, Personal Information/Details
  const [cartItems, setCartItems] = useState([]);
  const [cartAccordian, setCartAccordian] = useState(
    <Accordian title='Items' content={cartItems} />
  );

  const [customerDetails, setCustomerDetails] = useState({
    id: '',
    content: {
      first: '',
      last: '',
      address: '',
    },
  });

  const getCartDetails = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response = await fetch(
      `/cart/${Cookies.get('user')}`,
      requestOptions
    );
    if (response.status != 200) {
      alert('Failed to get Cart!');
    } else if (response.status === 200) {
      const cartData = await response.json();
      console.log('Fetch cart: ');
      let items = [];
      for (var i = 0; i < cartData.cart.length; i++) {
        items.push({
          id: cartData.cart[i].product,
          content: (
            <CartItem
              itemName={cartData.cart[i].name}
              imageUrl={cartData.cart[i].image}
              itemQuantity={cartData.cart[i].quantity}
              itemPrice={cartData.cart[i].price}
              productRouteId={cartData.cart[i].product}
              handleRemove={handleRemove}
            />
          ),
        });
      }
      setCartItems(items);
    }
  };

  const getCustomerDetails = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response = await fetch(`/auth/user/${token}`, requestOptions);
    if (response.status != 200) {
      alert('Failed to get Customer Details!');
    } else if (response.status === 200) {
      const data = await response.json();
      setCustomerDetails(data);
    }
  };

  useEffect(() => {
    getCartDetails();
    getCustomerDetails();
  }, []);

  useEffect(() => {
    console.log('Changed');
    console.log('Changed: ', cartItems);
  }, [cartItems]);

  const handleRemove = async (productToRemoveId) => {
    // Given a productId, remove it from the cartItems list (displayed to the user)
    console.log('Hello!', cartItems);
    // Frontend Remove Item from Cart
    // setCartItems(cartItems.filter((item) => item.id !== productId));
    // Backend Remove Item from Cart
    const cartRemoveBody = {
      uid: Cookies.get('user'),
      productId: productToRemoveId,
    };
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(cartRemoveBody),
    };

    const response = await fetch('/cart', requestOptions);
    if (response.status != 200) {
      alert('Failed to reove from Cart!');
    } else if (response.status === 200) {
      const data = await response.json();
      console.log('Cart Remove Response: ', data);
    }
  };

  // useEffect(() => {
  //   setCartAccordian(<Accordian title='Items' content={cartItems} />);
  // }, [cartItems]);

  return (
    <div className='CartPage'>
      <h2 style={{ fontSize: '24px' }}>SHOPPING CART</h2>
      {cartItems.map((item) => (
        <div>{item.content}</div>
      ))}
      {/* {cartItems} */}
      {/* <Accordian title='Items' content={cartItems} /> */}
      <Accordian
        title='Customer Details'
        content={
          <CustomerDetailsSection
            firstName={customerDetails.content.first}
            lastName={customerDetails.content.last}
            email={customerDetails.id}
            address={customerDetails.content.address}
          />
        }
      />
      <Link to={'/checkout'}>
        <TextButton buttonName='Checkout' buttonType='submit' />
      </Link>
    </div>
  );
}

export default CartPage;
