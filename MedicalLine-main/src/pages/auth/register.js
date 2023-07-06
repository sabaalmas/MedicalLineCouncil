import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  Divider,
  IconButton,
  InputAdornment,
  Visibility,
  VisibilityOff,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useState } from "react";

const Page = ({}) => {
  const router = useRouter();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      role: "patient",
      phoneNumber: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      phoneNumber: "",
      birthDate: "",
      address: "",
      submit: null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(255).required("First Name is required"),
      lastName: Yup.string().max(255).required("Last Name is required"),
      username: Yup.string().max(255).required("Username is required"),
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      phoneNumber: Yup.number().required("Phone number is required").min(999999999,"Phone number should be 10 digits").max(10000000000,"Phone number should be 10 digits"),
      password: Yup.string().max(255).required("Password is required"),
      passwordConfirmation: Yup.string()
        .max(255)
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Password Confirmation is required"),
      birthDate: Yup.date()
        .max(new Date(), "Birth date cannot be in the future")
        .required("Birth date is required"),
      address: Yup.string().max(255).required("Address is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const response = await auth.signUp(
          values.phoneNumber,
          values.password,
          values.passwordConfirmation,
          values.firstName,
          values.lastName,
          values.email,
          values.birthDate,
          values.username,
          values.address,
          values.role
        );
        console.log("Response: " + JSON.stringify(response));
        if (response.Token) {
          //store something
          router.push("/");
        } else if (response.Error) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: response.Error });
          helpers.setSubmitting(false);
        } else {
          console.log("Register API | Unknown Response Received: " + JSON.stringify(response));
          helpers.setStatus({ success: false });
          helpers.setErrors({
            submit:
              "Something went wrong while fetching your information from the system. Please contact the administrator",
          });
          helpers.setSubmitting(false);
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !formik.values.showPassword });
  };

  return (
    <>
      <Head>
        <title>Register | Medical Line</title>
      </Head>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Username"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                <TextField
                  error={!!(formik.touched.firstName && formik.errors.firstName)}
                  fullWidth
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  label="First Name"
                  name="firstName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                />
                <TextField
                  error={!!(formik.touched.lastName && formik.errors.lastName)}
                  fullWidth
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  label="Last Name"
                  name="lastName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
                <FormControl>
                  <InputLabel id="my-select-label">Select your role</InputLabel>
                  <Select labelId="option-label" name="role" onChange={formik.handleChange}>
                    <MenuItem value="patient">Patient</MenuItem>
                    <MenuItem value="counselor">Counselor</MenuItem>
                    <MenuItem value="doctor">Doctor</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  type={formik.values.showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end"></InputAdornment>,
                  }}
                />
                <TextField
                  error={
                    !!(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)
                  }
                  fullWidth
                  helperText={
                    formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                  }
                  label="Confirm Password"
                  name="passwordConfirmation"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={formik.values.showConfirmPassword ? "text" : "password"}
                  value={formik.values.passwordConfirmation}
                />
                <TextField
                  error={!!(formik.touched.phoneNumber && formik.errors.phoneNumber)}
                  fullWidth
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  label="Phone Number"
                  name="phoneNumber"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="phoneNumber"
                  value={formik.values.phoneNumber}
                />
                <TextField
                  error={!!(formik.touched.birthDate && formik.errors.birthDate)}
                  fullWidth
                  helperText={formik.touched.birthDate && formik.errors.birthDate}
                  name="birthDate"
                  label="Date of Birth"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="date"
                  value={formik.values.birthDate}
                />
                <TextField
                  error={!!(formik.touched.address && formik.errors.address)}
                  fullWidth
                  helperText={formik.touched.address && formik.errors.address}
                  label="Complete Address"
                  name="address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.address}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Register
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
