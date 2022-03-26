import { Grid, Typography } from "@mui/material";

function Header() {
  return (
    <Grid
      container
      component="header"
      columns={{ xs: 8, md: 10 }}
      justifyContent="center"
      sx={{ marginY:"16px" }}>
      <Grid item xs={6}>
        <Typography variant="h1" sx={{ fontSize:"24px", fontWeight:"bold" }}>ToDo-App</Typography>
      </Grid>
    </Grid>
  );
}

export default Header;
