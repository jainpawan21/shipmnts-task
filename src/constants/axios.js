import axios from "axios";

var instance = axios.create({
  baseURL: "https://expense-manager-shipmnts.herokuapp.com/api/v1/",
});


export default instance;
