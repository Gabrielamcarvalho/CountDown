'use strict';

const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

//Set today date as the minimum input
const today = new Date().toISOString().split('T')[0];

dateEl.setAttribute('min', today);

//Take values from Form input
function updateCountDown(e) {
  e.preventDefault(); //prevent submit form
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;

  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  if (countdownDate === '') {
    alert('Please select a date for the countdown');
  } else {
    //Get number version of current Date, updateDOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

//Populate countdown /complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    //Hide input
    inputContainer.hidden = true;

    //if countdown has ended, show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      //Else, show the countdown in progress
      //Populate countdown
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;

      //Show countdown
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

//Reset all values
function reset() {
  //hide countdowns, show input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;

  //stop countdown
  clearInterval(countdownActive);
  //Reset values
  countdownDate = '';
  countdownTitle = '';
  localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
  //get countdown from localStorage if available
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

//Event Listeners
countdownForm.addEventListener('submit', updateCountDown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

//On Load, check local storage
restorePreviousCountdown();
