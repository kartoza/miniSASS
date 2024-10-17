import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Img} from "../Img";
import {globalVariables} from "../../utils";
import {logout, useAuth} from "../../AuthContext";
import Link from '@mui/material/Link';
import {useNavigate} from "react-router-dom";
import ConfirmationDialogRawProps from "../ConfirmationDialog";
import ConfirmationDialogRaw from "../ConfirmationDialog";


export default function UserMenu(props: {setUpdateProfileOpen: void, isDisableNavigations: boolean}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElTemp, setAnchorTemp] = React.useState<null | HTMLElement>(null);
  const [logoutOpen, setLogoutOpen] = React.useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = React.useState(false);
  const { dispatch, state } = useAuth();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
     
    if(props.isDisableNavigations){
      setIsCloseDialogOpen(true)
      setAnchorTemp(event.currentTarget)
    } else setAnchorEl(event.currentTarget);
  };

  const handleClickLogout = () => {
    setLogoutOpen(true);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClickLogout();
  };

  const handleLogoutConfirm = () => {
    logout(dispatch)
  };

  const handleLogoutCancel = () => {
    setLogoutOpen(false)
  };

  const handleDialogCancel = () => {
    setIsCloseDialogOpen(false)
  };

  const handleCloseConfirm = () => {
    setIsCloseDialogOpen(false);
    setAnchorEl(anchorElTemp)
  };

  return (
    <>
    <ConfirmationDialogRaw
      id="logout-dialog"
      keepMounted
      value="logout"
      open={logoutOpen}
      onClose={handleLogoutCancel}
      onConfirm={handleLogoutConfirm}
      title="Log out"
      message="Are you sure you want to log out?"
    />
    <ConfirmationDialogRaw
      id="confirm-dialog"
      keepMounted
      value="logout"
      open={isCloseDialogOpen}
      onClose={handleDialogCancel}
      onConfirm={handleCloseConfirm}
      title="Confirm Action"
      message="The actions available on this menu will navigate away from this page, losing any unsaved data on the form. Are you sure you want to continue ?"
    />
    <div className="h-[35px] w-[35px]">
      <Img
        src={`${globalVariables.staticPath}iconamoon_profile-circle-fill.svg`}
        alt="iconamoon_profile-circle-fill"
        onClick={handleClick}
        style={{height: '35px'}}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => props.setUpdateProfileOpen(true) }>Profile</MenuItem>
        <MenuItem onClick={() => {
          navigate(`/recent-activity`);
        }}>
          Recent Activity
        </MenuItem>
        {
          state.user.is_admin &&
          <Link
            href={`${globalVariables.baseUrl}/admin/`}
            style={{textDecoration: 'none', color: 'inherit'}}
          >
            <MenuItem
              onClick={handleClose}
            >
              Admin
            </MenuItem>
          </Link>
        }
        <MenuItem
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
    </>
  );
}
