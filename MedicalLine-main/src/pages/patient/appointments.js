import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Stack,
  Grid,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import { PatientsTable } from "src/sections/patients/appointment-table";
import {
  getAllPatientCounselorAppointment,
  getAllPatientDoctorAppointment,
  getAllPatientCounselorAppointmentByDate,
  getAllPatientDoctorAppointmentByDate,
} from "src/api/Api";

const now = new Date();

const data = [];

const usepatients = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useCustomerIds = (patients) => {
  return useMemo(() => {
    return patients.map((customer) => customer.id);
  }, [patients]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [appointmentList, setAppointmentList] = useState([]);
  const [fullAppointmentList, setfullAppointmentList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const patients = usepatients(page, rowsPerPage);
  const patientsIds = useCustomerIds(patients);
  const patientsSelection = useSelection(patientsIds);
  const formattedDateTime = null;
  const minDateTime = new Date().toISOString().slice(0, -8);
  const [date, setDate] = useState("");
  const [error, setError] = useState();

  useEffect(() => {
    const getAppointmentList = async () => {
      const counselorList = await getAllPatientCounselorAppointment(
        window.sessionStorage.getItem("token")
      );
      const doctorList = await getAllPatientDoctorAppointment(
        window.sessionStorage.getItem("token")
      );
      const appointmentList = counselorList.concat(doctorList)
      console.log("Combined " + appointmentList)
      setAppointmentList(appointmentList)
    };
    getAppointmentList();
  }, []);

  const handleFetchAppointmentsByDate = async () => {
    if (!date) {
      setError(true);
    } else {
      await setError(false);
      const token = window.sessionStorage.getItem("token");
      console.log(date + " date");
      const counselorList = await getAllPatientCounselorAppointmentByDate({date, token}); 
      const doctorList = await getAllPatientDoctorAppointmentByDate({date, token});
      const appointmentList = counselorList.concat(doctorList);
      await setAppointmentList(appointmentList)
    }
  };

  const handleDateTimeChange = (event) => {
    const newDateTime = new Date(event.target.value);
    const year = newDateTime.getFullYear();
    const month = String(newDateTime.getMonth() + 1).padStart(2, "0");
    const day = String(newDateTime.getDate() + 1).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    //console.log(formattedDate)
    setDate(formattedDate);
  };

  const handleReset = useCallback(() => {
    setError(false);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Appointments List</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        {/* <Grid item xs={8} style={{ textAlign: "center" }}>
          <TextField
            variant="outlined"
            required
            InputLabelProps={{
              shrink: true,
              style: { marginTop: "0.2rem" },
            }}
            format="yyyy-MM-dd"
            value={formattedDateTime}
            inputProps={{ min: minDateTime }}
            label="Date and Time"
            type="date"
            onChange={(event) => handleDateTimeChange(event)}
          />
          {error && (
            <Typography variant="h6" color="error" align="center" style={{ marginBottom: 0 }}>
              Select a date
            </Typography>
          )}
          <br />
          <Button
            onClick={handleFetchAppointmentsByDate}
            variant="contained"
            color="primary"
            sx={{ margin: "1px 0 0 0" }}
          >
            View Appointments
          </Button>
          {<Button onClick={handleReset} variant="contained" color="primary" sx={{ margin: '1px 0 0 0' }}>
            Reset
          </Button> }
        </Grid> */}
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Appointments List</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
            </Stack>
            <PatientsTable
              count={data.length}
              items={appointmentList}
              onDeselectAll={patientsSelection.handleDeselectAll}
              onDeselectOne={patientsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={patientsSelection.handleSelectAll}
              onSelectOne={patientsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={patientsSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
