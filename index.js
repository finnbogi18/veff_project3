const Event = require('./events.js')
const Booking = require('./bookings.js')
const bodyparser = require('body-parser')
const express = require('express')
const app = express();
const port = 3000

app.use(bodyparser.json())

//Sample data for Assignment 3
let nextEventId = 2
let nextBookingID = 3

//The following is an example of an array of two events. 
var events = [
    { id: 0, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate : new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [0,1,2] },
    { id: 1, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [] }
];

//The following is an example of an array of three bookings.
var bookings = [
    { id: 0, firstName: "John", lastName: "Doe", tel: "+3541234567", email: "", spots: 3},
    { id: 1, firstName: "Jane", lastName: "Doe", tel: "", email: "jane@doe.doe", spots: 1},
    { id: 2, firstName: "Meðaljón", lastName: "Jónsson", tel: "+3541111111", email: "mj@test.is", spots: 5}
];

app.get('/api/v1/event', function (req, res) {
    let tempEvents = JSON.parse(JSON.stringify(events));
    for (i = 0; i < tempEvents.length; i++) {
        delete tempEvents[i].bookings
        delete tempEvents[i].location
        delete tempEvents[i].description
    }
    res.status(200).json(tempEvents)
  });

app.get('/api/v1/event/:id', function (req, res) {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.id) {
            res.status(200).json(events[i]);
            return;
        };
    };

    res.status(404).json({'message':"Event with id " + req.params.id + " does not exists."})
});

app.post('/api/v1/event', (req, res) => {
    if (req.body === undefined || req.body.name === undefined || req.body.capacity < 0 || req.body.startDate >= req.body.endDate) {
        res.status(400).json({'message': 'invalid event?'})
        return;
    }
    let newEvent = new Event(req.body, nextEventId)
    nextEventId++;
    events.push(newEvent)
    res.status(201).json(newEvent)
});

app.put('/api/v1/event/:id', (req, res) => {
    console.log("hallo")
    for (let i = 0; i < events.length; i++) {
        console.log(req.params.id)
        if (events[i].id == req.params.id) {
            if (events[i].bookings.length == 0) {
                let tempEvent = new Event(req.body, events[i].id)
                events[i] = tempEvent
                res.status(200).json(tempEvent)
                return;
            }
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.id + " does not exists or already has bookings."});
});

app.delete('/api/v1/event/:id', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if ((events[i].id == req.params.id) && (events[i].bookings.length < 1)) {
            res.status(200).json(events[i])
            events.pop(i)
            return;
        }
    }
    res.status(404).json({'message':"Event with id "+ req.params.id + " does not exist or already has bookings."})
});

app.delete('/api/v1/event', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        let tempBookings = []
        for (let j = 0; j < events[i].bookings.length; j++) {
            for (let h = 0; h < bookings.length; h++) {
                if (events[i].bookings[j] == bookings[h].id) {
                    tempBookings.push(bookings[h])
                }

            }
        }
        events[i].bookings = tempBookings
    }
    res.status(200).json(events)
    events = []
    bookings = []
});

app.get('/api/v1/event/:id/booking', (req, res) => {
    let found = false
    let tempBookings = []
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.id) {
            found = true
            for (let j = 0; j < events[i].bookings.length; j++) {
                for (let h = 0; h < bookings.length; h++) {
                    if (events[i].bookings[j] == bookings[h].id) {
                        tempBookings.push(bookings[h])
                        hasBooking = true
                    }
                }
            }
        
        }
    }
    if (found === false) {
        res.status(404).json({'message':'Event with the id ' + req.params.id + ' does not exists.'})
        return;
    }
    res.status(200).json(tempBookings)
});
    

app.get('/api/v1/event/:eventId/booking/:bookingId', (req, res) => {
    console.log(req.params)
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            for (let j= 0; j < bookings.length; j++) {
                if (bookings[j].id == req.params.bookingId) {
                    res.status(200).json(bookings[j])
                    return;
                }
            }
        }

    }
    res.status(404).json({'message':'Event with an id ' + req.params.eventId + ' or booking with id ' + req.params.bookingId + ' was not found.'})
});

app.post('/api/v1/event/:eventId/booking', (req, res) => {
    if (req.body.firstName == undefined || req.body.lastName == undefined || req.body.spots == undefined || req.body.spots < 1) {
        res.status(400).json({'message':'Bad request, requires firstName, lastName, spots, tel/email.'})
        return;
    }
    if (req.body.tel == undefined && req.body.email == undefined) {
        res.status(400).json({'message':'Bad request, requires firstName, lastName, spots, tel/email.'})
        return;
    }
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            if (events[i].spots == 0) {
                res.status(400).json({'message':'the event with the id ' + req.params.eventId + ' is fully booked.'})
            } else {
                let tempBooking = new Booking(req.body, nextBookingID)
                console.log(tempBooking)
                events[i].bookings.push(nextBookingID)
                nextBookingID++
                bookings.push(tempBooking)
                res.status(201).json(tempBooking)
                events[i].capacity = events[i].capacity - req.body.spots
            }
        }
    }
});

app.delete('/api/v1/event/:eventId/booking/:bookingId', (req, res) => {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            for (let j = 0; j < events[i].bookings.length; j++) {
                console.log(events[i].bookings[j] == req.params.bookingId)
                if (events[i].bookings[j] == req.params.bookingId) {
                    console.log('fann booking')
                    for (let h = 0; h < bookings.length; h++) {
                        console.log(bookings)
                        console.log('bookings[h] == req.params.bookingId', bookings[h].id, req.params.bookingId)
                        if (bookings[h].id == req.params.bookingId) {
                            console.log('virkar?')
                            res.status(200).json(bookings[h])
                            bookings.splice(h, 1)
                            events[i].bookings.splice(j, 1)
                            return;
                        }
                    }
                }
            }
        } 
    };

    res.status(400).json({'message':'The event with the id ' + req.params.eventId + ' does not exists or the booking with id ' + req.params.bookingId + ' is not associated with the Event Id.'})
})

app.delete('/api/v1/event/:eventId/booking', (req, res) => {
    let deletedArr = []
    let found = false
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.eventId) {
            found = true
            var index = i
            for (let j = 0; j < events[i].bookings.length; j++) {
                for (var h = bookings.length - 1; h >= 0; h--) {
                    if (bookings[h].id == events[i].bookings[j]) {
                        deletedArr.push(bookings[h])
                        bookings.splice(h, 1)
                    }
                }
            }
        }
    } 
    if (found == true) {
        res.status(200).json(deletedArr)
        events[index].bookings = []

    } else {
        res.status(404).json({'message':'The event with the id ' + req.params.eventId + ' does not exist.'})
    }
})

app.use('*', (req, res) => {
    console.log(req.params)
    res.status(405).send('Operation not supported.')
});

app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});
