import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  managerUpdateCounsellorStatus,
  managerUpdateDoctorStatus,
  managerUpdatePatientStatus,
} from "src/api/Api";
import { Scrollbar } from "src/components/scrollbar";

export const UserAcceptanceTable = (props) => {
  const { items = [] } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                if (user) {
                  let buttonLabel = user.accept ? "Deactivate" : "Activate";
                  return (
                    <TableRow>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Button
                          onClick={async () => {
                            let data = {
                              email: user.email,
                              accept: !user.accept,
                              description: "doctor accepted",
                            };
                            if (window.location.href.includes("doctors")) {
                              await managerUpdateDoctorStatus(
                                data,
                                window.sessionStorage.getItem("token")
                              );
                              location.reload();
                            } else if (window.location.href.includes("counsellors")) {
                              await managerUpdateCounsellorStatus(
                                data,
                                window.sessionStorage.getItem("token")
                              );
                              location.reload();
                            } else if (window.location.href.includes("patients")) {
                              await managerUpdatePatientStatus(
                                data,
                                window.sessionStorage.getItem("token")
                              );
                              location.reload();
                            }
                          }}
                        >
                          {buttonLabel}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};
