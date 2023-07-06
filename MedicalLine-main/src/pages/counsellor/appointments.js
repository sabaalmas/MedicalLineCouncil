import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, Grid, TextField, Typography, FormHelperText } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import { PatientsTable } from "src/sections/counsellor/appointment-table";
import { getCounsellorPatients, getAllcounsellorAppointmentByDate } from "src/api/Api";

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
  const [patientList, setPatientList] = useState([]);
  const [fullPatientList, setfullPatientList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const patients = usepatients(page, rowsPerPage);
  const patientsIds = useCustomerIds(patients);
  const patientsSelection = useSelection(patientsIds);
  const formattedDateTime = null;
  const minDateTime = new Date().toISOString().slice(0, -8);
  const [date, setDate] = useState("");
  const [error, setError] = useState();


  useEffect(() => {
    const getPatientList = async () => {
      const patients = await getCounsellorPatients(window.sessionStorage.getItem("token"));
      setPatientList(patients);
      setfullPatientList(patients);
      //console.log("Full patient list: " + JSON.stringify(patients));
    };
    getPatientList();
  }, []);
  


  const handleDateTimeChange = (event) => {
    const newDateTime = new Date(event.target.value);
    const year = newDateTime.getFullYear();
    const month = String(newDateTime.getMonth() + 1).padStart(2, "0");
    const day = String(newDateTime.getDate() + 1).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    //console.log(formattedDate)
    setDate(formattedDate);
  };

  const handleFetchAppointmentsByDate = async () => {
    if(!date){
        setError(true)
        //console.log("Full2 " + JSON.stringify(fullPatientList))
        await setfullPatientList(fullPatientList)
        await setPatientList(fullPatientList)
    }
    else {
      await setError(false)
      const token = window.sessionStorage.getItem("token");
      console.log(date + " date");
      const res = await getAllcounsellorAppointmentByDate({date, token});
      await setPatientList(res);
      await setfullPatientList(fullPatientList)
      //console.log("Full3 " + JSON.stringify(fullPatientList))
    }
  };

  const handleReset = useCallback(() => {
    //console.log("Full1 " + JSON.stringify(fullPatientList))
    setPatientList(fullPatientList)
    //console.log("Full14 " + JSON.stringify(patientList))
    setError(false)
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
        <Grid item xs={8} style={{ textAlign: "center" }}>
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
          {error && <Typography variant="h6" color="error" align="center" style={{ marginBottom: 0 }}>Select a date</Typography>}
        <br />
          <Button onClick={handleFetchAppointmentsByDate} variant="contained" color="primary" sx={{ margin: '1px 0 0 0' }}>
            View Appointments
          </Button>
          {/* <Button onClick={handleReset} variant="contained" color="primary" sx={{ margin: '1px 0 0 0' }}>
            Reset
          </Button> */}
        </Grid>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Patients List</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
            </Stack>
            <PatientsTable
              count={data.length}
              items={patientList}
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
