'use strict';
import { getCustomerInfo } from "./fetchCustomer.js";
import { createPayment } from "./fetchPayment.js";
import { createAppointment } from "./fetchAppointment.js";


let appt = JSON.parse(window.localStorage.getItem('apptObj'));
var customer = new Object();

class Payment{
  constructor(cardType,cardNumber,ownerName, cvvNumber,cardExpDate, servicePrice, serviceFee,donation, totalAmount){
    this.cardType = cardType,
    this.cardNumber = cardNumber, 
    this.ownerName = ownerName, 
    this.cvvNumber = cvvNumber, 
    this.cardExpDate = cardExpDate, 
    this.servicePrice = servicePrice, 
    this.serviceFee = serviceFee,
    this.donation = donation, 
    this.totalAmount = totalAmount
    this.needRefund = false;
  }
}

const payment = new Payment();


async function userDetails(){
  customer = await getCustomerInfo();
  appt.customerId = customer.customerId;
  document.getElementById("client-details").innerHTML =
             `Name: ${customer.firstname} ${customer.lastname}<br>
              Email: ${customer.email}<br>
              Phone Number: ${customer.phone}<br>`;
}

function apptDetails(){
  document.getElementById("appt-details").innerHTML = 
        `${appt.serviceName}<br>
        ${appt.apptDate}<br>
        ${appt.apptTime}<br>
        1hr<br>
        $${appt.servicePrice}<br><br>
        ` ;
  
  payment.servicePrice = appt.servicePrice;
  getServiceFee();
}


function getTotal(){
  var total = parseFloat(payment.servicePrice) +parseFloat(payment.serviceFee);
  payment.donation = parseFloat(document.getElementById("donation").value);
  var theDonation  = parseFloat(payment.donation); 
 
  payment.totalAmount = (total + theDonation).toFixed(2);
  document.getElementById("totalAmount").innerHTML = `$${parseFloat(payment.totalAmount).toFixed(2)}`;
  return;
}

function getServiceFee(){
  const price= parseFloat(payment.servicePrice);
  if(price>=100){
    payment.serviceFee= (price* 0.05).toFixed(2);
    document.getElementById("serviceFee").innerHTML ="$" + payment.serviceFee;
    payment.totalAmount =( price + price * 0.05).toFixed(2);
    getTotal();
  }else{
    payment.serviceFee= 0;
    getTotal();
  }
 
  return;
}

async function submitPayment(){
 
  if(validateCardType() && validateOwnerName() && validateCardNumber() && validateCardCvv() && validateCardExpDate()){
    
    appt.paymentId = await createPayment(payment);// here to call the function postPaymentInfo(payment),and get the paymentId
    let appointmentId = await createAppointment(appt);
    console.log("here is appointmentId :"+appointmentId);
    const jsonAppt = JSON.stringify(appt);
    localStorage.setItem('apptObj', jsonAppt);
    localStorage.setItem('appointmentId',appointmentId);
    if(appt.paymentId != "undefined"){
      window.location.href = 'book-completed.html';
    }
    
  }
 
}



function getCardType(){
  var cardTypes= document.getElementsByName('cardType');

  if (cardTypes && cardTypes.length > 0) {
    for (var i = 0; i < cardTypes.length; i++) {
      cardTypes[i].addEventListener("change", function() {
        payment.cardType = this.id;
      });
    }
  } else {
    console.error("No elements found with name 'cardType'");
  }
  return ;
}

function validateCardType() {
  var cardType = payment.cardType;
  if (cardType === "visa" || cardType === "master") {
    
    return true; 
  } else {
    window.alert("Please choose the type of your card.");
    return false; 
  }
}

function validateCardNumber() {
  var input = document.getElementById("cardNumber").value;
  var cardNumberPattern = /^\d{16}$/;
  if (cardNumberPattern.test(input)) {
    payment.cardNumber = input;
    return true; 
  } else {
    window.alert("Please enter a valid 16-digit credit card number");
    return false; 
  }
}

function validateCardCvv() {
  var input = document.getElementById("cvvNumber").value;
  var cardCvvPattern = /^\d{3}$/;
  if (cardCvvPattern.test(input)) {
    payment.cvvNumber = input;
    return true; 
  } else {
    window.alert("Please enter a valid 3-digit CVV number");
    return false; 
  }
}

function validateOwnerName() {
  var input = document.getElementById("nameOnCard").value;
  var namePattern = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
  if (namePattern.test(input)) {
    payment.ownerName = input;
    return true; 
  } else {
    window.alert("Please enter the correct name on the card");
    return false; 
  }
}

function validateCardExpDate() {
  var input = document.getElementById("experiedDate").value;
  var today = new Date();
  var nowYear = today.getFullYear();
  var nowMonth = today.getMonth() + 1;
  var nowDay = today.getDay();

  var thisDay =  nowYear + "-" + ((nowMonth<10)?"0"+nowMonth:nowMonth) + "-" + ((nowDay<10)?"0"+nowDay:nowDay) 

  if (input >= thisDay) {
    payment.cardExpDate = input;
    return true; 
  } else {
    window.alert("The exparied date is invalid, please try again");
    return false; 
  }
}





document.getElementById("donation").addEventListener('click',getTotal);
document.getElementById("bookingNow").addEventListener('click',submitPayment);

window.addEventListener('load',()=>{
  
  userDetails();
  apptDetails();
  getCardType();
 
 
});