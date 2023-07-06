import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getCounsellorDoctors, managerGetAllCounsellors } from "src/api/Api";
import { CounsellorsTable } from "src/sections/counsellor/counsellors-table";
import { UserAcceptanceTable } from "src/sections/user/user-acceptance-table";

const Page = () => {
  const [counsellorsList, setCounsellorsList] = useState([]);

  useEffect(() => {
    const getDoctorsList = async () => {
      const token = window.sessionStorage.getItem("token");
      console.log(token);
      return await managerGetAllCounsellors(token);
    };

    getDoctorsList().then((counsellors) => {
      setCounsellorsList(counsellors);
      console.log(counsellors);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Counsellors List</title>
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
                <Typography variant="h4">Counsellors List</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
            </Stack>
            <UserAcceptanceTable items={counsellorsList} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
