import Head from "next/head";
import {
  Box,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { assesmentSubmission } from "src/api/Api";
import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/navigation";
import { getUserData } from "src/api/Api";
import { selfassessmentresult } from "src/data/selfassessmentmap";

const Page = () => {
  const router = useRouter();
  const [selfAssessmentPending,setSelfAssessmentPending]=useState(false);
  const [questions, setQuestions] = useState(selfassessmentresult);
  const obj = questions.reduce((acc, question, key) => {
    return {
      ...acc,
      [question.question]: question.provided_answer,
    };
  }, []);

  const handleAnswer = (id, ans) => {
    const updated_questions = questions.map((obj) => {
      if (obj.id === id) {
        obj["provided_answer"] = ans;
      }
      return obj;
    });
    setQuestions(updated_questions);
  };

  const handleSubmit = async (event) => {
    for (let i = 0; i < 9; i++) {
      if (!questions[i].provided_answer) {
        alert("Please answer all questions");
        return;
      }
    }
    const token = window.sessionStorage.getItem("token");
    let req = {};
    for (let i = 0; i < 9; i++) {
      req[`Question${i + 1}`] = questions[i].provided_answer + "";
    }
    console.log(req);
    const res = await assesmentSubmission({ data: req, token });
    console.log(res);
    if (res){
      router.push('/counsellorReview');
    }
  };


useEffect(()=>{
  
    async function checkAssesmentStatus() {
    const token = window.sessionStorage.getItem("token");
    const res=await getUserData(token);

    return res;
  }
  checkAssesmentStatus().then((res)=>{
    console.log(res)
    setSelfAssessmentPending(res[0].assessment);
  })
  },[])
  
  return (
    <>
      <Head>
        <title>Assessment | Medical Web Assistant</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <>
        {(selfAssessmentPending) ? 
           
           <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="h4">Your file is in progress</Typography>
        </Grid>

          :

           <form container required>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h4">Assessment</Typography>
          </Grid>
          <Grid item xs={12} style={{ margin: 40 }}>
            {questions.map((obj) => (
              <>
                <Grid item xs={12} style={{ marginBottom: 25 }}>
                  <b>
                    Q{obj.id}: {obj.question}
                  </b>
                  <br />

                  <b style={{ color: "grey" }}>
                    Option
                    <FormControl required>
                      <Select style={{ height: "40px" }}>
                        <MenuItem
                          value="Not At All"
                          defaultValue=""
                          required
                          onClick={(e) => handleAnswer(obj.id, 1)}
                        >
                          Not At All{" "}
                        </MenuItem>
                        <MenuItem
                          value="Several Days"
                          defaultValue=""
                          required
                          onClick={(e) => handleAnswer(obj.id, 2)}
                        >
                          Several Days
                        </MenuItem>
                        <MenuItem
                          defaultValue=""
                          required
                          value="More Than Half the Days"
                          onClick={(e) => handleAnswer(obj.id, 3)}
                        >
                          More Than Half the Days
                        </MenuItem>
                        <MenuItem
                          defaultValue=""
                          required
                          value="Nearly Every Day"
                          onClick={(e) => handleAnswer(obj.id, 4)}
                        >
                          Nearly Every Day
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </b>
                </Grid>
              </>
            ))}
            <Button fullWidth onClick={handleSubmit}>
              {" "}
              Submit
            </Button>
          </Grid>
            </form>
         
         
        }
        
        
        </>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
