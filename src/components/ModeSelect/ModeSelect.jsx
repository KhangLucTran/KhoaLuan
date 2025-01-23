import { useColorScheme } from "@mui/material/styles";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LightModeIcon from "@mui/icons-material/LightMode";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import Box from "@mui/material/Box";

function ModeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    const selectMode = event.target.value;
    setMode(selectMode);
  };

  return (
    <FormControl sx={{ mt: 2, ml: 2, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dark-light-mode">Chế độ</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={{ borderRadius: 3 }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 3, // Tùy chỉnh cho menu thả xuống
            },
          },
        }}
      >
        <MenuItem value="light">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LightModeIcon fontSize="small" /> Sáng
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Brightness4Icon fontSize="small" /> Tối
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SettingsBrightnessIcon fontSize="small" /> Hệ thống
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}
export default ModeSelect;
