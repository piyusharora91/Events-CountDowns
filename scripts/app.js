// basic details of the event to be added
class userCustomOccasions {
    constructor(id, eventName, date) {
        this.id = id;
        this.eventName = eventName;
        this.date = date;
    }
}


//does UI events
class UI {
    static loadUserEvents() {
        let events = Store.getUserEvents();
        events.forEach((event) => UI.addEvent(event));
    }

    static addEvent(eventDetails) {
        const list = document.querySelector('#events-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>
            ${eventDetails.id}
        </td>
        <td>
            ${eventDetails.eventName}
        </td>
        <td>
            ${eventDetails.date}
        </td>
        <td>
            <button type="button" class="btn btn-danger remove">X</button>
        </td>
        `;
        list.appendChild(row);
    }

    static deleteEvent(eventTarget) {
        eventTarget.remove();
    }

    static showAlert(message, status) {
        const div = document.createElement('div');
        div.className = `alert alert-${status}`;
        div.style.textAlign = 'center';
        div.appendChild(document.createTextNode(message));
        div.style.zIndex = -9;
        const container = document.querySelector('body');
        const header = document.querySelector('.container');
        container.insertBefore(div, header);

        setTimeout(() => document.querySelector('.alert').remove(), 1000);          //vanishes in 1 sec
    }

    static clearFields(eventName, eventDate) {
        eventName.value = '';
        eventDate.value = '';
    }

    static displayCount(event) {
        const currentTime = new Date();
        const days = document.querySelector('#days');
        const hours = document.querySelector('#hours');
        const minutes = document.querySelector('#minutes');
        const seconds = document.querySelector('#seconds');
        let currentYear = currentTime.getFullYear();

        if ((currentTime.getMonth() + 1) >= event.month) {
            if (currentTime.getDate() <= event.date || (currentTime.getMonth() + 1) >= event.month) {
                currentYear++;
            }
        }

        const newYearTime = new Date(`${event.month} ${event.date} ${currentYear} 00:00:00`);
        const timeLeft = newYearTime - currentTime;

        const d = Math.floor(timeLeft / 1000 / 60 / 60 / 24);
        const h = Math.floor(timeLeft / 1000 / 60 / 60) % 24;
        const m = Math.floor(timeLeft / 1000 / 60) % 60;
        const s = Math.floor(timeLeft / 1000) % 60;
        days.innerText = d;
        hours.innerText = h;
        minutes.innerText = m;
        seconds.innerText = s;
    }
}


//stores, removes and accesses events from browser's local storage
class Store {
    static getUserEvents() {
        let events;
        if (localStorage.getItem('events') === null) {
            events = [];
        }
        else {
            events = JSON.parse(localStorage.getItem('events'));
        }
        return events;
    }

    static addEvent(customEvent) {
        const events = Store.getUserEvents();
        events.push(customEvent);
        localStorage.setItem('events', JSON.stringify(events));
    }

    static deleteEvent(id) {
        const events = Store.getUserEvents();
        console.log(events);
        events.forEach((event, index) => {
            if (event.id == id) {
                events.splice(index, 1);
            }
        });
        localStorage.setItem('events', JSON.stringify(events));
    }
}

document.addEventListener('DOMContentLoaded', UI.loadUserEvents);


const eventName = document.querySelector('#event-name');
const eventDate = document.querySelector('#event-date');
const submitEvent = document.querySelector('#submit');
const eventsList = document.querySelector('#events-list');

let id = 1;

document.addEventListener('DOMContentLoaded', UI.loadUserEvents);

//add custom user event 
submitEvent.addEventListener('click', (e) => {
    e.preventDefault();
    if (eventName.value === '' || eventDate.value === '') {
        UI.showAlert('Please fill in all the details!!', 'danger');
    }
    else {
        const event = new userCustomOccasions(id, eventName.value, eventDate.value);
        UI.addEvent(event);
        Store.addEvent(event);
        UI.showAlert('Event Added Successfully', 'success');
        UI.clearFields(eventName, eventDate);
        id += 1;
    }
});

eventsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
        UI.deleteEvent(e.target.parentElement.parentElement);
        Store.deleteEvent(e.target.parentElement.parentElement.firstElementChild.textContent);
        UI.showAlert('Event Removed Successfully', 'success');
    }
});