const axios = require('axios')
const link = 'https://arugaz.herokuapp.com'

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

const fb = async (url) => new Promise((resolve, reject) => {
	axios.get(`${link}/api/fb?url=${url}`)
	.then((res) => {
		if (res.data.error) resolve({status: 'error', link: res.data.result})
		resolve({linkhd: res.data.result.hd, linksd: res.data.result.sd})
	})
	.catch((err) =>{
        reject(err)
    })
})

const ytmp3 = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}/api/yta?url=${url}`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})

const ytmp4 = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}/api/ytv?url=${url}`)
    .then((res) => {
        resolve(`${res.data.result}`)
    })
    .catch((err) =>{
        reject(err)
    })
})

const stalkig = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}/api/stalk?username=${url}`)
    .then((res) => {
        const text = `user: ${res.data.Username}\nname: ${res.data.Name}\nbio: ${res.data.Biodata}\nfollower: ${res.data.Jumlah_Followers}\nfollowing: ${res.data.Jumlah_Following}\npost: ${res.data.Jumlah_Post}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const stalkigpict = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}/api/stalk?username=${url}`)
    .then((res) => {
        resolve(res.data.Profile_pic)
    })
    .catch((err) =>{
        reject(err)
    })
})

const quote = async () => new Promise((resolve, reject) => {
    axios.get(`${link}/api/randomquotes`)
    .then((res) => {
        const text = `Author: ${res.data.author}\n\nQuote: ${res.data.quotes}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const daerah = async () => new Promise((resolve, reject) => {
    axios.get(`${link}/daerah`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})

const jadwaldaerah = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}/api/jadwalshalat?daerah=${url}`)
    .then((res) => {
        const text = `Jadwal Sholat ${url}\n\nsubuh: ${res.data.Subuh}\ndzuhur: ${res.data.Dzuhur}\nashar: ${res.data.Ashar}\nmaghrib: ${res.data.Maghrib}\nisya: ${res.data.Isya}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const cuaca = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}/api/cuaca?q=${url}`)
    .then((res) => {
        const text = `Cuaca di: ${res.data.result.tempat}\n\ncuaca: ${res.data.result.cuaca}\nangin: ${res.data.result.anign}\ndesk: ${res.data.result.desk}\nlembab: ${res.data.result.kelembapan}\nsuhu: ${res.data.result.suhu}\nudara: ${res.data.result.udara}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const chord = async (url) => new Promise((resolve, reject) => {
    axios.get(`${link}/api/chord?q=${url}`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})

const tulis = async (teks) => new Promise((resolve, reject) => {
    axios.get(`${link}/api/nulis?text=${encodeURIComponent(teks)}`)
    .then((res) => {
        resolve(`${res.data.result}`)
    })
    .catch((err) => {
        reject(err)
    })
})
const cersex = async () => new Promise((resolve, reject) => {
	const ransex = Math.floor(Math.random() * 2) + 1
	axios.get(`${link}/api/cersex${ransex}`)
	.then((res) => {
		resolve(res.data)
	})
	.catch((err) => {
		reject(err)
	})
})
module.exports = {
    insta,
    tiktok,
    fb,
    tweet,
    ytmp3,
    ytmp4,
    stalkig,
    stalkigpict,
    quote,
    daerah,
    jadwaldaerah,
    cuaca,
    chord,
    tulis,
    cersex
}
