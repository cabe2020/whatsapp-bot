/**
 * @author cabe2020 <elmorochito02@gmail.com>                                                                                                                                                                            <https://github.com/cabe2020/whatsapp-Cabebot>
 * @license MIT
 */

"use strict"
const axios = require('axios')
const cheerio = require('cheerio')

function getLatest() {
    return new Promise(function (resolve, reject) {                                                                                                                                                               //<https://github.com/cabe2020/whatsapp-Cabebot>
            const url = 'http://nekopoi.care'
            axios.get(url)
                .then(req => {
                    const title = []
                    const link = []
                    const image = []
                    const data = {}
                    const soup = cheerio.load(req.data)
                    soup('div.eropost').each(function (i, e) {
                        soup(e).find('h2').each(function (j, s) {
                            title.push(url + soup(s).find('a').text().trim())
                            link.push(url + soup(s).find('a').attr('href'))
                        })
                        image.push(url + soup(e).find('img').attr('src'))
                    })
                    if (data == undefined) {
                        reject('No Result:(')
                    } else {
                        let i = Math.floor(Math.random() * title.length)
                        let hehe = {
                            "title": title[i],
                            "image": image[i],
                            "link": link[i]
                        }
                        resolve(hehe)
                    }
                })
        })
}

/**
 * @author cabe2020 <elmorochito02@gmail.com>                                                                                                                                                                            <https://github.com/cabe2020/whatsapp-Cabebot>
 * @license MIT
 */

function getVideo(url) {
    return new Promise(function (resolve, reject) {                                                                                                                                                               //<https://github.com/cabe2020/whatsapp-Cabebot>
            axios.get(url)
                .then(req => {
                    try {
                        const links = []
                        let soup = cheerio.load(req.data)
                        let title = soup("title").text()
                        soup('div.liner').each(function (i, e) {
                            soup(e).find('div.listlink').each(function (j, s) {
                                soup(s).find('a').each(function (p, q) {
                                    links.push(soup(q).attr('href'))
                                })
                            })
                        })
                        const data = {
                            "title": title,
                            "links": links
                        }
                        resolve(data)
                    } catch (err) {
                        reject('Error : ' + err)
                    }
                })
        })
}

module.exports = {
    getLatest,
    getVideo
}
