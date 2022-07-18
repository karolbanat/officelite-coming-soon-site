import moment from 'moment';

let releaseDateLabel = document.querySelector('#release-date');

const main = () => {
	loadReleaseDate();
};

const loadReleaseDate = () => {
	if (releaseDateLabel) {
		const release = moment().add(30, 'days').startOf('day');
		releaseDateLabel.setAttribute('datetime', release.format('YYYY-MM-DD'));
		releaseDateLabel.innerText = release.format('D MMM YYYY');
	}
};

document.addEventListener('DOMContentLoaded', main);
