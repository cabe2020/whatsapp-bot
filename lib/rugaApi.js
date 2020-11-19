const axios = require('axios')


const insta = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}/api/ig?url=${url}`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) => {
        reject(err)
    })
})
/* eslint-disable prefer-promise-reject-errors */
const { getVideoMeta } = require('tiktok-scraper')
const { fetchJson } = require('../utils/fetcher')
const { promisify } = require('util')
const { instagram, twitter } = require('video-url-link')

const igGetInfo = promisify(instagram.getInfo)
const twtGetInfo = promisify(twitter.getInfo)

/**
 * Get Tiktok Metadata
 *
 * @param  {String} url
 */
const tiktok = (url) => new Promise((resolve, reject) => {
    console.log('Get metadata from =>', url)
    getVideoMeta(url, { noWaterMark: true, hdVideo: true })
        .then(async (result) => {
            console.log('Get Video From', '@' + result.authorMeta.name, 'ID:', result.id)
            if (result.videoUrlNoWaterMark) {
                result.url = result.videoUrlNoWaterMark
                result.NoWaterMark = true
            } else {
                result.url = result.videoUrl
                result.NoWaterMark = false
            }
            resolve(result)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})

/**
 * Get Twitter Metadata
 *
 * @param  {String} url
 */
const tweet = (url) => new Promise((resolve, reject) => {
    console.log('Get metadata from =>', url)
    twtGetInfo(url, {})
        .then((content) => resolve(content))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

/**
 * Get Facebook Metadata
 *
 * @param  {String} url
 */
const facebook = (url) => new Promise((resolve, reject) => {
    console.log('Get metadata from =>', url)
    const apikey = 'sxoG2J4ueHdok5Ax9ZJkARprPmSMFKepILq6EIZTSY2Z9C6mVl'
    fetchJson('http://keepsaveit.com/api/?api_key=' + apikey + '&url=' + url, { method: 'GET' })
        .then((result) => {
            const key = result.code
            switch (key) {
            case 212:
                return reject('Access block for you, You have reached maximum 5 limit per minute hits, please stop extra hits.')
            case 101:
                return reject('API Key error : Your access key is wrong')
            case 102:
                return reject('Your Account is not activated.')
            case 103:
                return reject('Your account is suspend for some resons.')
            case 104:
                return reject('API Key error : You have not set your api_key in parameters.')
            case 111:
                return reject('Full access is not allow with DEMO API key.')
            case 112:
                return reject('Sorry, Something wrong, or an invalid link. Please try again or check your url.')
            case 113:
                return reject('Sorry this website is not supported.')
            case 404:
                return reject('The link you followed may be broken, or the page may have been removed.')
            case 405:
                return reject('You can\'t download media in private profile. Looks like the video you want to download is private and it is not accessible from our server.')
            default:
                return resolve(result)
            }
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})

const ytmp3 = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/api/yta?url=${url}`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})

const ytmp4 = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/api/ytv?url=${url}`)
    .then((res) => {
        resolve(`${res.data.result}`)
    })
    .catch((err) =>{
        reject(err)
    })
})

const stalkig = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/api/stalk?username=${url}`)
    .then((res) => {
        const text = `user: ${res.data.Username}\nname: ${res.data.Name}\nbio: ${res.data.Biodata}\nfollower: ${res.data.Jumlah_Followers}\nfollowing: ${res.data.Jumlah_Following}\npost: ${res.data.Jumlah_Post}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const stalkigpict = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/api/stalk?username=${url}`)
    .then((res) => {
        resolve(res.data.Profile_pic)
    })
    .catch((err) =>{
        reject(err)
    })
})

const quote = async () => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/api/randomquotes`)
    .then((res) => {
        const text = `Author: ${res.data.author}\n\nQuote: ${res.data.quotes}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const wiki = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}http://es.wikipedia.org/w/api.php?format=json&action=query${url}`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})

const daerah = async () => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/daerah`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})

const jadwaldaerah = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/api/jadwalshalat?daerah=${url}`)
    .then((res) => {
        const text = `Jadwal Sholat ${url}\n\nsubuh: ${res.data.Subuh}\ndzuhur: ${res.data.Dzuhur}\nashar: ${res.data.Ashar}\nmaghrib: ${res.data.Maghrib}\nisya: ${res.data.Isya}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const cuaca = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/api/cuaca?q=${url}`)
    .then((res) => {
        const text = `Cuaca di: ${res.data.result.tempat}\n\ncuaca: ${res.data.result.cuaca}\nangin: ${res.data.result.anign}\ndesk: ${res.data.result.desk}\nlembab: ${res.data.result.kelembapan}\nsuhu: ${res.data.result.suhu}\nudara: ${res.data.result.udara}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const chord = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/api/chord?q=${url}`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})
const tulis = async (teks) => new Promise((resolve, reject) => {
    axios.get(`${link}https://arugaz.herokuapp.com/api/nulis?text=${encodeURIComponent(teks)}`)
    .then((res) => {
        resolve(`${res.data.result}`)
    })
    .catch((err) => {
        reject(err)
    })
})
const randomNimek = async (type) => {
    var url = 'https://api.computerfreaker.cf/v1/'
    switch(type) {
        case 'nsfw':
            const nsfw = await fetch(url + 'nsfwneko')
            if (!nsfw.ok) throw new Error(`unexpected response ${nsfw.statusText}`)
            const resultNsfw = await nsfw.json()
            return resultNsfw.url
            break
        case 'hentai':
            const hentai = await fetch(url + 'hentai')
            if (!hentai.ok) throw new Error(`unexpected response ${hentai.statusText}`)
            const resultHentai = await hentai.json()
            return resultHentai.url
            break
        case 'anime':
            let anime = await fetch(url + 'anime')
            if (!anime.ok) throw new Error(`unexpected response ${anime.statusText}`)
            const resultNime = await anime.json()
            return resultNime.url
            break
        case 'neko':
            let neko = await fetch(url + 'neko')
            if (!neko.ok) throw new Error(`unexpected response ${neko.statusText}`)
            const resultNeko = await neko.json()
            return resultNeko.url
            break
        case 'trap':
            let trap = await fetch(url + 'trap')
            if (!trap.ok) throw new Error(`unexpected response ${trap.statusText}`)
            const resultTrap = await trap.json()
            return resultTrap.url
            break
    }
}
module.exports = {
    insta,
    tiktok,
    facebook,
    tweet,
    ytmp3,
    ytmp4,
    stalkig,
    stalkigpict,
    quote,
    wiki,
    daerah,
    jadwaldaerah,
    cuaca,
    chord,
    tulis,
    randomNimek
}
