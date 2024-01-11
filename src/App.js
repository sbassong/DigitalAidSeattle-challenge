import { useState } from 'react';
import './App.css';
import DonationInputForm from './components/DonationInputForm'
import DonationList from './components/DonationList';
import { Typography, Button } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

function App() {
  const [donationsList, setDonationsList] = useState(JSON.parse(localStorage.getItem("digitalAidSeattle-DL")));
  const [dialogIsOpen, setDialogOpen] = useState(false);
  const [editDonation, setEditDonation] = useState(null);
  
  const handleDonationsListUpdate = (updatedDonationsList) => setDonationsList(updatedDonationsList); // updates donationsList
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <div className="App">
      <Typography
        variant='h5'
        component="h1"
        mt={3}
        ml={1}
        sx={{textAlign: "center", fontWeight: "600"}}
      >
        Donations Inventory
      </Typography>

      <Button
        sx={{mt: 2, ml: 2}}
        variant="contained" 
        color="success" 
        startIcon={<NoteAddIcon />}
        onClick={handleOpenDialog}
      >
        Add donation
      </Button>
      
      <DonationList 
        donationsList={donationsList}
        handleDonationsListUpdate={handleDonationsListUpdate} 
        handleOpenDialog={handleOpenDialog}
        setEditDonation={setEditDonation}
        editDonation={editDonation}
        />

      <DonationInputForm
        donationsList={donationsList}
        handleDonationsListUpdate={handleDonationsListUpdate}
        dialogIsOpen={dialogIsOpen}
        handleCloseDialog={handleCloseDialog}
        editDonation={editDonation}
        setEditDonation={setEditDonation}
        />
    </div>
  );
}

export default App;
