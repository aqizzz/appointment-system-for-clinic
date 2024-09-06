// JavaScript source code
// main.js 

// Updated Date: Aprl 4, 2024

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
      <li><a class="dropdown-item" href="pages/personal-info.html">Personal Information</a></li>
      <li><a class="dropdown-item" href="pages/appointments-display.html" id="totalAppoint" onclick="toAppointDis();">Appointments Management</a></li>
      <li><a class="dropdown-item" href="index.html" onclick="logOut()">Log Out</a></li>
      </ul>`;
    }
  }
}

function userCheck(){
  let userID = window.localStorage.getItem('userId');
  if(userID == null){
    alert(`Please login first.`);
    window.location.href = 'pages/login.html';
  }else{
    window.location.href = 'pages/appointment.html';
  }

}

function logOut(){
  const first_name = window.localStorage.getItem('firstname');
  const last_name = window.localStorage.getItem('lastname');
  let result;
  result = window.confirm('Dear ' + first_name + ' ' + last_name+'. Log out this website?')
  if(result){
      localStorage.clear();
      startUp;
  }else{
      startUp;
  }
    
}

function toAppointDis(){
  let theStatus = 'total';
  localStorage.setItem('status',theStatus);
}

window.addEventListener('load',startUp);


