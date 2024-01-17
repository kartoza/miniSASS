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
  title: string;
  message: string;
}

export default function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, onConfirm, value: valueProp, open, title, message, ...other } = props;

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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {message}
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
