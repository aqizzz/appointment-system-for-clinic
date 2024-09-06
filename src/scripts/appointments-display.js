// JavaScript source code
// appointments_display.js 

// Updated Date: April 4, 2024

'use strict';
import { getAppointments, getAppointmentTimes, createAppointment, deleteAppointment, updateAppointment, feedbackCompleted } from "./fetchAppointment.js";
import { refundPayment } from "./fetchPayment.js";
import { createFeedback } from "./fetchFeedback.js";

let appointmentList;
let fbArray = [];

window.addEventListener('load',startUp);
window.addEventListener('load',setLeftSideBar);

async function startUp(){
  try {
    appointmentList = await getAppointments(window.localStorage.getItem('userId'));
    let status = window.localStorage.getItem('status');
    if(status === null || status === undefined) {
      status = 'total'; 
      window.localStorage.setItem('status', status); 
    }
    let serviceID = window.localStorage.getItem('serviceID');
    if(serviceID != undefined){
      rescheduleChange();
    }

    displayAppointments(status,appointmentList);

  } catch (error) {
    console.error('Error starting up:', error);
  }
}

document.getElementById('status-option').onchange=()=>{
  let status = document.getElementById('status-option').value;
  localStorage.setItem('status',status);
  startUp();
}

function setLeftSideBar(){
  let first_name = window.localStorage.getItem('firstname');
  let last_name = window.localStorage.getItem('lastname');
  // set name in leftsidebar
  document.getElementById('personalInfoName').innerHTML = first_name;

  // set the src of each avatar on this page
  let avatars = document.getElementsByName('avatar');
  for(let i=0;i<avatars.length;i++){
    avatars[i].src = "../assets/upload/clinic-64.png";
  }
}

/**
 * 
 * @param {string} theStatus 
 * @param {Array} appointmentList 
 */

function displayAppointments(theStatus, appointmentList) {
  let appointments = ""; 
  let titleName = "";
  let optionTitle = "<td>Options</td>";
  if (theStatus == "uncompleted") {
    titleName = "Uncompleted Appointments";
  } else if (theStatus == "completed") {
    titleName = "Completed Appointments";
  } else if (theStatus == "total") {
    titleName = "Appointments";
  } else {
    titleName = "Appointment" + theStatus;
    optionTitle = "";
  }

  document.getElementById('appointTitle').innerHTML = titleName;

  appointments += 
    `<table >
      <tr class="listDisplay-tr">
        <td>Appt #</td>
        <td>Service</td>
        <td>Appointment<br>Date&nbsp;&&nbsp;Time</td>
        <td>Booking<br>Date&nbsp;&&nbsp;Time</td>
        <td>Status</td>${optionTitle}
      </tr>`;
  fbArray = [];
  for (let i = 0; i < appointmentList.length; i++) {
    if (appointmentList[i].status == theStatus || theStatus == 'total' || theStatus == 'Feedback') {
      let timeStamp = appointmentList[i].createdTimeStamp.replace("T", ' ');
      timeStamp = timeStamp.replace("Z", "");
      appointments += 
        `<tr class="listDisplay-tr">
          <td>${appointmentList[i].appointmentId}</td>
          <td>${appointmentList[i].serviceName}</td>
          <td>${appointmentList[i].apptDate} ${ appointmentList[i].apptTime }</td>
          <td>${timeStamp}</td>
          <td>${appointmentList[i].status}</td>`;
          
      if (appointmentList[i].status == 'uncompleted') {
        appointments += 
          `<td>
            <button class="btn-reschedule" name="reschedule-button" data-index="${i}">reschedule</button>
            <button class="btn-cancel" name="cancel-button" data-index="${i}">cancel</button>
          </td></tr>`;
      } else if (appointmentList[i].status == 'completed' && theStatus != 'Feedback') {
        if (appointmentList[i].feedbackCompleted === false) {
          appointments += `<td><button id="btn-feedback${i}" class="btn-feedback" name="feedback-button" data-index="${i}">feedback</button></td></tr>`;
        } else {
          appointments += `<td><button id="btn-feedback${i}" class="btn-feedback" name="feedback-button" data-index="${i}" disabled style="background-color: lightgrey;">feedback</button></td></tr>`;
        }
        fbArray.push({index: i, appointmentId: appointmentList[i].appointmentId, service: appointmentList[i].serviceName});
      }

      if (theStatus == 'Feedback') {
        appointments += `<tr><td colspan="6">`;
        return displayFeedback(appointments);
      }

      appointments += `<tr><td colspan="6"><div id="details${i}"></div></td></tr>`;
    }
  }

  appointments += `</table><hr>`; 
  document.getElementById('listDisplay').innerHTML = appointments;

  const rescheduleButtons = document.querySelectorAll('.btn-reschedule');
  rescheduleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      reschedule(index);
    });
  });

  const cancelButtons = document.querySelectorAll('.btn-cancel');
  cancelButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      cancel(index);
    });
  });

  const feedbackButtons = document.querySelectorAll('.btn-feedback');
  feedbackButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      feedback(index);
    });
  });
}

function feedback(index){
  let orderID = fbArray[index].appointmentId;
  let service = fbArray[index].service;
  localStorage.setItem('orderID',orderID);
  localStorage.setItem('service',service);
  let theId = "details"+index;
  document.getElementById(theId).innerHTML=index;
  let feedback = true;
  localStorage.setItem('feedback',feedback);
  let newList = [appointmentList[index]];

  displayAppointments('Feedback',newList);
  localStorage.setItem('feedbackIndex',index);
}

function displayFeedback(theMsg){

  let questions = [
    ["Where did you hear about us?(select all that apply)",
    "Internet","Magazine","Newspaper","Word of Mouth","Other"],
    ["How far in advance did you make your appointment?",
    "Less than 1 week","Within 2 weeks","Within 1 month","Within 2 months","More than 2 months"],
    ["Were you seen in a timely manner after arriving for your appointment?",
    "Immediately","Promptly","Reasonably","Delayed","Significantly Delayed"],
    ["Were you provided with clear instructions regarding your treatment or follow-up care?",
    "Very Clear","Clear","Fair","Unclear","Not Clear at All"],
    ["How do you feel like our services",
    "Extremely satisfied","Very satisfied","Satisfied","Dissatisfied","Very dissatisfied"]
  ]; 
  
  let message = theMsg +`<form id="form-feedback" class="my-3" method="get" action="#" autocomplete="on" autocapitalize="words"><table><tr><td colspan="5">Thank you for your patience to finish this form~! Please choose the option below.</td></tr>`;

  for(let index=0;index<questions.length;index++){

    message += `<tr id="question${index}"><td colspan="5"><label>${(index+1)}. ${questions[index][0]}</label></td></tr><tr>`;
    for(let i=1;i<questions[index].length;i++){

      message += `<td><input type="radio" id="answer${index}${i}" value="${questions[index][i]}" name="answer${index}">
      <label for="answer${index}${i}">${questions[index][i]}</label></td>`
    }
  }
  message+=`<tr>
  <td colspan="5"><button class="w-50 btn-feedback" type="submit" name="feedback-submit" id="submitBtn">Submit</button></td></tr></table></form></td></tr></table>`;


  document.getElementById('listDisplay').innerHTML = message;
  let submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let index = window.localStorage.getItem('feedbackIndex');
    feedbackSub(index);
  });
  
  $('#form-feedback table tr').css({
    'justify-content': 'center'
  });

  $('#form-feedback table tr:odd').css({
    'background-color': '#ddd',
    'color'           : '#00f'
    
  });

  $('#form-feedback table tr:odd td').css({
    'text-align': 'left',
    'padding-left'    : '3px'
  });

  $('#form-feedback table tr:odd td:last').css({
    'text-align': 'center'
  });

  $('#form-feedback td label').css({
    'font-size':'0.8rem'
  });

}


async function feedbackSub(){
  let radioAns = document.querySelectorAll('input[type="radio"]:checked');
  let feedbackData = {
    serviceName: window.localStorage.getItem('service'),
    source: radioAns[0].value,
    preSchedule: radioAns[1].value,
    promptReceptionLevel: radioAns[2].value,
    instructionClarityLevel: radioAns[3].value,
    satisfactionLevel: radioAns[4].value,
  }
  localStorage.setItem('feedback', false);
  let apptId = window.localStorage.getItem('orderID');
  await feedbackCompleted(apptId);
  await createFeedback(feedbackData);
  localStorage.removeItem('orderID');
  localStorage.removeItem('service');
  location.reload();
}

/**
 * 
 * @param {string} elementID 
 */

function reschedule(elementID) {

  let orderID = appointmentList[elementID].appointmentId;
  let servicesList = ['Family Doctor','Urgent Care','X-ray','Blood Test']
  let value = appointmentList[elementID].serviceName;
  let serviceID = servicesList.indexOf(value);

  localStorage.setItem('serviceID',serviceID);
  localStorage.setItem('orderID',orderID);
  localStorage.setItem('orderIndex',elementID);

  window.location.href = 'reschedule.html';
}

function rescheduleChange(){
  let newDate = window.localStorage.getItem('newDate');
  let newTime = window.localStorage.getItem('newTime');
  let newWeek = window.localStorage.getItem('newWeek');
  let bodateMsg = window.localStorage.getItem('bodateMsg');
  let botimeMsg = window.localStorage.getItem('botimeMsg');
  let boweekMsg = window.localStorage.getItem('boweekMsg');
  let orderIndex = parseInt(window.localStorage.getItem('orderIndex'));
  
  appointmentList[orderIndex][2]=newWeek+"<br>"+newDate +"<br>"+newTime;
  appointmentList[orderIndex][3]=boweekMsg+"<br>"+bodateMsg +"<br>"+botimeMsg;
  
  localStorage.removeItem('serviceID');
  localStorage.removeItem('orderIndex');
  localStorage.removeItem('orderID');
}

/**
 * 
 * @param {string} elementID 
 */

async function cancel(elementID){
  let apptId = appointmentList[elementID].appointmentId;
  let result;
  result = window.confirm('Cancel this appointment?')
  if(result){
    appointmentList.splice(elementID, 1);
    displayAppointments('total',appointmentList);
    let paymentId = await deleteAppointment(apptId);
    await refundPayment(paymentId.paymentId);
  }    
}