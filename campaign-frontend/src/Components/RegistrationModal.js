import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Typography,
  Box,
  Button,
  TextField,
  Modal,
  createTheme,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import dayjs from "dayjs";
import axios from "axios";
import jwtDecode from "jwt-decode";

const validationSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  goalAmount: yup.number().required(),
  expirationDate: yup.date().required(),
});

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

const RegistrationModal = ({
  open,
  handleClose,
  setMessage,
  setShowAlert,
  setSeverity,
}) => {
  const [value, setValue] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("username"),
      description: data.get("description"),
      goalAmount: data.get("goalAmount"),
    });
  };

  const initialValues = {
    name: "",
    description: "",
    goalAmount: "",
    expirationDate: "",
  };

  const postCampaign = async (payload) => {
    try {
      const token = localStorage.getItem("accessToken");
      const user = jwtDecode(token);
      payload.userId = user.id;
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/campaign/create`,
        payload
      );
      handleClose();
      setMessage(data.message);
      setShowAlert(true);
      setSeverity("success");
     
    } catch (error) {
      handleClose();
      setMessage(error.response.data.message);
      setShowAlert(true);
      setSeverity("error");
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm({ values: initialValues });
      postCampaign(values);
      // handleRequest(values);
    },
  });

  console.log(formik.errors);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ width: "100%", textAlign: "end" }}>
          <IconButton
            sx={{ marginRight: "-20px" }}
            onClick={() => handleClose()}
            aria-label="Example"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography component="h1" variant="h5">
          Registration
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoComplete="description"
            autoFocus
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="goalAmount"
            label="Goal Amount $"
            name="goalAmount"
            autoComplete="goalAmount"
            type="number"
            autoFocus
            value={formik.values.goalAmount}
            onChange={formik.handleChange}
            error={
              formik.touched.goalAmount && Boolean(formik.errors.goalAmount)
            }
            helperText={formik.touched.goalAmount && formik.errors.goalAmount}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expiration Date"
              value={formik.values.expirationDate}
              name="expirationDate"
              onChange={(newValue) => {
                formik.setFieldValue(
                  "expirationDate",
                  dayjs(newValue).toISOString()
                );
              }}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={"Expiration Date"}
                  fullWidth
                  error={
                    formik.touched.expirationDate &&
                    Boolean(formik.errors.expirationDate)
                  }
                />
              )}
            />
            <FormHelperText id="my-helper-text" error>
              {formik.touched.patientDOB && formik.errors.patientDOB}
            </FormHelperText>
          </LocalizationProvider>
          <Button
            type="button"
            onClick={(e) => formik.handleSubmit()}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registration
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RegistrationModal;
