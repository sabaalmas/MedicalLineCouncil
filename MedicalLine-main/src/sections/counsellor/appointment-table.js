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
import { getSelfAssessment, putCounsellorPatients } from "src/api/Api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { convertToList } from "src/data/selfassessmentmap";
import { putDoctorPatients } from "src/api/Api";

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
  const [openAction, setOpenAction] = useState(false);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");

  const [errorMessageAction, setErrorMessageAction] = useState("");
  const [successMessageAction, setSuccessMessageAction] = useState("");

  const handleClickOpen = (patient) => {
    setOpenAction(true);
    setToken(window.sessionStorage.getItem("token"));
    setEmail(patient.Patient);
    setId(patient.id);
    console.log(patient.Patient + " Email");
    console.log(patient.id + " Id");
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

  const handleModify = async () => {
    console.log(email + " Email");
    console.log(id + " Id");
    if (description.length === 0 || !date) {
      setErrorMessageAction("Fill the required information before saving");
    } else {
      const data = {
        id: id,
        Patient: email,
        Appointment: date,
        Accept: true,
        Description: description,
      };

      const response = await putCounsellorPatients(data, token);
      if (response.Error) {
        setErrorMessageAction(response.Error);
        setSuccessMessageAction("");
      } else if (response.id || response.detail) {
        setErrorMessageAction("");
        setSuccessMessageAction(
          "The appointment has been modified to " + new Date(date).toLocaleString()
        );
      } else {
        setErrorMessageAction(
          "Action Failed. Something went wrong. Please contact the administrator"
        );
        setSuccessMessageAction("");
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
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Appointment</TableCell>
                  <TableCell>Modify Appointment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.filter((patient) => patient.Accept == true && patient.Appointment != null)
                  .length == 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((patient, index) => {
                    if (patient.Appointment !== null && patient.Accept) {
                      return (
                        <TableRow key={index}>
                          <TableCell>{patient.Firstname}</TableCell>
                          <TableCell>{patient.Lastname}</TableCell>
                          <TableCell>{patient.Patient}</TableCell>
                          <TableCell>
                            {new Date(patient.Appointment)
                              .toISOString()
                              .replace("Z", "")
                              .replace("T", " ")
                              .replace(".000", "")}
                          </TableCell>

                          <TableCell>
                            <Button
                              onClick={async () => handleClickOpen(patient)}
                              variant="contained"
                              color="primary"
                            >
                              Modify
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
                              <DialogTitle>
                                Select New Date/Time for {patient.Firstname} {patient.Lastname}{" "}
                              </DialogTitle>
                              <DialogContent>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  required
                                  fullWidth
                                  margin="normal"
                                  InputLabelProps={{
                                    shrink: true,
                                    style: { marginTop: "0.2rem" },
                                  }}
                                  format="yyyy-MM-dd'T'HH:mm"
                                  value={formattedDateTime}
                                  inputProps={{ min: minDateTime }}
                                  label="Date and Time"
                                  type="datetime-local"
                                  onChange={(event) => handleDateTimeChange(event)}
                                />
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
                                  onClick={() => handleModify(event, patient.Patient)}
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
                  })
                )}
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
