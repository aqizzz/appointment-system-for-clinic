// personal_info.js 

// Script Date: April 3, 2024

'use strict';

import { getCustomerInfo } from "./fetchCustomer.js";

const edit = document.getElementById('edit-customer');

window.addEventListener('load',startUp);

async function startUp(){

  let customer = await getCustomerInfo();

  // set the content of leftside-bar
  setLeftSideBar();

  displayInfo(customer);
  
}

function setLeftSideBar(){
  let first_name = window.localStorage.getItem('firstname');

  // set name in leftsidebar
  document.getElementById('personalInfoName').innerHTML = first_name;

  // set the src of each avatar on this page
  let avatars = document.getElementsByName('avatar');
  for(let i=0;i<avatars.length;i++){
    avatars[i].src = '../assets/upload/avater-sample.png';
  }
}

edit.addEventListener("click", async function(){
  window.location.href = 'personal-info-edit.html';
})

function displayInfo(customer){
  // getDate("../data/customs.txt");
  const firstnameElem = document.getElementById("result-firstname");
  firstnameElem.innerText = customer.firstname;
  const lastnameElem = document.getElementById("result-lastname");
  lastnameElem.innerText = customer.lastname;
  const emailElem = document.getElementById("result-emailAddress");
  emailElem.innerText = customer.email;
  const phoneElem = document.getElementById("result-phoneNumber");
  phoneElem.innerText = customer.phone;
  const addressElem = document.getElementById("result-address");
  addressElem.innerText = customer.address;
  const cityElem = document.getElementById("result-city");
  cityElem.innerText = customer.city;
  const provinceElem = document.getElementById("result-province");
  provinceElem.innerText = customer.province;
  const countryElem = document.getElementById("result-country");
  countryElem.innerText = customer.country;
  const postcodeElem = document.getElementById("result-postcode");
  postcodeElem.innerText = customer.postcode;
  const contactNameElem = document.getElementById("result-contactName");
  contactNameElem.innerText = customer.contactName;
  const contactphoneElem = document.getElementById("result-contactPhone");
  contactphoneElem.innerText = customer.contactPhone;
};

