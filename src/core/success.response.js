'use strict'

const StatusCode = {
    OK: 200,
    CREATE : 201
}
const ResponseStatusCode = {
    OK: 'Success',
    CREATE: "Created"
}

class SuccessResponse {
    constructor (message , status= StatusCode.OK, responseStatusCode= ResponseStatusCode.OK, metadata = {}){
        this.message = !message? responseStatusCode : message;
        this.status = status
        this.metadata = metadata
    }
    send(res, headers= {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor(message, metadata) {
        super(message, metadata);
    }
}

class CREATE extends SuccessResponse {
    constructor(message, status= StatusCode.CREATE, responseStatusCode = ResponseStatusCode.CREATE, metadata, option) {
        super(message, status, responseStatusCode, metadata, option);
    }
}

module.exports = {OK, CREATE}