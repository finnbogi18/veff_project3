class bookingMgr {
    constructor(myJson, nextbookingid) {
        this.id = nextbookingid
        this.firstName = myJson.firstName
        this.lastName = myJson.lastName
        this.spots = myJson.spots
        this.email = myJson.email
        this.tel = myJson.tel
    }
}

module.exports = bookingMgr