// personal_info.js 

// Script Date: March 11, 2024
// Updated Date: April 4, 2024

'use strict';

import { getCustomerInfo, updateCustomer } from "./fetchCustomer.js";

const cancelBtn = document.getElementById('cancelRegistration');
const editForm = document.getElementById('edit-form');
const acceptEmailElem = document.getElementById('ifSendEmail');
const firstnameElem = document.getElementById("firstname");
const lastnameElem = document.getElementById("lastname");
const emailElem = document.getElementById("emailAddress");
const phoneElem = document.getElementById("phoneNumber");
const addressElem = document.getElementById("address");
const cityElem = document.getElementById("city");
const provinceElem = document.getElementById("province");
const countryElem = document.getElementById("country");
const postcodeElem = document.getElementById("postcode");
const contactNameElem = document.getElementById("contactName");
const contactphoneElem = document.getElementById("contactPhone");

window.addEventListener('load',startUp);

async function startUp(){
  
  let customer = await getCustomerInfo();

  // set the content of leftside-bar
  setLeftSideBar();

  showInfoInForm(customer);
  
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

function showInfoInForm(customer){
  firstnameElem.value = customer.firstname;
  lastnameElem.value = customer.lastname;
  emailElem.value = customer.email;
  phoneElem.value = customer.phone;
  addressElem.value = customer.address;
  cityElem.value = customer.city;
  provinceElem.value = customer.province;
  countryElem.value = customer.country;
  postcodeElem.value = customer.postcode;
  contactNameElem.value = customer.contactName;
  contactphoneElem.value = customer.contactPhone;
 
  let avatars = document.getElementsByName('avatar');
  for(let i=0;i<avatars.length;i++){
    avatars[i].src = '../assets/upload/avater-sample.png';
  }
}

cancelBtn.addEventListener("click", function(){
  window.location.href = 'personal-info.html';
})

editForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  let userId = window.localStorage.getItem('userId');
  let acceptEmailMsg = acceptEmailElem.checked ? true : false;
  let newData = {
    firstname: firstnameElem.value,
    lastname: lastnameElem.value,
    email: emailElem.value,
    phone: phoneElem.value,
    avatar: '',
    address: addressElem.value,
    city: cityElem.value,
    province: provinceElem.value,
    country: countryElem.value,
    postcode: postcodeElem.value,
    contactName: contactNameElem.value,
    contactPhone: contactphoneElem.value,
    acceptEmailMsg: acceptEmailMsg
  }
  await updateCustomer(userId, newData).then(() => {
    window.location.href = "personal-info.html";
    window.location.reload;
  }).catch(error => {
    console.error('Update failed:', error);
  });
})
