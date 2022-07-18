import moment from 'moment';

const releaseDateLabel = document.querySelector('#release-date');
const releaseDaysLeft = document.querySelector('#release-days');
const releaseHoursLeft = document.querySelector('#release-hours');
const releaseMinutesLeft = document.querySelector('#release-minutes');
const releaseSecondsLeft = document.querySelector('#release-seconds');

const releaseDate = moment().add(30, 'days').startOf('day');

const main = () => {
	loadReleaseDate();
	handleCountdown();
	setInterval(handleCountdown, 1000);
};

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

document.addEventListener('DOMContentLoaded', main);
