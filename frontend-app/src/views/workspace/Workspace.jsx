import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Folders from "./Folders";
import Notes from "./Notes";

const Workspace = () => {
  return (
    <Box sx={{ display: "flex"}}>
      <Box
        sx={{
          width: "20%",
          height:"100%",
          p: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Folders/>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box
        sx={{
          p: 2,
          flex: 1,
          backgroundColor: "background.default",
        }}
      >
        <Notes/>
      </Box>
    </Box>
  );
};

export default Workspace;
