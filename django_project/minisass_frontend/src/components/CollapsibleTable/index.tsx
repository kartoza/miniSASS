import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import ClearIcon from '@mui/icons-material/Clear';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Text } from "../../components";


type Column = {
  id: string;
  label: string;
};

type Row = {
  [key: string]: any;
  field_sheets: string;
  size: string;
  customContent: {
    title: string;
    content: string[];
  };
};



type CollapsibleTableProps = {
  columns: Column[];
  rows: Row[];
  title: string;
  showCollapseIcon?: boolean;
  showBorders?: boolean; // Added prop for showing borders
};

function CollapsibleTableRow(props: { row: Row; columns: Column[]; showCollapseIcon?: boolean; showBorders?: boolean; }) {
  const { row, columns, showCollapseIcon, showBorders  } = props;
  const [open, setOpen] = React.useState(false);

  // Check if "Action" is one of the column names
  const hasActionColumn = columns.some((column) => column.label === "Action");

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: showBorders ? 'unset' : '1px solid rgba(224, 224, 224, 1)' } }}>
        {showCollapseIcon && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell key={column.id} component="th" scope="row">
            {column.id === 'Action' ? (
              <IconButton aria-label="Download">
                <CloudDownloadIcon />
              </IconButton>
            ) : (
              row[column.id]
            )}
          </TableCell>
        ))}
      </TableRow>
      {open && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + (showCollapseIcon ? 1 : 0)}>
          <Box sx={{ margin: 1 }}>
              {/* Use the custom title from row data */}
              <Typography variant="h6" gutterBottom component="div">
                {row.customContent.title}
              </Typography>
              {/* Render the custom content from row data */}
              {row.customContent.content.map((paragraph, index) => (
                <Typography variant="body1" key={index}>
                  {paragraph}
                </Typography>
              ))}
            </Box>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}


function CollapsibleTable(props: CollapsibleTableProps) {
  const {
    columns,
    rows,
    title,
    showCollapseIcon,
    showBorders, // Added prop for showing borders
  } = props;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row)
      .join('')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Typography variant="h6" gutterBottom component="div">
        <Text
          className="text-blue-900 text-sm tracking-[0.98px] uppercase w-auto"
          size="txtRalewayExtraBold14"
        >
        {title}
        </Text>
      </Typography>
      <Box sx={{ display: 'flex-end', justifyContent: 'space-between', marginLeft: '78%' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={() => setSearchQuery('')}
                >
                  {searchQuery && <ClearIcon />}
                </IconButton>
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {showCollapseIcon && <TableCell />}
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <CollapsibleTableRow
                  key={row.name}
                  row={row}
                  columns={columns}
                  showCollapseIcon={showCollapseIcon}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default CollapsibleTable;

