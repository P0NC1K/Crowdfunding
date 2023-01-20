import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, Box, Button, TextField, Modal, IconButton } from "@mui/material";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "12px 32px 32px 32px",
  borderRadius: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const DonateModal = ({ open, handleClose, name, campaignId, setMessage, setShowAlert, setSeverity }) => {


  const validationSchema = yup.object({
    name: yup.string().required(),
    amount: yup.number().required()
  })

  const initialValues = {
    name: '',
    amount: ''
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm({ values: initialValues });
      handleSubmit(values);
      console.log(values);
      // handleRequest(values);
    },
  });

  const handleSubmit = async (payload) => {
    try {
      payload.campaignId = campaignId
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/donation/create`, payload)
      handleClose();
      setMessage(response.data.message);
      setShowAlert(true);
      setSeverity('success')
    } catch (error) {
      console.log(error);
      handleClose();
      setMessage(error.response.data.message);
      setShowAlert(true);
      setSeverity('error')
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ width: "100%", textAlign: "end" }}>
          <IconButton sx={{ marginRight: "-20px" }} onClick={() => handleClose()} aria-label="Example">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography component="h1" variant="h5">
          Donate {name}
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nick name"
            name="name"
            autoComplete="name"
            onChange={formik.handleChange}
            autoFocus
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="amount"
            label="Amount"
            name="amount"
            autoComplete="amount"
            onChange={formik.handleChange}
            autoFocus
            error={
              formik.touched.amount && Boolean(formik.errors.amount)
            }
            helperText={formik.touched.amount && formik.errors.amount}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}>
            Donate
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DonateModal;
