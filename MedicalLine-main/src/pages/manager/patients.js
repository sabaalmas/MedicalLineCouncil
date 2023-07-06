import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import { PatientsTable } from "src/sections/patients/patient-manager-table";
import { getCounsellorPatients, managerGetAllPatients } from "src/api/Api";
import { UserAcceptanceTable } from "src/sections/user/user-acceptance-table";

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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const patients = usepatients(page, rowsPerPage);
  const patientsIds = useCustomerIds(patients);
  const patientsSelection = useSelection(patientsIds);

  useEffect(() => {
    const getPatientList = async () => {
      return await managerGetAllPatients(window.sessionStorage.getItem("token"));
    };

    getPatientList().then((patients) => {
      setPatientList(patients);
      console.log(patients);
    });
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
        <title>Patients List</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Patients List</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
            </Stack>
            <UserAcceptanceTable items={patientList} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
