import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ModeSelect from "../../components/ModeSelect/ModeSelect";

const HomePage = () => {
  return (
    <>
      <Container disableGutters maxWidth={false}>
        <Box
          sx={{
            width: "100%",
            height: (theme) => theme.fashion.appBarHeight,
            display: "flex",
            alignItems: "center",
            backgroundColor: (theme) => theme.palette.background.default,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          <ModeSelect />
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
