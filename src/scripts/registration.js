/* For validating the registration form 
    Date: April 4, 2024
*/

'use strict';

import { checkCustomerEmail, insertCustomer } from "./fetchCustomer.js";

const pwdform = document.getElementById('pwd');
const pwdconfirm = document.getElementById('pwdconf');
const emailElem = document.getElementById('email-address');
const fnamElem = document.getElementById('first-name');
const lnamElem = document.getElementById('last-name');
const msgBoxReg = document.getElementById('msgBoxReg');
const phoneElem = document.getElementById('phone');
const acceptEmailElem = document.getElementById('agree');


document.getElementById("form").addEventListener("submit", async function (event) {
  event.preventDefault();

  let regemail = emailElem.value;
  let checkResult = await checkCustomerEmail(regemail);
  
  let firstname = fnamElem.value;
  let lastname = lnamElem.value;
  let phone = phoneElem.value;
  let acceptEmailMsg = acceptEmailElem.checked ? true : false;
  let password = pwdform.value;
  let confirmPassword = pwdconfirm.value;
  

  try {
    if (checkResult) throw regemail + ' already registered, please use another email';
    if (confirmPassword !== password ) throw "Passwords must be same";

    const newUserData = {
      firstname: firstname,
      lastname: lastname,
      email: regemail,
      password: password,
      phone: phone,
      acceptEmailMsg: acceptEmailMsg
    }

    await insertCustomer(newUserData);
    alert("Registration successful! Please log in.");
    window.location.href = 'login.html';
  } catch (error) {
    msgBoxReg.innerHTML = error;
  }
});