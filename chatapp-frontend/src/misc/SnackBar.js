import { Snackbar, Alert } from '@mui/material'

function SnackBar({openSnackbar, setOpenSnackbar, snackbarStatus, snackbarMessage, setSnackbarMessage}) {
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
  }
  
  return (  
    <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
      <Alert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarStatus}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  )
}

export default SnackBar