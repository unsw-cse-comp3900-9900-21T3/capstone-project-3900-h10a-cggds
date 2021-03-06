import React, { useState } from "react";
import { Button } from "@material-ui/core";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import "./AddProductPage.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVOqrvODx6KS-xBGs5guJTrKBJjduEjRI",
  authDomain: "nocta-tech.firebaseapp.com",
  projectId: "nocta-tech",
  storageBucket: "nocta-tech.appspot.com",
  messagingSenderId: "1002605988200",
  appId: "1:1002605988200:web:e91efebc3765fd58b0eedd",
  measurementId: "G-5HBFEX2BNM",
};

const firebaseApp = initializeApp(firebaseConfig);
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp);

function AddProductPage() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // details of the product to be uploaded
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState({
    category: "",
    name: "",
    image: "",
    price: "",
    tag: "",
    description: "",
  });
  const fileInput = React.useRef(null);

  // states and function for alert
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [type, setType] = React.useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  async function submitData() {
    // Check all fields are filled in
    var allFilledIn = true;
    const arr = Object.values(details);
    const arr2 = Object.keys(details);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === '' && arr2[i] !== 'image') {
        console.log(arr2[i]);
        allFilledIn = false;
      }
    }

    // Open error popup if any of fields is left empty
    if (!allFilledIn || !(image instanceof Blob)) {
      setError('Fill in all fields to upload the product!');
      setType('error');
      setOpen(true);
      return;
    }

    // Uploading image to retrieve link
    const storageRef = ref(storage, image.name);

    let snapshot = await uploadBytes(storageRef, image);

    let url = await getDownloadURL(ref(storage, image.name));

    details.image = url;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(details),
    };

    const res = await fetch(`/product`, requestOptions);
    console.log(res);
    if (res.status === 200) {
      const data = await res.json();
      console.log(details);
      setError('Uploaded Product!');
      setType('success');
      setOpen(true);
    }
  }

  // helper function to upload image
  const handleClick = (e) => {
    fileInput.current.click();
  };

  // remove image
  const handleRemove = (e) => {
    setImage("");
    fileInput.current.value = null;
  };

  // set image
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div id="AddProductPage">
      <Box sx={{ maxWidth: "50%" }}>
        <Typography variant="body1">
          Select the Category that this product belongs to:
        </Typography>
        <Typography variant="body1">
          (leave it as None if it does not belong to any Category)
        </Typography>
        <Box
          sx={{
            display: "flex",
            marginTop: "20px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Category (if applicable):</Typography>

          <TextField
            label="Category"
            multiline
            maxRows={8}
            value={details.category}
            onChange={(e) =>
              setDetails({ ...details, category: e.target.value })
            }
            style={{ width: "400px" }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", marginTop: "40px", height: "80%" }}>
        <Box className="file-upload-wrapper">
          <Box className="file-upload-section">
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              src={image ? URL.createObjectURL(image) : null}
              alt={image ? image.name : null}
            />
          </Box>
          <Box className="file-upload-buttons">
            <Button
              onClick={() => {
                handleClick();
              }}
              style={{
                backgroundColor: "#000000",
                color: "#FFFFFF",
                borderRadius: "16px",
              }}
              size="large"
              variant="contained"
            >
              Upload Photo
            </Button>
            <input
              className="file-upload"
              ref={fileInput}
              onChange={handleChange}
              type="file"
            />
            <Button
              onClick={() => {
                handleRemove();
              }}
              style={{
                backgroundColor: "#000000",
                color: "#FFFFFF",
                borderRadius: "16px",
              }}
              size="large"
              variant="contained"
            >
              Remove Photo
            </Button>
          </Box>
        </Box>
        <Box className="inputs-section">
          <div>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
              style={{ width: "400px" }}
            >
              <TextField
                label="Product Name"
                multiline
                maxRows={8}
                value={details.name}
                onChange={(e) =>
                  setDetails({ ...details, name: e.target.value })
                }
                style={{ width: "400px" }}
              />
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
              style={{ width: "400px" }}
            >
              <TextField
                label="Price"
                multiline
                maxRows={8}
                value={details.price}
                onChange={(e) =>
                  setDetails({ ...details, price: e.target.value })
                }
                style={{ width: "400px" }}
              />
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
              className="formWidth"
            >
              <TextField
                label="Tag"
                multiline
                maxRows={8}
                value={details.tag}
                onChange={(e) =>
                  setDetails({ ...details, tag: e.target.value })
                }
                fullWidth
                style={{ width: "400px" }}
              />
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
              style={{ width: "400px" }}
            >
              <TextField
                label="Description"
                multiline
                maxRows={8}
                value={details.description}
                onChange={(e) =>
                  setDetails({ ...details, description: e.target.value })
                }
                minRows={5}
                style={{ width: "400px" }}
              />
            </Box>
          </div>
          <div>
            <Button
              onClick={() => {
                submitData();
              }}
              type="submit"
              style={{
                backgroundColor: "#000000",
                color: "#FFFFFF",
                borderRadius: "16px",
              }}
              size="large"
              variant="contained"
            >
              Upload Product
            </Button>
          </div>
        </Box>
      </Box>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={type}
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
}

export default AddProductPage;
