import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, onConfirm, value: valueProp, open, ...other } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Log out</DialogTitle>
      <DialogContent dividers>
        Are you sure you want to log out?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Yes</Button>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
