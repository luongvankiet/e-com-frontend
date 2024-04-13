import { Button, Container, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import RouterLink from 'src/components/router-link/router-link';
import { m } from 'framer-motion';
import { MotionContainer, varBounce } from 'src/components/animate';
import { SeverErrorIllustration } from 'src/assets/illustrations';

export default function Page500() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found!</title>
      </Helmet>

      <Container component="main">
        <Stack
          sx={{
            py: 10,
            m: 'auto',
            maxWidth: 400,
            minHeight: '100vh',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <MotionContainer>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                500 Internal Server Error
              </Typography>
            </m.div>

            <m.div variants={varBounce().in}>
              <Typography sx={{ color: 'text.secondary' }}>
                There was an error, please try again later.
              </Typography>
            </m.div>

            <m.div variants={varBounce().in}>
              <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </m.div>

            <Button component={RouterLink} href="/" size="large" variant="contained">
              Go to Home
            </Button>
          </MotionContainer>
        </Stack>
      </Container>
    </>
  );
}
