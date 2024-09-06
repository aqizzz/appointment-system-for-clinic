/* Purpose: Choose date and time for the appointment
   Date:   April 4, 2024
*/

'use strict';
import { getAppointmentTimes } from "./fetchAppointment.js";

class Appoitment {
  constructor(serviceName, servicePrice, apptDate, apptTime, timeStamp, status, paymentID){
    this.serviceName = serviceName,
    this.servicePrice = servicePrice,
    this.apptDate = apptDate,
    this.apptTime = apptTime,
    this.createdTimeStamp = timeStamp,
    this.status = status,
    this.paymentId = paymentID
  }
}

const appt = new Appoitment();
var timeRangeList = new Array();

let bookingOrder = 'AE08R3';
let dateMsg = "";
let timeMsg = "";
let servChecked = -1;
let dateChecked = 0;
let timeChecked = 0;
let calenderDays = null;
let calDays = null;
let currMonth = "";
let currYear = "";
let curYearN = 0;
let curMonthN = 0;
let dayofMonth = 0;
let selectedDay = null;
let serItems = document.querySelectorAll("#appointmenthead input");
let servDetail = document.querySelectorAll("#serdet p");
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let calul = document.getElementById("calDays");
let monthLable = document.getElementById("calMonth");
let yearLable = document.getElementById("calYear");
let decMonth = document.getElementsByClassName("prev");
let incMonth = document.getElementsByClassName("next");

let today = new Date();
let thisDate = today.getDate();
let thisMonth = today.getMonth();
let thisYear = today.getFullYear();
let thisDay = today.getDay();

makeCalender(thisMonth,thisYear);


for (let k = 0; k < serItems.length; k++) {
    serItems[k].addEventListener('click',()=>{
      if(servChecked != k) {
        servDetail[1].innerHTML = serItems[k].id;
        servDetail[5].innerHTML = "$"+serItems[k].value;
        appt.serviceName = serItems[k].id;
        appt.servicePrice = serItems[k].value;
        servChecked = k;
      if((dateChecked >= 0) || (timeChecked > 0)) resetDateTime();
      }
    });
}

incMonth[0].addEventListener('click', function() {
  findCurrentDate();

  if (curMonthN != 11) {
      curMonthN++;
  } else {
      curMonthN = 0;
      curYearN++;
  }

  calul.innerHTML = "";

  makeCalender(curMonthN, curYearN);
});

decMonth[0].addEventListener('click', function() {
  findCurrentDate();

  if ((curYearN > thisYear) || ((curYearN == thisYear) && (curMonthN > thisMonth))) {
      if (curMonthN != 0) {
          curMonthN--;
      } else {
          curMonthN = 11;
          curYearN--;
      }

      calul.innerHTML = "";

      makeCalender(curMonthN, curYearN);
  }
});



function findDays(txtString) {
    const regExp = /\d+/;
    return parseInt(txtString.match(regExp));
}

function findCurrentDate() {
  currMonth = monthLable.innerHTML;
  currYear = yearLable.innerHTML;

  curYearN = parseInt(currYear);
  curMonthN = months.indexOf(currMonth);
}

function makeCalender(theMonth, theYear) {
    let curday = new Date(theYear, theMonth, 1);
    let day1stMonth = curday.getDay();

    for (let di = 1; di <= day1stMonth; di++) {
        calul.innerHTML += "<li><span class=\"inactive\">&nbsp;</span></li>";
    }

    if ((theMonth == 1) && ((theYear & 3) == 0 && ((theYear % 25) != 0 || (theYear & 15) == 0))) {
        dayofMonth = daysInMonth[theMonth] + 1;
    } else {
        dayofMonth = daysInMonth[theMonth];
    }

    for (let dj = 1; dj <= dayofMonth; dj++) {
        if ((theMonth == thisMonth) && (dj < thisDate + 3) && (theYear == thisYear)) {
            calul.innerHTML += "<li><span class=\"inactive\">" + dj + "</span></li>";
        } else {

            if ((dateChecked == 1) && (selectedDay.getDate() == dj) && (selectedDay.getMonth() == theMonth) && (selectedDay.getFullYear() == theYear)) {
                calul.innerHTML += "<li><span class=\"active\">" + dj + "</span></li>";
            } else {
                calul.innerHTML += "<li><span>" + dj + "</span></li>";
            }
        }
    }

    for (let dk = 1; dk <= 42 - (daysInMonth[thisMonth] + day1stMonth); dk++) {
        calul.innerHTML += "<li><span class=\"inactive\">&nbsp;</span></li>";
    }

    monthLable.innerHTML = months[theMonth];
    yearLable.innerHTML = theYear;

    hookupDays();

}

function hookupDays() {
  calenderDays = document.querySelectorAll(".days li span");
  calDays = document.querySelectorAll(".days li");

  findCurrentDate();

  function handleMouseOver() {
      if (this.className !== "inactive") {
          this.style.backgroundColor = 'lightyellow';
      }
  }

  function handleMouseOut() {
      if (this.className !== "inactive") {
          this.style.backgroundColor = '#eee';
      }
  }

  function handleClick() {
      let actDay = document.querySelectorAll(".days li span.active");

      if (this.className !== "inactive") {
          if (servChecked >= 0) {
              if (actDay.length < 1) {
                  this.classList.toggle("active");
              } else {
                  actDay[0].classList.toggle("active");
                  this.classList.toggle("active");
              }

              let dateTxt = this.innerHTML;

              let selday = new Date(curYearN, curMonthN, findDays(dateTxt));

              dateMsg = weeks[selday.getDay()] + ", " + months[curMonthN] + " " + findDays(dateTxt) + ", " + curYearN;

              servDetail[2].innerHTML = dateMsg;

              document.getElementById("date-content").innerHTML = dateMsg;
              // add the value of apptDate
              const apptMonth= curMonthN+1;
              const apptDay = dateTxt;
              const apptWeekday = weeks[selday.getDay()];

              appt.apptDate = `${apptWeekday}, ${curYearN}-${(apptMonth<10)?"0"+apptMonth:apptMonth}-${(apptDay<10)?"0"+apptDay:apptDay}`;
              
              dateChecked = 1;
              selectedDay = selday;
             
              //timeRangeList = getAppointmentTimes(appt.apptDate,appt.serviceName);
              //console.log(timeRangeList);
              getDataFromServer(appt.apptDate,appt.serviceName);
              
          } else {
              alert("Please choose a service first!");
          }
      }
  }

  calDays.forEach((day, index) => {
      if (calenderDays[index].className !== "inactive") {
          day.addEventListener('mouseover', handleMouseOver);
          day.addEventListener('mouseout', handleMouseOut);
          calenderDays[index].addEventListener('click', handleClick);
      }
  });
}
    
function resetDateTime(){
    dateChecked = 0;
    servDetail[2].innerHTML = "Choose Date.";
    servDetail[3].innerHTML = "Choose time.";
    document.getElementById("date-content").innerHTML = "Please choose a date first.";

    calul.innerHTML = "";
    makeCalender(curMonthN,curYearN);

    let actTime = document.querySelectorAll(".timetable li.active");
    if(actTime.length >= 1) {
        actTime[0].classList.toggle("active");
    }
    timeChecked = 0;
}

function makeTimeTable(){
    let timeTable = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM", "12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"]

    let result = "";
    for(var i=0;i<timeTable.length;i++){
        let timeIsLocked = findInTimeList(timeTable[i]);
        if(timeIsLocked){
          result += `<li class="inactive">`;
        }else{
          result += `<li>`;
        }
        result += `${timeTable[i]}</li>`;
        
    }
  
    document.getElementById("timeTable").innerHTML = result;
    hookuptime();
}


function hookuptime() {
  
  let timelist = document.querySelectorAll(".timetable li:not(.inactive)");
  
  function handleClick() {
    let actTime = document.querySelectorAll(".timetable li.active");
    if (dateChecked == 0){
      alert("Please choose a date first!");
    }else{
      if (actTime.length < 1) {
          this.classList.toggle("active");
      } else {
          actTime[0].classList.toggle("active");
          this.classList.toggle("active");
      }

      timeChecked = 1;
      timeMsg = this.innerHTML;
      servDetail[3].innerHTML = timeMsg;
      appt.apptTime = timeMsg;
    }
  }

  timelist.forEach(item => {
      item.addEventListener('click', handleClick);
  });
}

function startUp() {
  let serviceID = window.localStorage.getItem('serviceID');
  if (serviceID != null) {
      lockService(serviceID);
  }
}



function savelocalinfo(){
  if((servChecked != -1)&&(dateChecked != 0)&&(timeChecked != 0)){
      const jsonAppt = JSON.stringify(appt);
      localStorage.setItem('apptObj', jsonAppt);
      return true;
  } else {
      alert("Please finish making the appointment!")
      return false;
  }
}




function findInTimeList(theTimeTemplete){
  if(timeRangeList.length > 0){
    for(var i=0;i<timeRangeList.length;i++){
      if(timeRangeList[i]===theTimeTemplete){
        return true;
      }
    }
  }
  return false;
}

function getDataFromServer(apptDate,serviceName){

  let url = '/getAppointmentTime?apptDate=' + apptDate + '&&serviceName=' + serviceName;
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); 
  })
  .then(data => {
    console.log('Data from server:', data);
    timeRangeList = new Array();
    for (let appt of data) {
      timeRangeList.push(appt.apptTime);
    }
   
    console.log(timeRangeList);
    makeTimeTable();
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}


document.getElementById("make-appointment").addEventListener("click", savelocalinfo);
window.addEventListener('load', startUp);