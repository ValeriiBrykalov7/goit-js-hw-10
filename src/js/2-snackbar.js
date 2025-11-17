import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  formElem: document.querySelector('.form'),
};

refs.formElem.addEventListener('submit', e => {
  const delay = Number(e.target.elements.delay.value);
  const state = e.target.elements.state.value;
  e.preventDefault();

  const promise = new Promise((res, rej) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        res(delay);
      } else {
        rej(delay);
      }
    }, delay);
  });

  promise
    .then(value => {
      iziToast.success({
        title: 'OK',
        message: `Fullfilled promise in ${value}ms`,
        position: 'topRight',
      });
    })
    .catch(value => {
      iziToast.error({
        title: 'Error',
        message: `Rejected promise in ${value}ms`,
        position: 'topRight',
      });
    });

  e.target.reset();
});
