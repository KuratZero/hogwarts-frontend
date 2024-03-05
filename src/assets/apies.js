export function jwtHeader(jwt) {
    return {'Authorization': 'Bearer ' + jwt}
}

export function errorEvent(event) {
    return event + '-error'
}

export function betweenEvent(event) {
    return event + '-between'
}

export function notBlank(names, ...texts) {
    for (let i = 0; i < names.length; i++) {
        if (!texts[i] || texts[i].toString() === "") {
            return names[i] + " is empty"
        }
    }
    return null
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
    "writeComment": "on-write-comment",
}

export const articlesHandlers = {
    "getArticles": "/api/1/posts/",
    "writeArticle": "/api/1/post/",
    "writeComment": "/api/1/post/",
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

