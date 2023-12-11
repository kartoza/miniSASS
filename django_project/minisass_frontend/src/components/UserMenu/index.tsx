import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Img} from "../Img";
import {globalVariables} from "../../utils";
import {logout, useAuth} from "../../AuthContext";
import Link from '@mui/material/Link';
import {useNavigate} from "react-router-dom";


export default function UserMenu(props: {setUpdateProfileOpen: void}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { dispatch, state } = useAuth();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(dispatch)
  };

  return (
    <div>
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
        <MenuItem onClick={() => props.setUpdateProfileOpen(true)}>Profile</MenuItem>
        <MenuItem onClick={() => {
          navigate(`/recent-activity`);
        }}>
          Recent Activity
        </MenuItem>
        {
          state.user.is_admin &&
          <MenuItem
            onClick={handleClose}
          >
            <Link
              href={`${globalVariables.currentURL}/admin`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >Admin</Link>
          </MenuItem>
        }
        <MenuItem
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}