import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { getSelfAssessment } from "src/api/Api";
import {convertToList} from '../../data/selfassessmentmap';
import {
  TableCell,
  TableRow,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useRouter } from "next/navigation";

export const DoctorManagePatientTable = (props) => {
  const { items = null} = props;

  const styles = {
    primary: {
      fontSize: "16px",
      fontWeight: 600,
      color: "black",
    },
    secondary: {
      fontSize: "14px",
      fontWeight: 600,
      color: "blue",
    },
  };

  const [openReport, setOpenReport] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [listofQuestions, setList] = useState(new Map([]));
  const router = useRouter();
  
  
  const handleClose = async () => {
    setOpenAction(false);
  };


  const handlegetAssessment = async (email) => {
    const token = window.sessionStorage.getItem("token");
    console.log(email + " Email");
    const res = await getSelfAssessment({ token, email });
    if (res) {
      const list = await convertToList(res);
      setList(list);
    }
    //TODO ERROR
  };

  // const cancelAppointment =async (email)=>{
  //   console.log("reject")
  // }

  if(items && !items.length){
    return <div>
    No data found
  </div>}

  return (  
        <Box
          component="main"
          sx={{
          flexGrow: 1,
          py: 8
        }}>
    {items?.map((appointment,idx) => {
      if (appointment) {
        return (
          <TableRow>

             <TableCell><Typography variant="h6">{idx+1}</Typography></TableCell>
             <TableCell><Typography variant="h6">{appointment.Appointment}</Typography></TableCell>
             <TableCell><Typography variant="h6">{appointment.Counselor}</Typography></TableCell>
             <TableCell><Typography variant="h6">{appointment.Doctor}</Typography></TableCell>  
             <TableCell><Typography variant="h6">{appointment.Firstname} {appointment.Lastname}</Typography></TableCell>
             <TableCell><Typography variant="h6">{appointment.Patient}</Typography></TableCell>
             <TableCell><Typography variant="h6">{appointment.AssignDoctor}</Typography></TableCell>
             <Button onClick={()=>handlegetAssessment(appointment.Patient)} variant="contained"> View File</Button>
             {/* <Button onClick={()=>cancelAppointment(appointment.Patient)} variant="contained"> Reject Patient</Button> */}
             <Dialog
                          BackdropProps={{
                            invisible: true,
                            style: { opacity: 1 },
                          }}
                          maxWidth="lg"
                          fullWidth={true}
                          PaperProps={{
                            style: {
                              maxHeight: "90vh",
                              minHeight: "90vh",
                            },
                          }}
                          open={openReport}
                          onClose={handleClose}
                        >
                          <DialogTitle>Self Assessment Result</DialogTitle>
                          <DialogContent>
                            <List>
                              {Array.from(listofQuestions).map(([question, answer], index) => (
                                <ListItem key={index}>
                                  <ListItemText
                                    primary={question}
                                    secondary={answer}
                                    primaryTypographyProps={{ style: styles.primary }}
                                    secondaryTypographyProps={{ style: styles.secondary }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </DialogContent>
             </Dialog>
            
          </TableRow>
            );
            }
        })}

    </Box>

  );
};

DoctorManagePatientTable.propTypes = {
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
