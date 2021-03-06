import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({ name, list, selected, handleChange }) {
  return (
    <Box sx={{ width: 140 }}>
      <FormControl fullWidth>
        <InputLabel style={{ zIndex: 0 }}>{name}</InputLabel>
        <Select value={selected} label={name} onChange={handleChange}>
          {list.map((val, key) => {
            return (
              <MenuItem key={key} value={val}>
                {val}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
