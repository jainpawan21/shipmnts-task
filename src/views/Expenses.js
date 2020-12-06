import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "../constants/axios";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const columns = [
  {
    id: "description",
    label: "Description",
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "amount",
    label: "Amount",
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "category",
    label: "Category",
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
];

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles({
  root: {
    marginTop: "20px",
  },
  paper: {
    width: "100%",
  },
  container: {},
  formControl: {
    width: "100%",
  },
});

export default function StickyHeadTable(props) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("2016-05-12");
  const [category, setCategory] = useState("");
  const [open, setOpen] = React.useState(false);
  const [newCategory, setNewCategory] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
      const [message, setMessage] = useState();
      const [success, setSuccess] = useState();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const getTodayDate = () => {
    function pad(n, width, z) {
      z = z || "0";
      n = n + "";
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join(z) + n;
    }
    const today = new Date();
    const day = pad(today.getDate(), 2);
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    setEndDate(getTodayDate());
  }, []);
  useEffect(() => {
    // getTodayDate()
    //
    console.log(startDate);
    console.log(endDate);
    axios
      .post(
        category !== ""
          ? `user/expense_details/${category}`
          : "user/expense_details",
        {
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setRows(res.data);
      })
      .catch((err) => console.log(err.response.data));
  }, [category, startDate, endDate]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddCategory = () => {
    if (newCategory === "") {
      setSuccess(false);
      setOpenAlert(true);
      setMessage("Please fill all the fields");
    } else {
      axios
        .post(
          "user/add_category",
          {
            name: newCategory,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setSuccess(true);
          setOpen(false);
          setMessage("Added new Category");
          setOpenAlert(true);
          setNewCategory("");
        })
        .catch((err) => {
          setSuccess(false);
          console.log(err.response.data);
          setMessage(err.response.data.message);
          setOpenAlert(true);
        });
    }
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
    setMessage("");
  };
  return (
    <Container>
      <Grid container className={classes.root} spacing={3}>
        <Grid item xs={12} lg={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id="category">Category</InputLabel>
            <Select
              labelId="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="" key="all">
                All
              </MenuItem>
              {props.categories.map((item, index) => {
                return (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={3}>
          <TextField
            id="startDate"
            label="Start Date"
            type="date"
            defaultValue={startDate}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <TextField
            id="endDate"
            label="End Date"
            type="date"
            defaultValue={endDate}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleOpen()}
          >
            Add category
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <StyledTableRow>
                    {columns.map((column) => (
                      <StyledTableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <StyledTableRow key={row.code}>
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <StyledTableCell
                                key={row.code + column.id}
                                align={column.align}
                              >
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </StyledTableCell>
                            );
                          })}
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            id="newCategory"
            label="New Category Name"
            type="text"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleAddCategory()} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openAlert}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={success ? "success" : "error"}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
