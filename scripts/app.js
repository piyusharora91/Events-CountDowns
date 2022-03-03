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
        }
    }
    static loadAppElements(date, month, nonFormContainers, year) {
        const displayYearContainer = document.querySelector('.year-display');
        displayYearContainer.innerText = year;    //Displays Year on heading  

        //displays dates in numbers
        for (let i = 1; i <= 31; i++) {
            const add_date = document.createElement('option');
            if (i < 10) {
                add_date.innerHTML = '0' + i;
            }
            else add_date.innerHTML = i;
            add_date.value = i;
            date.append(add_date);
        }

        //displays months in numbers
        for (let i = 1; i <= 12; i++) {
            const add_month = document.createElement('option');
            if (i < 10) {
                add_month.innerHTML = '0' + i;
            }
            else add_month.innerHTML = i;
            add_month.value = i;
            month.append(add_month);
        }

        // this handles add event form closing on page if clicked anywhere else rather than form
        for (let i = 0; i < nonFormContainers.length; i++) {
            nonFormContainers[i].addEventListener('click', UI.closeForm);
        }

        //load all events with details
        UI.loadUserEvents();
        UI.clearFields();
    }


    static loadUserEvents() {
        let events = Store.getUserEvents();
        events.forEach((event) => UI.addEvent(event));
    }

    static addEvent(eventDetails) {
        const eventsList = document.querySelector('.events-list');

        //creating the div block of card to display on the events-list container
        const addEventCard = document.createElement('div');
        addEventCard.classList.add('card', 'text-white', 'bg-dark', 'm-3');
        addEventCard.style.maxWidth = '20rem';
        addEventCard.innerHTML = `
            <div class= "card-body">
                <h4 class= "card-title p-10">${eventDetails.eventName}</h4>
                <button type="button" class="btn btn-primary btn-sm delete-event">X</button>
            </div>
        `;

        //adding the block to events list
        eventsList.appendChild(addEventCard);

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
        const header = document.querySelector('.header');
        container.insertBefore(div, header);

        // Vanish in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 800);
    }

    static clearFields() {
        document.querySelector('#event-name').value = '';
        document.querySelector('#date').value = 'DATE';
        document.querySelector('#month').value = 'MONTH';
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
const currentTime = new Date();
let year = currentTime.getFullYear();

UI.loadAppElements(date, month, nonFormContainers, year);



//add new event 
const submitCustomEvent = document.querySelector('.submit-custom-event');
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
const closeButton = document.querySelectorAll('.delete-event');
closeButton.forEach((currentClose) => {
    currentClose.addEventListener('click', (e) => {
        UI.deleteEvent(e.target.parentElement.parentElement);
        Store.deleteEvent(e.target.previousElementSibling.textContent);
        UI.showAlert('Event Successfully Removed', 'success');
    });
});