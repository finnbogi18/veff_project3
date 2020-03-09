class eventManager {
    constructor(myJson) {
        this.id = myJson.id
        this.name = myJson.name
        this.description = myJson.description
        this.location = myJson.location
        this.capacity = myJson.capacity
        this.startDate = myJson.startDate
        this.endDate = myJson.endDate
        this.bookings = []
    }

}

module.exports = eventManager