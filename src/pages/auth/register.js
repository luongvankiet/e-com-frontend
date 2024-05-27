import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthContext } from 'src/auth/hooks';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/components/router-link';
import { useRouter, useSearchParams } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/paths';
import * as Yup from 'yup';

const Register = () => {
  const { register } = useAuthContext();

  const router = useRouter();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const [errorMsg, setErrorMsg] = useState('');

  const showPassword = useBoolean();
  const showPasswordConfirmation = useBoolean();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('First Name is required!').max(255),
      last_name: Yup.string().required('Last Name is required!').max(255),
      phone_number: Yup.string().required('Phone Number is required!').max(255),
      email: Yup.string().email('Must be a valid email!').max(255).required('Email is required!'),
      password: Yup.string()
        .max(255)
        .min(8)
        .required('Password is required')
        .test('isValidPass', 'Password is not valid', (value) => {
          const hasUpperCase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          let validConditions = 0;
          const numberOfMustBeValidConditions = 3;
          const conditions = [hasUpperCase, hasLowerCase, hasNumber];

          // eslint-disable-next-line no-plusplus
          conditions.forEach((condition) => (condition ? validConditions++ : null));
          if (validConditions >= numberOfMustBeValidConditions) {
            return true;
          }
          return false;
        })
        .matches(/^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/, 'Need one special character'),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Passwords must match'),
    }),
    onSubmit: async (values) => {
      console.log(values);
      setIsSubmitting(true);

      try {
        await register(
          values.first_name,
          values.last_name,
          values.phone_number,
          values.email,
          values.password,
          values.password_confirmation
        );

        router.push(returnTo || paths.dashboard.root);
      } catch (err) {
        console.log(err);
        setErrorMsg(err || 'An error occurred while register! Please try again');
      }

      setIsSubmitting(false);
    },
  });

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>

      <Box sx={{ my: 'auto' }}>
        <Stack spacing={2} sx={{ mb: 5 }}>
          <Typography variant="h4">Create New Account</Typography>

          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2">Already have an account?</Typography>

            <Link component={RouterLink} href={paths.auth.login} variant="subtitle2">
              Sign in
            </Link>
          </Stack>
        </Stack>

        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={2.5}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <Stack direction="row" spacing={1}>
              <TextField
                type="text"
                fullWidth
                label="First Name"
                name="first_name"
                value={formik.values.first_name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={!!(formik.touched.first_name && formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
              />

              <TextField
                type="text"
                fullWidth
                label="Last Name"
                name="last_name"
                value={formik.values.last_name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={!!(formik.touched.last_name && formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
            </Stack>

            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formik.values.phone_number}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={!!(formik.touched.phone_number && formik.errors.phone_number)}
              helperText={formik.touched.phone_number && formik.errors.phone_number}
            />

            <TextField
              type="email"
              fullWidth
              label="Email Address"
              name="email"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={!!(formik.touched.email && formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={showPassword.value ? 'text' : 'password'}
              value={formik.values.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPassword.onToggle} edge="end">
                      <Iconify
                        icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              error={
                !!(formik.touched.password_confirmation && formik.errors.password_confirmation)
              }
              fullWidth
              helperText={
                formik.touched.password_confirmation && formik.errors.password_confirmation
              }
              label="Password Confirmation"
              name="password_confirmation"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type={showPasswordConfirmation.value ? 'text' : 'password'}
              value={formik.values.password_confirmation}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPasswordConfirmation.onToggle} edge="end">
                      <Iconify
                        icon={
                          showPasswordConfirmation.value
                            ? 'solar:eye-bold'
                            : 'solar:eye-closed-bold'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Typography variant="body2">
                Paswords must be at least 8 characters long and have:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    at least <b>one uppercase letter</b>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    at least <b>one lowercase letter</b>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    at least <b>one digit</b>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    at least <b>one special character</b>
                  </Typography>
                </li>
              </ul>
            </Box>

            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Create Account
            </LoadingButton>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default Register;
