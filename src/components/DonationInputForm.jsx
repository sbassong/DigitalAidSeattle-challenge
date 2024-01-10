import * as React from 'react';
import { useState, useEffect } from 'react';
import {Box, TextField, InputLabel, Select, MenuItem, FormControl, InputAdornment, OutlinedInput, Button} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'



export default function DonationInputForm() {
  const [firstName, setfFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [typeOfDonation, setTypeOfDonation] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationQuantity, setDonationQuantity] = useState("");
  const [donationDate, setDonationDate] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const handleTypeOfDonationChange = (event) => setTypeOfDonation(event.target.value);
  const handleFirstnameChange = (event) => setfFirstName(event.target.value);
  const handleLastnameChange = (event) => setLastName(event.target.value);
  const handleDonationAmountChange = (event) => setDonationAmount(event.target.value);
  const handleDonationQuantityChange = (event) => setDonationQuantity(event.target.value);
  // date parsing based on datapicker return obj DD.$M/DD.$D/DD.$y;

  const formIsFilled = (firstName
    && lastName
    && typeOfDonation
    && (donationAmount || donationQuantity)
    && donationDate
  );

  const handleDonationFormSubmission = (event) => {
    event.preventDefault();
    if (formIsFilled){
      const donationDetails = {
        id: `${firstName}-${lastName}-${donationDate.$D}/${donationDate.$M}/${donationDate.$y}`,
        firstName,
        lastName,
        typeOfDonation,
        donationValue: typeOfDonation === "money" ? donationAmount : donationQuantity,
        donationDate: `${donationDate.$D}/${donationDate.$M}/${donationDate.$y}`
      };
      const donationDetailsJSON = JSON.stringify(donationDetails)
      console.log(donationDetails)
      localStorage.setItem(donationDetails.id, donationDetailsJSON)
    }
    return;
  };

  useEffect(() => {
    if (formIsFilled) setIsActive(true)
  }, [formIsFilled])

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      validate="true"
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="outlined-required"
          label="First name"
          placeholder="first name"
          value={firstName}
          onChange={handleFirstnameChange}
        />
        <TextField
          required
          id="outlined-required"
          label="Last name"
          placeholder="last name"
          value={lastName}
          onChange={handleLastnameChange}
          />
      </div>

      <div>
        <FormControl sx={{ m: 1, minWidth: "25ch" }} >
          <InputLabel id="demo-simple-select-label">Type of donation</InputLabel>
          <Select
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={typeOfDonation}
            label="Type of donation"
            onChange={handleTypeOfDonationChange}
          >
            <MenuItem value={"money"}>money</MenuItem>
            <MenuItem value={"food"}>food</MenuItem>
            <MenuItem value={"clothing"}>clothing</MenuItem>
            <MenuItem value={"etc."}>etc.</MenuItem>
          </Select>
        </FormControl>
        {typeOfDonation && <>
          { typeOfDonation === "money" ?
            (<FormControl sx={{ m: 1, minWidth: "25ch" }} required>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                type='number'
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Amount"
                placeholder='0'
                value={donationAmount}
                onChange={handleDonationAmountChange}
                />
            </FormControl>)
            : 
            (<FormControl sx={{ m: 1, minWidth: "25ch" }} required>
              <InputLabel htmlFor="outlined-adornment-amount">Items quantity</InputLabel>
              <OutlinedInput
                type='number'
                id="outlined-adornment-amount"
                label="Items quantity"
                placeholder='0'
                value={donationQuantity}
                onChange={handleDonationQuantityChange}
              />
            </FormControl>)
          }
        </>}
      </div>

      <div>
        <FormControl sx={{ minWidth: "25ch" }} required>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker
              value={donationDate}
              onChange={(newValue) => setDonationDate(newValue)}
              label="Date of donation"
              />
          </LocalizationProvider>
        </FormControl>
      </div>

      <div style={{width: "100%", display: "flex", justifyContent: "center"}} >
        <Button
          sx={{alignContent: 'center'}}
          disabled={!isActive}
          variant="contained"
          onClick={handleDonationFormSubmission}
        >
          Submit
        </Button>
      </div>
    </Box>
  );
}