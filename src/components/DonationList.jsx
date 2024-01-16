import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, InputLabel, Select, MenuItem, FormControl, Stack, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Donation item component that displays donation details
const DonationListItem = ({ donation, handleDeleteDonation, handleEditDonationClick }) => (
  <Stack
    direction="row"
    justifyContent="flex-start"
    alignItems="center"
    spacing={{ xs: 3, sm: 4, md: 8, lg: 8 }}
    sx={{ width: '60ch', m: 1 }}
  >
    <div style={{ fontWeight: 'bold', width: "30%"}}>{donation.donorName}</div>
    <div style={{ fontWeight: '500', width: "10%" }}>{donation.typeOfDonation}</div>
    <div style={{ fontWeight: '400', width: "10%" }}>{donation.typeOfDonation === "money" ? `$ ${donation.donationAmount}` : donation.donationAmount}</div>
    <div style={{ fontWeight: '400', width: "15%" }}>{donation.donationDate}</div>
    <Stack direction="row" spacing={0.5} sx={{ width: "10%" }}>
      <IconButton color="primary" aria-label="edit" onClick={() => handleEditDonationClick(donation)}>
        <EditIcon />
      </IconButton>
      <IconButton color="error" aria-label="delete" onClick={() => handleDeleteDonation(donation)}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  </Stack>
);

export default function DonationList({ donationsList, handleDonationsListUpdate, handleOpenDialog, setEditDonation }) {
  const [list, setList] = useState(donationsList);
  const [filterType, setFilterType] = useState('all');
  const [totalAmountOfDonations, setTotalAmountOfDonations] = useState();

  const handleDeleteDonation = (donation) => {
    const newList = list?.filter((item) => item !== donation); // remove selected donation from current donationList state w
    // update app's donations state, list's, and local state
    handleDonationsListUpdate(newList);
    setList(newList);
    localStorage.setItem("digitalAidSeattle-DL", JSON.stringify(newList));
  };

  const handleEditDonationClick = (donation) => {
    setEditDonation(donation); // store donation to be edited, making it available for preloading form and deletion from donationsList state and local state
    handleOpenDialog();
  };
  
  // helper that totals donations amount,
  const handleTotalAmountDonated = () => {
    let total = 0;
    list?.forEach((item) => total += parseInt(item.donationAmount));
    setTotalAmountOfDonations(total);
  };

  // handles refreshing list on filter
  useEffect(() => {
    if (filterType === 'all') setList(donationsList)
    else setList(donationsList?.filter((item) => item.typeOfDonation === filterType))
    handleTotalAmountDonated();
  }, [filterType, donationsList]); // watches filterType change and additions or updates to donationsList state

  return (
    <Box sx={{marginLeft: 1, width: "60ch"}}>
        <h3>Donations List</h3>
        <FormControl sx={{ m: 1, minWidth: "25ch" }} >
          <InputLabel id="demo-simple-select-label">Type of donation</InputLabel>
          <Select
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterType}
            label="Type of donation"
            onChange={(event) => setFilterType(event.target.value)}
          >
            <MenuItem value={"all"}>all</MenuItem>
            <MenuItem value={"money"}>money</MenuItem>
            <MenuItem value={"food"}>food</MenuItem>
            <MenuItem value={"clothing"}>clothing</MenuItem>
            <MenuItem value={"etc."}>etc.</MenuItem>
          </Select>
        </FormControl>

      <Box sx={{m: 1}}>
        <h4>total donations: {list?.length > 0 ? list.length : 0}</h4>
        <h4>total amount donated: {totalAmountOfDonations}</h4>
      </Box>

      <Box>
        { list?.length > 0 ?
          list.map((donation) => (
            <DonationListItem donation={donation} handleDeleteDonation={handleDeleteDonation} handleEditDonationClick={handleEditDonationClick} />
          ))
          :
          <p>No donations!</p> // For user convenience when there's no available data
        }
      </Box>
    </Box>
  );
}