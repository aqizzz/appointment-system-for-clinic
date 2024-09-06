'use strict';

const appt = JSON.parse(window.localStorage.getItem("apptObj")) ;
var appointmentId = window.localStorage.getItem("appointmentId");


window.addEventListener("load",()=>{
  document.getElementById("serviceName").innerHTML = appt.serviceName;
  document.getElementById("appointmentId").innerText = "#"+ bookingNumber(appointmentId);
  document.getElementById("apptDate").innerText = appt.apptDate;
  document.getElementById("apptTime").innerText = appt.apptTime;
  localStorage.removeItem("apptObj");
});


function bookingNumber(bookingOrder){
  let newString = (parseInt(bookingOrder, 16) + 1).toString(16).toUpperCase();
  let result = "";
  if(newString.length < 6){
    for(let i=0;i < (6-newString.length);i++){
      result+="0";
    }
  }
  result += newString;
  
  return result;
}