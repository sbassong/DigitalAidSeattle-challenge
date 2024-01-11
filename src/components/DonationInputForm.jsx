import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, TextField, InputLabel, Select, MenuItem, FormControl, InputAdornment, OutlinedInput, Button, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// helper for generating unique ID donation object
const generateRandomStringID = () => {
  return Math.random().toString(36).substring(2, 10);
};

export default function DonationInputForm({donationsList, handleDonationsListUpdate, editDonation, handleCloseDialog, dialogIsOpen, setEditDonation}) {
  const [donorName, setDonorName] = useState(editDonation ? editDonation.donorName : ""); 
  const [typeOfDonation, setTypeOfDonation] = useState(editDonation ? editDonation.typeOfDonation : "money");
  const [donationAmount, setDonationAmount] = useState(editDonation ? editDonation.donationAmount : 0);
  const [donationDate, setDonationDate] = useState(null);
  const [isActive, setIsActive] = useState(false);
  
  const formIsFilled = (donorName && typeOfDonation && donationAmount && donationDate); // conditional expression validating form completion status

  // helper callback for reseting form state on modal close
  const resetFormData = () => {
    setDonorName("");
    setDonationAmount("");
    setTypeOfDonation("money");
    setDonationDate(null);
    setEditDonation(null);
  };

  // callback that handles new donation submission
  const storeDonationDetails = (key, donationDetails) => {
    const storedDonationDetails = donationsList?.length > 0 ? donationsList : [];
    storedDonationDetails.push(donationDetails);
    localStorage.setItem(key, JSON.stringify(storedDonationDetails));
  };

  // callback that handles donation editing
  const handleEditDonationSubmit = (editDonation, newDonationDetails) => {
    const updatedDonationList = donationsList?.map((donation) => {
      if (donation.id === editDonation.id) return { ...newDonationDetails}
      else return donation
    });
    localStorage.setItem("digitalAidSeattle-DL", JSON.stringify(updatedDonationList));
    handleDonationsListUpdate(updatedDonationList);
  };

  const handleDonationFormSubmission = (event) => {
    event.preventDefault(); // prevents page refreshing
    if (formIsFilled){ // create a donation body object only if all fields are filled
      const donationDetails = {
        id: editDonation ? editDonation.id : generateRandomStringID(), // keep unique identifier when editing donation
        donorName,
        typeOfDonation,
        donationAmount,
        donationDate: `${donationDate.$M + 1}/${donationDate.$D}/${donationDate.$y}` // increment .@M value by 1 because datePickerObject returns a range of 0-11 for months
      };
      // Check whether for editing or not, then reset data and close modal/dialong once operation completes
      if (editDonation) handleEditDonationSubmit(editDonation, donationDetails)
      else storeDonationDetails("digitalAidSeattle-DL", donationDetails)
      resetFormData();
      handleCloseDialog();
    }
    return;
  };

  // toggle button disabled status based on form completion
  useEffect(() => {
    if (formIsFilled) setIsActive(true)
    else setIsActive(false)
  }, [formIsFilled]);

  // update donationsList state everytime form is submitted
  useEffect(() => {
    handleDonationsListUpdate(JSON.parse(localStorage.getItem("digitalAidSeattle-DL")));
  }, [handleDonationFormSubmission]);

  // preloads form's fields when an existing donation has been selected and stored for editing
  useEffect(() => {
    setDonorName(editDonation?.donorName);
    setDonationAmount(editDonation?.donationAmount);
    setTypeOfDonation(editDonation ? editDonation.typeOfDonation : '');
  }, [editDonation]);

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={handleCloseDialog}
    >
      <DialogTitle>{`${editDonation ? "Update" : "Create"} a donation report`}</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, mt: 2, width: '30ch' },
          }}
          validate="true"
          autoComplete="off"
        >
          <div>
            <FormControl >
              <TextField
                required
                label="Donor name"
                placeholder="firstName lastName"
                value={donorName}
                onChange={(event) => setDonorName(event.target.value)}
              />
            </FormControl>
          </div>

          <div>
            <FormControl sx={{ m: 1, minWidth: "30ch" }} >
              <InputLabel required>Type of donation</InputLabel>
              <Select
                value={typeOfDonation}
                label="Type of donation"
                onChange={(event) => setTypeOfDonation(event.target.value)}
              >
                <MenuItem value={"money"}>money</MenuItem>
                <MenuItem value={"food"}>food</MenuItem>
                <MenuItem value={"clothing"}>clothing</MenuItem>
                <MenuItem value={"etc."}>etc.</MenuItem>
              </Select>
            </FormControl>
          </div>

          {typeOfDonation && <div>
            <FormControl sx={{ m: 1, minWidth: "30ch" }} required>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                type='number'
                startAdornment={typeOfDonation === "money" && <InputAdornment position="start">$</InputAdornment>}
                label="Amount"
                placeholder='0'
                value={donationAmount}
                onChange={(event) => setDonationAmount(event.target.value)}
              />
            </FormControl>
          </div>}

          <div>
            <FormControl sx={{ minWidth: "25ch" }} required>
              <LocalizationProvider dateAdapter={AdapterDayjs} required >
                <DatePicker
                  value={donationDate}
                  onChange={(newValue) => setDonationDate(newValue)}
                  label="Date of donation *"
                  required
                />
              </LocalizationProvider>
            </FormControl>
          </div>
        </Box>
      </DialogContent>

      <DialogActions sx={{mb: 1, mr: 1}}>
        <Button 
          onClick={() => {
            resetFormData();
            handleCloseDialog();
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!isActive}
          variant="contained"
          onClick={handleDonationFormSubmission}
        >
          {editDonation ? "update" : "submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}