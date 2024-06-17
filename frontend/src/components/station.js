import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SelectDropdown = ({ text, options, defaultOption, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    onChange(event.target.value); // Call the callback with the new selected option
  };

  useEffect(() => {
    onChange(selectedOption); // Initialize with the default option
  }, []);

  return (
    <FormControl fullWidth variant="outlined" style={{width: "210px"}}>
      <InputLabel id="dropdown-label">Select {text}</InputLabel>
      <Select
        labelId="dropdown-label"
        id="dropdown"
        value={selectedOption}
        onChange={handleChange}
        label="Select an option"
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectDropdown;
