import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import {  Typography } from "@mui/material";
const now = new Date();


const Page = () => (
  <>
    <Head>
      <title>
        Overview | Medical Line
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
      <Typography align="center" sx={{ mb: 3 }} variant="h5">
             You are logged in now
             <Box
              sx={{
              mb: 3,
              textAlign: "center",
            }}
            >
            <img
              alt="Under development"
              src="/assets/doctor.png"
              style={{
                display: "inline-block",
                maxWidth: "100%",
                width: 400,
              }}
            />
          </Box>
          </Typography>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
