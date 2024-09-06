/* Purpose: Handle the log in 

  Updated Date: April 3, 2024
*/
'use strict';

import { login } from "./fetchCustomer.js";

function loginSubmit(){
  let user = document.getElementById('emailaddr').value;
  let pwd = document.getElementById('pwd').value;
  
  login(user, pwd)
    .then(response => {
      if (!response.ok) {

        throw new Error(response.statusText);

      }else {

      window.alert("Welcome to Smith's Clinic!");
      window.location.href = '../index.html';
      return;
      }
    })
    .catch(error => {
      window.alert(error.message); 
    });
}

document.getElementById("loginBtn").addEventListener("click", function(event) {
  event.preventDefault(); 
  loginSubmit();
});

