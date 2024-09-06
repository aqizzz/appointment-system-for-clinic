// JavaScript source code
// main.js 

// Update Date: April 4, 2024

/**
 * custom info array:[firstname, lastname, email, phoneNumber,password, avatar-url, address, city, provice, postcode,contact_name,contact_phone,ifSendEmail]
 */

'use strict';
/* document.getElementById('totalAppoint').onclick = function(){
  const status = 'total';
  localStorage.setItem('Status', status);
};

document.getElementById('uncompleted').onclick= function(){
  const status = 'uncompleted';
  alert("uncompleted");
  localStorage.setItem('Status', status);
};

document.getElementById('completed').onclick = function(){
  const status = 'completed';
  localStorage.setItem('Status', status);
};*/


function startUp(){
  loginCheck();
}

let xhr = new XMLHttpRequest();
var customsInfo;

function loginCheck(){
  let userID = window.localStorage.getItem('userId');
  if(userID != null){
    let first_name = window.localStorage.getItem('firstname');
    let avatar_url = '../assets/upload/clinic-64.png';
    
    if(document.getElementById('loginBefore') != undefined){
      document.getElementById('loginBefore').innerHTML=
      `<li class="nav-item dropdown" id="loginAfter"><a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><img id="login-image" src=${avatar_url} style="width: 30px;" alt="avater" title="Login">
      ${first_name}
      </a>
      <ul class="dropdown-menu dropdown-menu-end" id="dropdownInfo">
      <li><a class="dropdown-item" href="personal-info.html">Personal Information</a></li>
      <li><a class="dropdown-item" href="appointments-display.html" id="totalAppoint" onclick="toAppointDis();">Appointments Management</a></li>
      <li><a class="dropdown-item" href="../index.html" onclick="logOut()">Log Out</a></li>
      </ul>`;
    }
  }
}

function userCheck(){
  let userID = window.localStorage.getItem('userId');
  if(userID == null){
    alert(`Please login first.`);
    window.location.href = 'login.html';
  }else{
    window.location.href = 'appointment.html';
  }

}

function logOut() {
  localStorage.clear();
  window.location.href = '../index.html'; 
}

function toAppointDis(){
  let theStatus = 'total';
  localStorage.setItem('status',theStatus);
}

window.addEventListener('load',startUp);


