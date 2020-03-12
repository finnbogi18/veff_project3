class eventManager {
    constructor(myJson, nextEventID) {
        this.id = nextEventID
        this.name = myJson.name
        this.description = myJson.description
        this.location = myJson.location
        this.capacity = myJson.capacity
        this.startDate = new Date(myJson.startDate * 1000)
        this.endDate = new Date(myJson.endDate * 1000)
        this.bookings = []
    }


}

module.exports = eventManager