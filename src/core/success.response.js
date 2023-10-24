const StatusCode = {
  OK: 200,
  CREATED: 201,
}

const ReasonStatusCode = {
  CREATED: 'Created!',
  OK: 'Success',
}

const { StatusCodes } = require('./httpStatusCode')

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.metadata = metadata
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor(message, metadata) {
    super({ message, metadata })
  }
}

class CREATED extends SuccessResponse {
  constructor(
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
    options = {}
  ) {
    super({ message, statusCode, reasonStatusCode, metadata })
    this.options = options
  }
}

class SuccessResponseCookie extends SuccessResponse {
  constructor(message, statusCode, reasonStatusCode, metadata) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }
  send(res, headers = {}) {
    res.cookie('accessToken', this.message.metadata.tokens.accessToken, {
      sameSite: 'Strict',
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

    res.cookie('refreshToken', this.message.metadata.tokens.refreshToken, {
      sameSite: 'Strict',
      secure: true,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    return res.status(this.status).json(this)
  }
}

class SuccessResponseClearCookie extends SuccessResponse {
  constructor(message, statusCode, reasonStatusCode, metadata) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }
  send(res, headers = {}) {
    res.cookie('accessToken', '', {
      sameSite: 'Strict',
      secure: true,
      httpOnly: true,
    })

    res.cookie('refreshToken', '', {
      sameSite: 'Strict',
      secure: true,
      httpOnly: true,
    })
    return res.status(this.status).json(this)
  }
}
module.exports = {
  OK,
  CREATED,
  SuccessResponse,
  SuccessResponseCookie,
  SuccessResponseClearCookie,
}
