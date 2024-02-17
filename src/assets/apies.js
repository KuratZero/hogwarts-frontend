export function jwtHeader(jwt) {
    return {'Authorization': 'Bearer ' + jwt}
}

export function errorEvent(event) {
    return event + '-error'
}

export const notifyOptions = {
    theme: "bubble",
    position: "bottom-right",
    duration: 2500
}

export const notify = {
    "event": "on-notify",
    "message": "message",
    "success": "success",
    "error": "error"
}

export const events = {
    "auth": "on-jwt",
    "login": "on-login",
    "logout": "on-logout",
    "register": "on-register",
    "updateInfo": "on-update",
    "writeArticle": "on-write-article",
    "updateArticles": "on-update-articles",
    "getImage": "on-get-image",
}

export const articlesHandlers = {
    "getArticles": "/api/1/posts/",
    "writeArticle": "/api/1/post/",
    "deleteArticle": "/api/1/post/",
}

export const usersHandlers = {
    "get": "/api/1/user",
    "auth": "/api/1/user/auth/",
    "login": "/api/1/jwt/",
    "register": "/api/1/user/register/",
    "avatar": "/api/1/images/avatars/user",
    "updateInfo": "/api/1/user/"
}

