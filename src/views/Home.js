import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "../constants/axios";

import Expenses from "../components/Expenses";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  formControl: {
    margin: theme.spacing(1),
    width: "95%",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function Home(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("0.0");
  const [category, setCategory] = useState("Education");
  const [categories, setCategories] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState();
  const [loader, setLoader] = useState(true);
  const [addedNewExpense, setAddedNewExpense] = useState(false)
  useEffect(() => {
    axios
      .get("user/categories", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.message === "Invalid Token") {
          props.history.push("signin");
        } else {
          setCategories(res.data.categories);
          setLoader(false)
        }
        // console.log(res.data);
      })
      .catch((err) => {
        props.history.push("signin");
        // console.log(err.response);
      });
  }, [open, props.history]);
  const handleAddExpense = () => {
    if (expenseName === "" || amount === "") {
      setSuccess(false);
      setOpenAlert(true);
      setMessage("Please fill all the fields");
    } else {
      setMessage("");
      setOpenAlert(false);
      axios
        .post(
          "user/add_expense",
          {
            category: category,
            description: expenseName,
            amount: amount,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setAddedNewExpense(true)
          // console.log(res.data);
          setOpen(false);
          setExpenseName("");
          setAmount("");
          setSuccess(true);
          setMessage("Expense added successfully");
          setOpenAlert(true);
        })
        .catch((err) => {
          // console.log(err.response.data);
          setSuccess(false);
          setMessage(err.response.data.message);
          setOpenAlert(true);
        });
    }
  };
  const handleClickOpen = () => {
    setAddedNewExpense(false)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSignOut = () => {
    props.history.push("/signin");
    localStorage.removeItem("token");
  };
  const handleCloseAlert = () => setOpenAlert(false);
  if (loader) {
    return <div></div>;
  } else {
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Expense Manager
            </Typography>
            <Button color="inherit" onClick={() => handleSignOut()}>
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
        <Expenses addedNewExpense={addedNewExpense} />
        <Fab
          aria-label="Add"
          className={classes.fab}
          color="primary"
          onClick={() => handleClickOpen()}
        >
          <AddIcon />
        </Fab>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Expense</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              id="expenseName"
              label="Expense Name"
              type="text"
              fullWidth
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />
            {categories.length !== 0 && (
              <FormControl className={classes.formControl}>
                <InputLabel id="category">Category</InputLabel>
                <Select
                  labelId="category"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((item, index) => {
                    return (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
            <TextField
              id="amount"
              label="Amount"
              type="text"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleAddExpense()} color="primary">
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
      </div>
    );
  }
}
