import PropTypes, { array } from "prop-types";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  Button,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";

import { Scrollbar } from "src/components/scrollbar";
import { useState, useEffect } from "react";
import { putPatientCounselorAppointment, putPatientDoctorAppointment } from "src/api/Api";

export const PatientsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const formattedDateTime = null;
  const minDateTime = new Date().toISOString().slice(0, -8);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [openAction, setOpenAction] = useState(false);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");


  const [errorMessageAction, setErrorMessageAction] = useState("");
  const [successMessageAction, setSuccessMessageAction] = useState("");

  const handleClickOpen = (appointment, appointmentId) => {
    console.log("Appointment: " + JSON.stringify(appointment))
    if (appointment.hasOwnProperty('AssigntoDoctor')) {
      setRole('counselor')
      //console.log("counselor " + JSON.stringify(appointment)); 
    } else {
      setRole('doctor')
      //console.log("doctor " + JSON.stringify(appointment));
    }
    setId(appointmentId);
    //console.log("ID " + id);
    setOpenAction(true);
    setToken(window.sessionStorage.getItem("token"));
  };

  const handleDateTimeChange = (event) => {
    const newDateTime = new Date(event.target.value);
    const year = newDateTime.getFullYear();
    const month = String(newDateTime.getMonth() + 1).padStart(2, "0");
    const day = String(newDateTime.getDate()).padStart(2, "0");
    const hours = String(newDateTime.getHours()).padStart(2, "0");
    const minutes = String(newDateTime.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:00`;
    setDate(formattedDate);

    //console.log("newDateTime " + newDateTime)
    //console.log("formattedDate " + formattedDate)
    //console.log("date " + date)

    setErrorMessageAction("");
    setSuccessMessageAction("");
  };

  const handleClose = async () => {
    setErrorMessageAction("");
    setSuccessMessageAction("");
    setOpenAction(false);
  };

  const handleReject = async () => {
    if (description.length === 0) {
      setErrorMessageAction("Fill the required information before saving");
    } else {
      const data = {
        id: id,
        Accept: false,
        Description: description,
      };

      if(role === "doctor"){
        const response = await putPatientDoctorAppointment(data, token);
        //console.log("ResponseDoc " + JSON.stringify(response))
        if (response.Error) {
          setErrorMessageAction(response.Error);
          setSuccessMessageAction("");
        } else if (response[0].id) {
          setErrorMessageAction("");
          setSuccessMessageAction(
            "Appointment has been rejected!"
          );
        } else {
          setErrorMessageAction(
            "Action Failed. Something went wrong. Please contact the administrator"
          );
          setSuccessMessageAction("");
        }
      }
      else {
        const response = await putPatientCounselorAppointment(data, token);
        //console.log("ResponseCounselor " + JSON.stringify(response))
        if (response.Error) {
          setErrorMessageAction(response.Error);
          setSuccessMessageAction("");
        } else if (response[0].id) {
          setErrorMessageAction("");
          setSuccessMessageAction(
            "Patient has been rejected!"
          );
        } else {
          setErrorMessageAction(
            "Action Failed. Something went wrong. Please contact the administrator"
          );
          setSuccessMessageAction("");
        }
      }
      

      
    }
    setDescription("");
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          {items && items.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Counsellor</TableCell>
                  <TableCell>Appointment</TableCell>
                  <TableCell>Reject Appointment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items &&
                  items.map((appointment, idx) => {
                    const reversedIdx = items.length - idx - 1;
                    if (appointment && new Date(items[reversedIdx].Appointment)
                    .toISOString()
                    .replace("Z", "")
                    .replace("T", " ")
                    .replace(".000", "") !== "1970-01-01 00:00:00") {
                      return (
                        <TableRow>
                          <TableCell>
                            <Typography variant="containerd">{idx + 1}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="containerd">
                              {items[reversedIdx].Patient}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="containerd">
                              {items[reversedIdx].Doctor ? items[reversedIdx].Doctor : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="containerd">
                              {items[reversedIdx].Counselor ? items[reversedIdx].Counselor : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="containerd">
                              {new Date(items[reversedIdx].Appointment)
                                .toISOString()
                                .replace("Z", "")
                                .replace("T", " ")
                                .replace(".000", "")}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <Button
                              onClick={async () => handleClickOpen(items[reversedIdx], items[reversedIdx].id)}
                              variant="contained"
                              color="error"
                              disabled={items[reversedIdx].RejectedByPatient}
                            >
                              Reject
                            </Button>
                            <Dialog
                              BackdropProps={{
                                invisible: true,
                                style: { opacity: 1 },
                              }}
                              maxWidth="sm"
                              fullWidth={true}
                              PaperProps={{
                                style: {
                                  maxHeight: "80vh",
                                  minHeight: "40vh",
                                },
                              }}
                              open={openAction}
                              onClose={handleClose}
                            >
                              <DialogTitle>Add a reason for Rejection</DialogTitle>
                              <DialogContent>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  required
                                  fullWidth
                                  margin="none"
                                  multiline
                                  rows={4}
                                  value={description}
                                  label="Description"
                                  type="description"
                                  onChange={(event) => {
                                    setDescription(event.target.value);
                                    setErrorMessageAction("");
                                    setSuccessMessageAction("");
                                  }}
                                />
                                <Button
                                  sx={{
                                    backgroundColor: "#4CAF50",
                                    color: "#ffffff",
                                    "&:hover": {
                                      backgroundColor: "#357a38",
                                    },
                                    mr: 2,
                                    mt: 1,
                                  }}
                                  onClick={handleReject}
                                  variant="contained"
                                  color="primary"
                                  margintop="10"
                                >
                                  Save
                                </Button>
                                {successMessageAction && (
                                  <Typography color="primary" variant="body1" fontWeight="bold">
                                    {successMessageAction}
                                  </Typography>
                                )}
                                {errorMessageAction && (
                                  <Typography color="error" variant="body1" fontWeight="bold">
                                    {errorMessageAction}
                                  </Typography>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="h6" align="center" sx={{ margin: "16px" }}>
              No data found
            </Typography>
          )}
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage="30"
        rowsPerPageOptions={[30, 35]}
      />
    </Card>
  );
};

PatientsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
