import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  inputElem: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  daysElem: document.querySelector('[data-days]'),
  hoursElem: document.querySelector('[data-hours]'),
  minutesElem: document.querySelector('[data-minutes]'),
  secondsElem: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickTime = selectedDates[0];
    if (pickTime <= new Date()) {
      iziToast.show({
        color: '#ff0000ff',
        message: 'Please choose a date in the future',
        messageColor: 'white',
        position: 'topRight',
        iconUrl: '../img/sad.svg',
        maxWidth: 500,
      });
      refs.startBtn.disabled = true;
      return;
    }
    userSelectedDate = pickTime;
    refs.startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

const timer = {
  intervalId: null,
  isActive: false,
  start() {
    if (!userSelectedDate || this.isActive) return;
    this.isActive = true;
    refs.startBtn.disabled = true;
    refs.inputElem.disabled = true;
    this.intervalId = setInterval(() => {
      const currentTime = new Date();
      const diff = userSelectedDate - currentTime;
      console.log(diff);

      if (diff <= 0) {
        this.stop();
        refs.daysElem.textContent = '00';
        refs.hoursElem.textContent = '00';
        refs.minutesElem.textContent = '00';
        refs.secondsElem.textContent = '00';
      } else {
        refs.daysElem.textContent = addLeadingZero(convertMs(diff).days);
        refs.hoursElem.textContent = addLeadingZero(convertMs(diff).hours);
        refs.minutesElem.textContent = addLeadingZero(convertMs(diff).minutes);
        refs.secondsElem.textContent = addLeadingZero(convertMs(diff).seconds);
      }
    }, 1000);
  },
  stop() {
    this.isActive = false;
    clearInterval(this.intervalId);
    refs.inputElem.disabled = false;
    refs.startBtn.disabled = true;
  },
};

refs.startBtn.addEventListener('click', () => {
  timer.start();
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
