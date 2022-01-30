import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { useData, useUserState, signInWithG, signOutOfG } from "./utilities/firebase.js";
import { FoodList,Expired, m_notify } from "./food";
import { AddButton, notification} from "./form";
import {
  MainLayout,
  Header,
  H1,
  Content,
  UserName,
} from "./styles/PantryStyles.js";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useState,useEffect} from 'react';

const SignInButton = () => (
  <button className="btn"
    onClick={() => signInWithG()}>
    Sign In
  </button>
);

const SignOutButton = ({ cuser }) => (
  <>
    <p className="email">
      {cuser}
      <button className="btn" id="out"
        onClick={() => signOutOfG()}>
        Sign Out
      </button>
    </p>


  </>
);

const currUser = (user) => {
  if (user) {
    return "/users/" + user.uid + "/";
  }
  return "/";
}

const userexist = (user) =>
{
  
}

export const App = () => {

  const user = useUserState();
  const [entry, setEntry] = useState();
  const [f_value,setValue]=useState('');


  const [userKitchen, loading, error] = useData(currUser(user));

  if (error) return <h1>{error}</h1>;
  if (loading) return <h1>Loading the data...</h1>;

  
  console.log("USER KITCHEN --> " + userKitchen);
  console.log("ENTRY --> " + entry);

  const mSearchCriteria = (user_kitchen) => {
    if(user_kitchen){
      var matched = {};
      if(!entry){
        return user_kitchen.foods;
      }
      for (const [key, value] of Object.entries(user_kitchen.foods)) {
        console.log(`pair ${key} : ${value}`)
        if(value.name.includes(entry)){
          matched[key] = value;
          console.log("yesss");
        }
      }
      return matched;
    }
    return "EMPTY KITCHEN";
  };

  var matched = "";
  if(user){
    if(userKitchen){
      console.log(" USER KITCHEN FOODS ---> " + userKitchen.foods)
      matched = mSearchCriteria(userKitchen);
    }
  }
  // for (const [key, value] of Object.entries(matched)) {
  //   console.log("matched pair "+ key, value);
  // } 

  const handleSelect=(e)=>{
    // console.log(e);
    setValue(e);
    if(e === "option-1"){
      console.log("clicked option 1");
      
    }else if (e === "option-2"){
      console.log("clicked option 2");
    }else{
      console.log("clicked option 3");
    }
  }

  return (
    <>
      <ToastContainer transition={Slide} />
      <MainLayout>
        <Header>
          <H1>My Kitchen</H1>
          <div className="signInBtn">
            {user ? <SignOutButton cuser={user.email} /> : <SignInButton />}
          </div>

        </Header>
        <Content>
          {user ? 
          
          <div className="content-top"> 

            <input 
              className="search-field"
              type="text"
              placeholder="Search..."
              value={entry}
              onChange={(e) => {
                setEntry(e.target.value)
                }}/>

            <DropdownButton
              title="Filter by"
              className="filterc"
              id="dropdown-menu-align-right"
              onSelect={handleSelect}>
                <Dropdown.Item eventKey="option-1">expired</Dropdown.Item>
                <Dropdown.Item eventKey="option-2">expiring soon</Dropdown.Item>
                <Dropdown.Item eventKey="option-3">good condition</Dropdown.Item>
                          
            </DropdownButton>
        
            <AddButton /> 

           </div>
          : ""}
          <H1>{!user ? "Sign In To Unlock Your Kitchen" : ""}</H1>
          {userKitchen ?  <FoodList foods={matched}/>: ""}
        </Content>
      </MainLayout>
    </>
  );

};

export default App;
