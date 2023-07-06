import Head from "next/head";
import NextLink from "next/link";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import { Box, Button, Container, SvgIcon, Typography } from "@mui/material";

const Page = () => (
  <>
    <Head>
      <title>success | Medical Line</title>
    </Head>
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              mb: 3,
              textAlign: "center",
            }}
          >
            <img
              alt="Under development"
              src="/success.png"
              style={{
                display: "inline-block",
                maxWidth: "100%",
                width: 100,
              }}
            />
          </Box>
          <Typography align="center" sx={{ mb: 3 }} variant="h3">
             Appointment Confirmed
          </Typography>
         
          <Button
            component={NextLink}
            href="/"
            startIcon={
              <SvgIcon fontSize="small">
                <ArrowLeftIcon />
              </SvgIcon>
            }
            sx={{ mt: 3 }}
            variant="contained"
          >
            Go back to dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  </>
);

export default Page;
