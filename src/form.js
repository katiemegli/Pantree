import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { pushToFirebase, useUserState } from "./utilities/firebase.js";
import { App } from "./App";
import { MySelection, Food2url } from "./select.js";
import { FaArrowCircleLeft } from "react-icons/fa";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddButton = () => (
  <>
    <button
      type="button"
      className="btn"
      onClick={() =>
        ReactDOM.render(<MyForm />, document.getElementById("root"))
      }
    >
      Add Food
    </button>
  </>
);

const MyForm = (param) => {
  var experation = new Date().toISOString().substring(0, 10);
  var today = new Date().toISOString().substring(0, 10);
  var na = "";
  console.log(param.n);

  const [name, setName] = useState(na);
  const [buyDate, setbuyDate] = useState(today);
  const [expDate, setexpDate] = useState(experation);
  const [icon, setIcon] = useState("");
  const [textarea, setTextarea] = useState("Please add a food item.");

  const user = useUserState();

  function stateChange() {
    setTimeout(function () {
      setTextarea("Please add the next item.");
    }, 3000);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !buyDate || !expDate) {
      Notification('info');
      return;
    }

    if (new Date(expDate).getTime() - new Date(buyDate).getTime() < 0) {
      Notification('date');
      return;
    }

    update({ icon, name, buyDate, expDate, user });

    if (name != "") {
      Notification('add');
    }

    setName("");
    setbuyDate(today);
    setexpDate(today);
    stateChange();
  };

  return (
    <div className="container">
      <ToastContainer transition={Slide} />
      <form className="add-form" onSubmit={onSubmit}>
        <div><FaArrowCircleLeft onClick={() => back()} size={40} style={{ color: 'rgb(121, 148, 25)', cursor: 'pointer' }} /> </div>
        <div className="form-control">
          <label>Food Name</label>
          <input
            type="text"
            placeholder="Add Food"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value.length > 10
                  ? e.target.value.slice(0, 10) + "..."
                  : e.target.value
              )
            }
          />
        </div>
        <div className="form-control">
          <label>Purchase Date</label>
          <input
            type="date"
            placeholder="Purchase Date"
            value={buyDate}
            onChange={(e) => setbuyDate(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Expire Date</label>
          <input
            type="date"
            placeholder="Expire Date"
            value={expDate}
            onChange={(e) => setexpDate(e.target.value)}
          />
        </div>
        <div>
          <MySelection icon={icon} setIcon={setIcon} />
        </div>

        <input type="submit" value="Add item" className="btn btn-block" />

      </form>
    </div>
  );
};

export const EditMyForm = (param) => {
  var experation = new Date().toISOString().substring(0, 10);
  var today = new Date().toISOString().substring(0, 10);
  var na = "";
  var Editing = new Boolean(false);

  if (param.date !== undefined) {
    today = param.date;
    Editing = new Boolean(true);
  }

  if (param.exp !== undefined) {
    experation = param.exp;
  }

  if (param.n !== undefined) {
    na = param.n;
  }

  console.log(param.n);

  const [name, setName] = useState(na);
  const [buyDate, setbuyDate] = useState(today);
  const [expDate, setexpDate] = useState(experation);
  const [icon, seticon] = useState("");
  const [Textarea, setTextarea] = useState("Please add a food item.");

  const user = useUserState();

  function stateChange() {
    setTimeout(function () {
      setTextarea("Please add the next item.");
    }, 3000);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !buyDate || !expDate) {
      Notification('info');
      return;
    }

    if (new Date(expDate).getTime() - new Date(buyDate).getTime() < 0) {
      Notification('date');
      return;
    }

    update({ icon, name, buyDate, expDate, user });

    if (name != "") {
    }

    setName("");
    setbuyDate(today);
    setexpDate(today);
    // wait several seconds and set "item added" back to "please add"
    stateChange();

    back();
  };

  return (
    <div className="container">
      <form className="add-form" onSubmit={onSubmit}>
        <div className="form-control">
          <label>Food Name</label>
          <input
            type="text"
            placeholder="Add Food"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value.length > 10
                  ? e.target.value.slice(0, 10) + "..."
                  : e.target.value
              )
            }
          />
        </div>
        <div className="form-control">
          <label>Purchase Date</label>
          <input
            type="date"
            placeholder="Purchase Date"
            value={buyDate}
            onChange={(e) => setbuyDate(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Expire Date</label>
          <input
            type="date"
            placeholder="Expire Date"
            value={expDate}
            onChange={(e) => setexpDate(e.target.value)}
          />
        </div>

        <input type="submit" value="Finish Editing" className="btn btn-block" />
        <div className= "btn2 btn-block" onClick={() => back() }> DELETE </div>
      </form>
    </div>
  );
};

//Update the state with new items and
const update = ({ icon, name, buyDate, expDate, user }) => {
  // console.log("icon" + Food2url(icon));
  const namex = {
    icon: Food2url(icon),
    name: name,
    buyDate: buyDate,
    expDate: expDate,
  };

  const id = Math.round(Math.random() * 100000);
  const newFood = { id, ...namex };
  pushToFirebase(newFood, user);
};

const back = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

export const Notification = (type) => {
  switch (type) {
    case 'add':
      toast.success('Item added!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored"
      }
      );
      break;
    case 'edit':
      toast.success('Item edited!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "white"
      }
      );
      break;
    case 'del':
      toast.success('Item deleted!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored"
      }
      );
      break;
    case 'info':
      toast.warn('Please complete all the information!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored"
      }
      );
      break;
    case 'date':
      toast.error('Expire date should be after purchase date!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored"
      }
      );
      break;
  }
}
