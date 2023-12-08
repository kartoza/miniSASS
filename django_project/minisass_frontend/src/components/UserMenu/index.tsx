import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Img} from "../Img";
import {globalVariables} from "../../utils";
import {useAuth} from "../../AuthContext";
import Link from '@mui/material/Link';


export default function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { dispatch, state } = useAuth();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Recent Activity</MenuItem>
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
      </Menu>
    </div>
  );
}