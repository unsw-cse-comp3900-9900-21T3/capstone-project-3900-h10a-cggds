import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import Rating from '@mui/material/Rating';
import { Link } from 'react-router-dom';

import './ExploreProductContainer.css';

/* Documentation */
/*
  image: image of the product
  name: name of the product
  price: price of the product
  id: product id
  reviewsNum: number of reviews posted for the product
  avgRating: average star ratings of the product
*/

function ExploreProductContainer({ image, name, price, id, reviewsNum, avgRating }) {
	var ratings = '';

	// Set ratings (text being shown)
	if (avgRating !== 0) {
		const rating = Math.round(avgRating * 10) / 10;
		ratings = `${rating} (${reviewsNum})`;
	}
	else {
		ratings = `0.0 (${reviewsNum})`;
	}

  return (
		<div className='ExploreProductContainer'>
			<div className='ExploreProductContainer-image-wrapper'>
				<Link to={`/product/${id}`} style={{ textDecoration: 'none' }}>
					<div className='ExploreProductContainer-image-section'>
						<img
							className='ExploreProductContainer-image'
							src={image}
							alt={name}
						/>
					</div>
					<div className='ExploreProductContainer-image-hovertext'>
						<Typography style={{ color: '#FFFFFF' }} variant='button'>
							Click to view product
						</Typography>
					</div>	
				</Link>
			</div>
			<div className='ExploreProductContainer-name'>
				<Link to={`/product/${id}`} style={{ textDecoration: 'none' }}>
					<Typography variant='body2' style={{ color: '#000000' }}>{name}</Typography>
				</Link>
			</div>
			<div className='ExploreProductContainer-bottom'>
				<div className='ExploreProductContainer-rating'>
					<Rating
						name='customized-1'
						defaultValue={1}
						max={1}
						readOnly
					/>
					<Typography variant='subtitle2' style={{ paddingRight: '3px' }}>{ratings}</Typography>
				</div>
				<Typography variant='body1'>${price}</Typography>
				<Link to={`/product/${id}`} style={{ textDecoration: 'none' }}>
					<Button
						style={{
							backgroundColor: '#000000',
							color: '#FFFFFF',
							borderRadius: '10px',
							width: '250px',
							marginTop: '20px',
						}}
						variant='contained'
					>
						VIEW PRODUCT
					</Button>
				</Link>
			</div>
		</div>
  );
}

export default ExploreProductContainer;
