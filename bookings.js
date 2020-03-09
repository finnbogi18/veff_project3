class bookingMgr {
    constructor(myJson) {
        this.id = myJson.id
        this.firstName = myJson.firstName
        this.lastName = myJson.lastName
        this.spots = myJson.spots
        this.email = myJson.email
        this.tel = myJson.tel
    }
}

module.exports = bookingMgr