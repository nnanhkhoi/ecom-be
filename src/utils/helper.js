function getCookieValue(cookieString, cookieName) {
  const name = cookieName + '='
  const decodedCookie = decodeURIComponent(cookieString)
  const cookieArray = decodedCookie.split(';')

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim()

    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }

  return ''
}

module.exports = { getCookieValue }
