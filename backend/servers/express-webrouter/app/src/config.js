// DEV is for localhost with dev tools (watchers, hot server...)
// SANDBOX is for locahost with build and prod server
// STG (staging) is for heroku with prod condition but not the production platform
// PLATFORM heroku with no breaks allowed on it

export const IS_NODE = process && !process.browser
export const IS_WEB = !IS_NODE && typeof document !== 'undefined'
export const IS_SANDBOX = process.env.NODE_ENV === 'sandbox'
export const IS_DEV = IS_NODE ? (!IS_SANDBOX && process.env.NODE_ENV !== 'production') : /^(local|0\.0|192\.)/.test(window.location.hostname)
export const IS_PROD = IS_NODE ? (!IS_SANDBOX && process.env.NODE_ENV === 'production') : !IS_DEV
export const IS_LOCALHOST = IS_DEV || IS_SANDBOX
