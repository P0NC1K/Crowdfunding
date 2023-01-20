import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Snackbar, Alert, Stack } from "@mui/material";
import MUIDataTable from "mui-datatables";
import RegistrationModal from "../Components/RegistrationModal";
import CampaignerDetailModal from "../Components/CampaignerDetailModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

const Campaigner = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [serverity, setSeverity] = useState("error");

  const [show, setShow] = React.useState(false);
  const handleShow = () => setShow(true);
  const handleHide = () => setShow(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [page, setPage] = useState(0);
  const [currentCampaign, setCurrentCampaign] = useState(null);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowAlert(false);
  };

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        filter: false,
        display: false,
        viewColumns: false,
      },
    },
    {
      name: "name",
      label: "Name",
    },
    {
      name: "description",
      label: "Description",
    },
    {
      name: "goalAmount",
      label: "Goal",
      options: {
        customBodyRender: (value) => `$${value}`,
      },
    },
    {
      name: "expirationDate",
      label: "Expiration Date",
      options: {
        customBodyRender: (value) => dayjs(value).format("DD/MM/YYYY"),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === "active")
            return <Chip label="Active" color="success" variant="outlined" />;
          if (value === "successful")
            return <Chip label="Successful" color="success" />;
          if (value === "expired")
            return <Chip label="Expired" color="error" variant="outlined" />;
          if (value === "fraud") return <Chip label="Fraud" color="error" />;
          else return <p>-</p>;
        },
      },
    },
    {
      name: "View Campaign",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                console.log(tableMeta.rowData[0]);
                setCurrentCampaign({
                  name: tableMeta.rowData[1],
                  id: tableMeta.rowData[0],
                });
                handleShow();
              }}
            >
              View Details
            </Button>
          );
        },
      },
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
    }
    const user = jwtDecode(token);
    setUser(user);
  }, []);

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("accessToken");
      const user = jwtDecode(token);
      try {
        setIsFetching(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/campaign/user?page=${page}&userId=${user?.id}`
        );
        setData(data.rows);
        setDataCount(data.count);
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        console.log(error);
      }
    };
    getData();
  }, [page]);

  const options = {
    selectableRows: false,
    serverSide: true,
    count: dataCount,
    page: page,
    onTableChange: (action, state) => {
      if (action === "changePage") {
        console.log("Go to page", state.page);
        setPage(state.page);
      }
    },
  };

  console.log("current", currentCampaign);

  return (
    <Box sx={{ padding: "16px" }}>
      <Box sx={{ textAlign: "end" }}>
        <Button
          onClick={() => handleOpen()}
          sx={{ marginBottom: "16px" }}
          variant="contained"
        >
          Registration Campaigner
        </Button>
        <RegistrationModal open={open} handleClose={handleClose}
          setShowAlert={setShowAlert}
          setSeverity={setSeverity}
          setMessage={setMessage}
        />
      </Box>
      {!isFetching && (
        <Box>
          <MUIDataTable
            title={"Campaign Owners List"}
            data={data}
            columns={columns}
            options={options}
          />
        </Box>
      )}
      <CampaignerDetailModal
        show={show}
        handleHide={handleHide}
        campaignId={currentCampaign?.id}
        name={currentCampaign?.name}
        setMessage={setMessage}
        setShowAlert={setShowAlert}
        setSeverity={setSeverity}
        handleClose={handleClose}
      />
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={showAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            severity={serverity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
};

export default Campaigner;
