import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getCounsellorDoctors, managerGetAllDoctors } from "src/api/Api";
import { DoctorsTable } from "src/sections/doctors/doctos-table";
import {
  DoctorsAcceptanceTable,
  UserAcceptanceTable,
} from "src/sections/user/user-acceptance-table";

const Page = () => {
  const [doctorsList, setDoctorsList] = useState([]);

  useEffect(() => {
    const getDoctorsList = async () => {
      const token = window.sessionStorage.getItem("token");
      console.log(token);
      return await managerGetAllDoctors(token);
    };

    getDoctorsList().then((doctors) => {
      setDoctorsList(doctors);
      console.log(doctors);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Doctors List</title>
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
                <Typography variant="h4">Doctors List</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
            </Stack>
            <UserAcceptanceTable items={doctorsList} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
