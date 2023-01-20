import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {  Box, Modal,  IconButton, Chip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "12px 32px 32px 32px",
  borderRadius: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const CampaignerDetailModal = ({ show, handleHide, name, campaignId }) => {
  console.log("campaignId", campaignId)
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const columns = [
    {
      name: 'name',
      label: 'Name'
    },
    {
      name: 'amount',
      label: 'Amount'
    },
    {
      name: 'state',
      label: 'State',
      options: {
        customBodyRender: (value) => {
          if (value === "valid") return <Chip label="Valid" color="success" />;
          if (value === "invalid") return <Chip label="Invalid" color="error" />;
          else return <p>-</p>;
        },
      },
    }
  ]

  const options = {
    selectableRows: false,
    onTableChange: (action, state) => {
      console.log(action);
      console.dir(state);
    },
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsFetching(true);
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/donation?campaignId=${campaignId}`);
        setData(data.donations);
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        console.log(error);
      }
    }
    getData();
  }, [campaignId]);

  return (
    <Modal
      open={show}
      onClose={handleHide}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ width: "100%", textAlign: "end" }}>
          <IconButton sx={{ marginRight: "-20px" }} onClick={() => handleHide()} aria-label="Example">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 1, width: "100%" }}>
          <MUIDataTable title={"Campaigner Details"} data={data} columns={columns} options={options} />
        </Box>
      </Box>
    </Modal>
  );
};

export default CampaignerDetailModal;
