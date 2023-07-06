import Head from 'next/head';
import React, { useEffect, useState } from "react";
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { getInsighData } from "src/api/Api";

const now = new Date();

const Page = () => {
  const [insightData,setInsightData]=useState(false);
  useEffect(()=>{
    console.log("hellow")
    async function checkInsightStatus() {
    const token = window.sessionStorage.getItem("token");
    console.log(token)
    const res=await getInsighData(token);
  
    return res;
  }
  checkInsightStatus().then((res)=>{
    console.log(res)
    setInsightData(res);
  })
  },[])
  return(
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
      
     
        
        {(insightData) ? 
           
          <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalCustomers
              
             
              sx={{ height: '100%' }}
              value="1.6k"
              data={insightData}
            />
          </Grid>
          
          
          <Grid
            xs={12}
            lg={8}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: 'Data',
                  data: [insightData.number_of_rejectedcounselors,
                        insightData.number_of_rejectedpatients,
                        insightData.numbers_of_patients_appointment_counselors,
                        insightData.number_of_patients_without_selfasssessment,


                  ]
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
              chartSeries={[insightData.number_of_active_doctors,
                insightData.number_of_active_counselors,
                insightData.number_of_rejectedpatients,
                insightData.numbers_of_patients_appointment_counselors,
              ]}
              title="Active Users"
              labels={['Doctors', 'Counsellors', 'Patients Rejected','Patient Appointment with counsellors']}
              sx={{ height: '100%' }}
            />
            
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
              chartSeries={[insightData.number_of_inactive_counselors,
                insightData.number_of_inactive_doctors,
                insightData.number_of_patients_without_selfasssessment,
              ]}
              title="Inactive Users"
              labels={['Counsellors', 'Doctors', 'Patients']}
              sx={{ height: '100%' }}
            />
            
          </Grid>
         
        </Grid>
      </Container>

          :

           <>
           </>
         
         
        }
        
        
        
    </Box>
  </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
