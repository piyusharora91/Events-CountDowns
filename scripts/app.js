// basic details of the event to be added
class userCustomOccasions {
    constructor(eventName, date, month) {
        this.eventName = eventName;
        this.date = date;
        this.month = month;
    }
}


//does UI events
class UI {
    static openForm() {
        document.getElementById("myForm").style.display = "block";
    }

    static closeForm() {
        if (document.getElementById("myForm").style.display === "block") {
            document.getElementById("myForm").style.display = "none";
            UI.clearFields();
        }
    }

    static loadAppElements(date, month, nonFormContainers) {
        for (let i = 1; i <= 31; i++) {             //displays dates in numbers
            const add_date = document.createElement('option');
            if (i < 10) {
                add_date.textContent = '0' + i;
            }
            else add_date.textContent = i;
            add_date.value = i;
            date.append(add_date);
        }

        for (let i = 1; i <= 12; i++) {               //displays months in numbers
            const add_month = document.createElement('option');
            if (i < 10) {
                add_month.textContent = '0' + i;
            }
            else add_month.textContent = i;
            add_month.value = i;
            month.append(add_month);
        }

        // this handles add event form closing on page if clicked anywhere else rather than form
        for (let i = 0; i < nonFormContainers.length; i++) {
            nonFormContainers[i].addEventListener('click', UI.closeForm);
        }
    }

    static loadUserEvents() {
        let events = Store.getUserEvents();
        events.forEach((event) => UI.addEvent(event));
    }

    static addEvent(eventDetails) {
        const eventsList = document.querySelector('.events-list');
        const addEventCard = document.createElement('div');     //creating the div block of card to display on the events-list container
        addEventCard.classList.add('card', 'text-white', 'bg-dark', 'm-3');
        addEventCard.style.maxWidth = '20rem';
        addEventCard.innerHTML = `                            
            <div class= "card-body">
                <h4 class= "card-title p-10">${eventDetails.eventName}</h4>
                <button type="button" class="btn btn-primary btn-sm delete-event">X</button>
            </div>
        `;
        eventsList.appendChild(addEventCard);               //adding the block to events list 
    }

    static deleteEvent(eventTarget) {
        if (eventTarget.classList.contains('delete-event')) {
            eventTarget.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, status) {
        const div = document.createElement('div');
        div.className = `alert alert-${status}`;
        div.style.textAlign = 'center';
        div.appendChild(document.createTextNode(message));
        div.style.zIndex = -9;
        const container = document.querySelector('body');
        const header = document.querySelector('.header');
        container.insertBefore(div, header);

        setTimeout(() => document.querySelector('.alert').remove(), 800);          //vanishes in 0.8 sec
    }

    static clearFields() {
        document.querySelector('#event-name').value = '';
        document.querySelector('#date').value = 'DATE';
        document.querySelector('#month').value = 'MONTH';
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

    static deleteEvent(customEventName) {
        const events = Store.getUserEvents();
        events.forEach((event, index) => {
            if (event.eventName === customEventName) {
                events.splice(index, 1);
            }
        });
        localStorage.setItem('events', JSON.stringify(events));
    }
}


let date = document.querySelector('#date');
let month = document.querySelector('#month');
const nonFormContainers = document.querySelectorAll('.non-form-containers');
const submitCustomEvent = document.querySelector('.submit-custom-event');

UI.loadAppElements(date, month, nonFormContainers);
UI.loadUserEvents();


//add new event 
submitCustomEvent.addEventListener('click', (e) => {
    e.preventDefault();
    const eventName = document.querySelector('#event-name').value;
    const setDate = document.querySelector('#date').value;
    const setMonth = document.querySelector('#month').value;

    if (eventName === '' || setDate === 'DATE' || setMonth === 'MONTH') {
        UI.showAlert('Please fill in all The fields!!', 'primary');
    }
    else {
        const newEvent = new userCustomOccasions(eventName, setDate, setMonth);
        UI.addEvent(newEvent);
        Store.addEvent(newEvent);
        UI.showAlert('Event Successfully Added', 'success');
        UI.clearFields();
        UI.closeForm();
    }
});


// delete any custom event upon clicking cross in card
document.querySelector('.events-list').addEventListener('click', (e) => {
    UI.deleteEvent(e.target);
    Store.deleteEvent(e.target.previousElementSibling.innerText);
    UI.showAlert('Event Successfully Removed', 'success');
});