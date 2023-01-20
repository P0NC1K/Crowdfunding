import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Alert, Snackbar, Stack } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import DonateModal from "../Components/DonateModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [serverity, setSeverity] = useState("error");
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [page, setPage] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      name: "Actions",
      label: "Actions",
      options: {
        // onRowClick: false,
        // filter: false,
        // viewColumns: false,
        // sort: false,
        // empty: true,
        // display: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box>
              <Button
                name="donate"
                id="donate"
                onClick={(event) => {
                  event.stopPropagation();
                  handleOpen();
                  setCurrentCampaign({
                    name: tableMeta.rowData[1],
                    id: tableMeta.rowData[0],
                  });
                }}
              >
                Donate
              </Button>
            </Box>
          );
        },
      },
    },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        setIsFetching(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/campaign?page=${page}`
        );
        setData(data.rows);
        setDataCount(data.count);
        setIsFetching(false);
        console.log(data);
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
      console.log(action);
      console.dir(state);
      if (action === "changePage") {
        console.log("Go to page", state.page);
        setPage(state.page);
      }
    },
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <Box sx={{ textAlign: "end" }}>
        <Button
          onClick={() => navigate("login")}
          sx={{ marginBottom: "16px" }}
          variant="contained"
        >
          Login Campaigner
        </Button>
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
      <DonateModal
        open={open}
        handleClose={handleClose}
        campaignId={currentCampaign?.id}
        name={currentCampaign?.name}
        setMessage={setMessage}
        setShowAlert={setShowAlert}
        setSeverity={setSeverity}
      />
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={showAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <Alert onClose={handleAlertClose} severity={serverity} sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
};

export default Dashboard;
