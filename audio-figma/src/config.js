const LOCAL_STORE_URL = 'http://localhost:4400'
const REMOTE_STORE_URL = 'https://soundgrape.com'
//const api_url = 'https://soundgrape.com/api'
const api_url = 'http://127.0.0.1:9000/api'

const storeUrl = (process.env.NODE_ENV === 'production') ? REMOTE_STORE_URL : LOCAL_STORE_URL
export const typingTimeout = 0 // After this delay the search api will be fired
const HOST = 'https://soundgrape.com'
const currency = { symbol: '₹', code: 'INR' }
const tokenExpiry = 60 * 60 * 24 * 365 // Login validity in seconds
const ANALYTICS_TRACKING_ID = 'UA-49421899-5'
const sorts = [
    { name: "Relevance", val: null },
    { name: "Whats New", val: "-createdAt" },
    { name: "Price low to high", val: "localPrice" },
    { name: "Price high to low", val: "-localPrice" }
]
export { sorts, HOST, currency, tokenExpiry, api_url, storeUrl, ANALYTICS_TRACKING_ID }


// LIVE IS HERE
// const LOCAL_STORE_URL = 'http://localhost:4400'
// const REMOTE_STORE_URL = 'https://soundgrape.com'
// const api_url = 'https://soundgrape.com/api'
// const storeUrl = (process.env.NODE_ENV === 'production') ? REMOTE_STORE_URL : LOCAL_STORE_URL
// export const typingTimeout = 0 // After this delay the search api will be fired
// const HOST = 'https://soundgrape.com'
// const currency = { symbol: '₹', code: 'INR' }
// const tokenExpiry = 60 * 60 * 24 * 365 // Login validity in seconds
// const ANALYTICS_TRACKING_ID = 'UA-49421899-5'
// const sorts = [
//     { name: "Relevance", val: null },
//     { name: "Whats New", val: "-createdAt" },
//     { name: "Price low to high", val: "localPrice" },
//     { name: "Price high to low", val: "-localPrice" }
// ]
// export { sorts, HOST, currency, tokenExpiry, api_url, storeUrl, ANALYTICS_TRACKING_ID }
