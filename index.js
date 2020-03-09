const Event = require('./events.js')
const bookingMgr = require('./bookings.js')
const express = require('express')
const app = express();
const port = 3000
const bodyparser = require('body-parser')

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

app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});

app.get('/api/v1/events', function (req, res) {
    var tempEvents = JSON.parse(JSON.stringify(events));
    for (i = 0; i < tempEvents.length; i++) {
        delete tempEvents[i].bookings
    }
    res.status(200).json(tempEvents)
  });

app.get('/api/v1/events/:id', function (req, res) {
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == req.params.id) {
            res.status(200).json(events[i]);
            return;
        };
    };

res.status(404).json({'message':"Event with id " + req.params.id + " does not exists."})
})

app.post('/api/v1/events', (req, res) => {
    var start_date = new Date(req.body.startDate * 1000)
    var end_date = new Date(req.body.endDate * 1000)
    if (req.body === undefined || req.body.name === undefined || req.body.capacity < 0 || req.body.startDate >= req.body.endDate) {
        res.status(400).json({'message': 'invalid event?'})
    }
    let Event = {id: nextEventId, name: req.body.name, description: req.body.description, location: req.body.location, startDate: start_date, endDate: end_date, capacity: req.body.capacity};
    nextEventId++;
    events.push(Event)
    res.status(201).json(Event)
});
