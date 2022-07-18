import moment from 'moment';

let releaseDateLabel;
let releaseDaysLeft;
let releaseHoursLeft;
let releaseMinutesLeft;
let releaseSecondsLeft;

let subscriptionForm;
let nameInput;
let emailInput;
let submitBtn;
if (subscriptionForm) {
	const nameInput = subscriptionForm.querySelector('#name');
	const emailInput = subscriptionForm.querySelector('#email');
	const submitBtn = subscriptionForm.querySelector('#submit-btn');
}

const releaseDate = moment().add(30, 'days').startOf('day');
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();

	loadReleaseDate();
	handleCountdown();
	setInterval(handleCountdown, 1000);
};

const prepareDOMElements = () => {
	releaseDateLabel = document.querySelector('#release-date');
	releaseDaysLeft = document.querySelector('#release-days');
	releaseHoursLeft = document.querySelector('#release-hours');
	releaseMinutesLeft = document.querySelector('#release-minutes');
	releaseSecondsLeft = document.querySelector('#release-seconds');

	subscriptionForm = document.querySelector('.subscription-form');
	if (subscriptionForm) {
		nameInput = subscriptionForm.querySelector('#name');
		emailInput = subscriptionForm.querySelector('#email');
		submitBtn = subscriptionForm.querySelector('#submit-btn');
	}
};

const prepareDOMEvents = () => {
	if (subscriptionForm) {
		submitBtn.addEventListener('click', handleSubmitBtn);
		nameInput.addEventListener('focus', (e) => removeError);
		emailInput.addEventListener('focus', (e) => removeError);
		nameInput.addEventListener('focusout', validateName);
		emailInput.addEventListener('focusout', validateEmail);
	}
};

// countdowns
const loadReleaseDate = () => {
	if (releaseDateLabel) {
		releaseDateLabel.setAttribute('datetime', releaseDate.format('YYYY-MM-DD'));
		releaseDateLabel.innerText = releaseDate.format('D MMM YYYY');
	}
};

const handleCountdown = () => {
	const now = moment();
	const timeLeft = moment.duration(releaseDate - now);

	if (releaseDaysLeft) releaseDaysLeft.innerText = formatTime(timeLeft.days());

	if (releaseHoursLeft) releaseHoursLeft.innerText = formatTime(timeLeft.hours());

	if (releaseMinutesLeft) releaseMinutesLeft.innerText = formatTime(timeLeft.minutes());

	if (releaseSecondsLeft) releaseSecondsLeft.innerText = formatTime(timeLeft.seconds());
};

const formatTime = (time) => {
	return `${time < 10 ? 0 : ''}${time}`;
};

// form validation
const handleSubmitBtn = (e) => {
	e.preventDefault();
	validateName();
	validateEmail();
};

const validateName = () => {
	nameInput.classList.toggle('error', !nameInput.value);
};

const validateEmail = () => {
	emailInput.classList.toggle('error', !emailInput.value || !email.value.match(emailRegex));
};

const removeError = (e) => {
	e.target.classList.remove('error');
};

// event listeners
document.addEventListener('DOMContentLoaded', main);
