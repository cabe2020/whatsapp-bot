require('dotenv').config()
const { create, decryptMedia, Client } = require('@open-wa/wa-automate')

const moment = require('moment-timezone')
moment.tz.setDefault('America/Argentina/Buenos_Aires').locale('id')
const figlet = require('figlet')
const fs = require('fs-extra')
const axios = require('axios')
const fetch = require('node-fetch')

const banned = JSON.parse(fs.readFileSync('./settings/banned.json'))
const nsfw_ = JSON.parse(fs.readFileSync('./lib/NSFW.json'))
const simi = JSON.parse(fs.readFileSync('./settings/simi.json'))

const { 
    removeBackgroundFromImageBase64
} = require('remove.bg')

const {
    exec
} = require('child_process')

const { 
    menuId, 
    cekResi, 
    urlShortener, 
    meme, 
    translate, 
    getLocationData,
    images,
    resep,
    rugapoi,
    rugaapi
} = require('./lib')

const { 
    msgFilter, 
    color, 
    processTime, 
    isUrl 
} = require('./utils')

const options = require('./utils/options')
const { uploadImages } = require('./utils/fetcher')

const { 
    ownerNumber, 
    groupLimit, 
    memberLimit,
    prefix
} = JSON.parse(fs.readFileSync('./settings/setting.json'))

const {
    apiNoBg,
    apiSimi
} = JSON.parse(fs.readFileSync('./settings/api.json'))

const start = (cabe = new Client()) => {
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('CABEBOT', { font: 'Ghost', horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color('[DEV]'), color('CABE', 'yellow'))
    console.log(color('[~>>]'), color('BOT iniciado!', 'green'))

    // cuando el bot es invitado al grupo
    cabe.onStateChanged((state) => {
        console.log(color('[~>>]', 'red'), state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') cabe.forceRefocus()
    })

    // // cuando el bot es invitado al grupo
    cabe.onAddedToGroup(async (chat) => {
	const groups = await cabe.getAllGroups()
    // kodisi ketika batas group bot telah tercapat, ubah di file settings/setting.json
	if (groups.length > groupLimit) {
	await cabe.sendText(chat.id, `Lo sentimos, el grupo de este bot está completo\nEl grupo máximo es: ${groupLimit}`).then(() => {
	      cabe.leaveGroup(chat.id)
	      cabe.deleteChat(chat.id)
	  }) 
	} else {
	// kondisi ketika batas member group belum tercapai, ubah di file settings/setting.json
	    if (chat.groupMetadata.participants.length < memberLimit) {
	    await cabe.sendText(chat.id, `Lo siento, CABE-BOT se sale si los miembros del grupo no exceden ${memberLimit} personas`).then(() => {
	      cabe.leaveGroup(chat.id)
	      cabe.deleteChat(chat.id)
	    })
	    } else {
        await cabe.simulateTyping(chat.id, true).then(async () => {
          await cabe.sendText(chat.id, `Hola, soy CABE BOT. Un bot que les facilitara la vida, para ver los comandos de este bot escribe un mensaje con la palabra ${prefix}menu\nY para que sepas mas de mi te dejo mi IG: https://www.instagram.com/cabe.gus/`)
        })
	    }
	}
    })

   // ketika seseorang masuk/keluar dari group
   cabe.onGlobalParicipantsChanged(async (event) => {
    const host = await cabe.getHostNumber() + '@c.us'
    // kondisi ketika seseorang diinvite/join group lewat link
    if (event.action === 'add' || event.action == 'invite') { await cabe.sendTextWithMentions(event.chat, `Hola bienvenid@ al grupo @${event.who.replace('@c.us', '')} \n\nDiviértete con nosotros✨`)
    }
    // kondisi ketika seseorang dikick/keluar dari group
    if (event.action === 'remove' || event.action == 'leave') { await cabe.sendTextWithMentions(event.chat, `Adiós @${event.who.replace('@c.us', '')}, Te echaremos de menos✨`)
    }
})
cabe.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await cabe.sendText(callData.peerJid, 'Lo siento, no puedo recibir llamadas de\n\nnadie soy un bot')
        .then(async () => {
            // bot akan memblock nomor itu
            await cabe.contactBlock(callData.peerJid)
        })
    })

    // ketika seseorang mengirim pesan
    cabe.onMessage(async (message) => {
        cabe.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
            .then((msg) => {
                if (msg >= 3000) {
                    console.log('[cabe]', color(`Alcance de mensaje cargado ${msg}, cortando la caché de mensajes...`, 'yellow'))
                    cabe.cutMsgCache()
                }
            })
	//Message
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        var { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await cabe.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await cabe.getGroupAdmins(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isOwnerBot = ownerNumber == sender.id
        
        const isBanned = banned.includes(sender.id)

        // Bot Prefix
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const uaOverride = process.env.UserAgent
        const url = args.length !== 0 ? args[0] : ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        
        // [IDENTIFICAR]
        const isSimi = simi.includes(chat.id)
        
        // [BETA] Avoid Spam Message
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'para', color(pushname)) }
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'para', color(pushname), 'en', color(name || formattedTitle)) }
        //
        if (!isCmd) { return }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'para', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'para', color(pushname), 'en', color(name || formattedTitle)) }

        // [BETA] Avoid Spam Message
        msgFilter.addFilter(from)

        if (isBanned) {
            return console.log(color('[BAN]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'para', color(pushname))
        }
        switch (command) {
        // Menu and TnC
        case 'velocidad':
        case 'ping':
            await cabe.sendText(from, `Pong!!!!\nvelocidad: ${processTime(t, moment())} _Segundos_`)
            break
        case 'tnc':
            await cabe.sendText(from, menuId.textTnC())
            break
        case 'menu':
        case 'help':
            await cabe.sendText(from, menuId.textMenu(pushname))
            .then(() => ((isGroupMsg) && (isGroupAdmins)) ? cabe.sendText(from, `Menú de admins del grupo: *${prefix}menuadmin*`) : null)
            break
        case 'menuadmin':
            if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id)
            if (!isGroupAdmins) return cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id)
            await cabe.sendText(from, menuId.textAdmin())
            break
            
        case 'donar':
        case 'donar':
            await cabe.sendText(from, menuId.textDonasi())
            break
        case 'propietario del bot':
            await cabe.sendContact(from, ownerNumber) 
            .then(() => cabe.sedText(from, 'Si desea donar lo puede hacer por PayPal https://www.paypal.com/paypalme/cabegus?locale.x=es_XC!'))
            break
            case 'join':
                if (args.length == 0) return cabe.reply(from, `Si desea invitar al bot al grupo, invítelo o escriba ${prefix}join [link del grupo]`, id)
                let linkgrup = body.slice(6)
                let islink = linkgrup.match(/(https:\/\/chat.whatsapp.com)/gi)
                let chekgrup = await cabe.inviteInfo(linkgrup)
                if (!islink) return cabe.reply(from, 'Lo siento, el enlace del grupo es incorrecto, enviar el enlace correcto', id)
                if (isOwnerBot) {
                    await cabe.joinGroupViaLink(linkgrup)
                          .then(async () => {
                              await cabe.sendText(from, 'Se unió al grupo con éxito a través del enlace!')
                              await cabe.sendText(chekgrup.id, `Hola, soy CABE-BOT. Para averiguar los comandos de este tipo de bot escriba${prefix}menu`)
                          })
                } else {
                    let cgrup = await cabe.getAllGroups()
                    if (cgrup.length > groupLimit) return cabe.reply(from, `Lo siento, el grupo de este bot está completo\nEl grupo máximo es: ${groupLimit}`, id)
                    if (cgrup.size < memberLimit) return cabe.reply(from, `Lo siento, CABE-BOT no se unirá si los miembros del grupo no superan las${memberLimit} personas`, id)
                    await cabe.joinGroupViaLink(linkgrup)
                          .then(async () =>{
                              await cabe.reply(from, 'Se unió al grupo con éxito a través del enlace!', id)
                          })
                          .catch(() => {
                              cabe.reply(from, 'Ha fallado!', id)
                          })
                }
                break

        // Sticker Creator
        case 'sticker':
        case 'stiker': {
            if ((isMedia || isQuotedImage) && args.length === 0) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                cabe.sendImageAsSticker(from, imageBase64).then(() => {
                    cabe.reply(from, 'Aqui esta tu sticker(si el sticker sale mal, intentar recortarlo he intentar de nuevo)')
                    console.log(`Sticker procesado por ${processTime(t, moment())} Segundo`)
                })
            } else if (args[0] === 'nobg') {
            if (isMedia || isQuotedImage) {
              try {
                var mediaData = await decryptMedia(message, uaOverride)
                var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                var base64img = imageBase64
                var outFile = './media/noBg.png'
		        // kamu dapat mengambil api key dari website remove.bg dan ubahnya difolder settings/api.json
                var result = await removeBackgroundFromImageBase64({ base64img, apiKey: apiNoBg, size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await cabe.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                } catch(err) {
                    console.log(err)
	   	    await cabe.reply(from, 'lo siento, el límite de uso de hoy es máximo', id)
                }
            }
            } else if (args.length === 1) {
                if (!isUrl(url)) { await cabe.reply(from, 'Lo sentimos, el enlace que envió no es válido.', id) }
                cabe.sendStickerfromUrl(from, url).then((r) => (!r && r !== undefined)
                    ? cabe.sendText(from, 'Lo sentimos, el enlace que envió no contiene una imagen.')
                    : cabe.reply(from, 'Aqui esta tu sticker')).then(() => console.log(`Sticker Procesado por ${processTime(t, moment())} Segundo`))
            } else {
                await cabe.reply(from, `¡Sin imagen! Usar ${prefix}sticker\n\n\nEnviar imágenes con subtítulos\n${prefix}sticker <usual>\n${prefix}sticker nobg <sin fondo>\n\n o enviar mensaje con\n${prefix}sticker <link>`, id)
            }
            break
        }
        case 'stickergif':
        case 'stikergif':
            {
            if (isMedia || isQuotedVideo) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    var mediaData = await decryptMedia(message, uaOverride)
                    cabe.reply(from, '[ESPERAR] En curso⏳ espere ± 1 min.', id)
                    var filename = `./media/stickergif.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/stickergf.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        var gif = await fs.readFileSync('./media/stickergf.gif', { encoding: "base64" })
                        await cabe.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
			
                    })
                  } else {
                    cabe.reply(from, `[❗] Enviar un gif con el título *${prefix}stickergif* max 10 seg!`, id)
                   }
                } else {
		    cabe.reply(from, `[❗] Enviar un gif con el titulo *${prefix}stickergif*`, id)
	        }
            break
        }
        case 'stikergiphy':
        case 'stickergiphy':
	 {
            if (args.length !== 1) return cabe.reply(from, `Lo sentimos, el formato del mensaje es incorrecto. \nescribe el mensaje con${prefix}stickergiphy <link de giphy https://giphy.com/>`, id)
            const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
            const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
            if (isGiphy) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return cabe.reply(from, 'No se pudo recuperar el código giphy', id) }
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                cabe.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    cabe.reply(from, 'Aqui esta tu sticker')
                    console.log(`Sticker Procesado por ${processTime(t, moment())} Segundo`)
                }).catch((err) => console.log(err))
            } else if (isMediaGiphy) {
                const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return cabe.reply(from, 'No se pudo recuperar el código giphy', id) }
                const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
                cabe.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    cabe.reply(from, 'Aqui esta tu sticker')
                    console.log(`Sticker Procesado ${processTime(t, moment())} Segundo`)
                }).catch((err) => console.log(err))
            } else {
                await cabe.reply(from, 'lo siento, los comandos de la etiqueta giphy solo pueden usar enlaces de giphy.  [Solo Giphy]', id)
            }
            break
        }
        case 'meme':
            if ((isMedia || isQuotedImage) && args.length >= 2) {
                const top = arg.split('|')[0]
                const bottom = arg.split('|')[1]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await meme.custom(getUrl, top, bottom)
                cabe.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then((serialized) => console.log(`Envío exitoso de archivos con ID: ${serialized} procesada durante ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            } else {
                await cabe.reply(from, `¡Sin imagen! Envíe una imagen con la descripcion. ${prefix}meme <texto superior> | <texto abajo>\nejemplo: ${prefix}meme texto superior | texto de abajo `, id)
            }
            break
        case 'quotemaker':
            const qmaker = body.trim().split('|')
            if (qmaker.length >= 3) {
                const quotes = qmaker[1]
                const author = qmaker[2]
                const theme = qmaker[3]
                cabe.reply(from, 'versos como', id)
                try {
                    const hasilqmaker = await images.quote(quotes, author, theme)
                    cabe.sendFileFromUrl(from, `${hasilqmaker}`, '', 'Este es hermano ...', id)
                } catch {
                    cabe.reply('bueno, el proceso falló, hermano, el contenido es correcto, ¿no?..', id)
                }
            } else {
                cabe.reply(from, `Usar ${prefix}quotemaker |cita de isi|autor|tema \n\n ejemplo: ${prefix}quotemaker |Te amo|CabeBot|aleatorio \n\n para el tema usar random sí hermano..`)
            }
            break
           case 'escribir':
            if (args.length == 0) return cabe.reply(from, `Haz que el bot escriba el texto que se envía como imagen\nUilizar: ${prefix}escribir [texto]\n\nEjemplo: ${prefix}escribir hola me llamo Cabebot y mi version es 1.2`, id)
            const nulisq = body.slice(7)
            const nulisp = await rugaapi.tulis(nulisq)
            await cabe.sendImage(from, `${nulisp}`, '', 'Aqui esta tu texto', id)
            .catch(() => {
                cabe.reply(from, '¡Hay un Error!', id)
            })
            break
        //Media
        case 'instagram':
            if (args.length == 0) return cabe.reply(from, `Para descargar imágenes o videos de instagram \n escriba: ${prefix}instagram [link_ig]`, id)
            const instag = await rugaapi.insta(args[0])
            await cabe.sendFileFromUrl(from, instag, '', '', id)
            break
            case 'tiktok':
                if (args.length !== 1) return cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id)
                if (!is.Url(url) && !url.includes('tiktok.com')) return cabe.reply(from, 'Lo sentimos, el enlace que envió no es válido. [Enlace no válido]', id)
                await cabe.reply(from, `_Extracción de metadatos ..._ \n\n${menuId.textDonasi()}`, id)
                downloader.tiktok(url).then(async (videoMeta) => {
                    const filename = videoMeta.authorMeta.name + '.mp4'
                    const caps = `*Metadata:*\nUsername: ${videoMeta.authorMeta.name} \nMusic: ${videoMeta.musicMeta.musicName} \nView: ${videoMeta.playCount.toLocaleString()} \nLike: ${videoMeta.diggCount.toLocaleString()} \nComment: ${videoMeta.commentCount.toLocaleString()} \nShare: ${videoMeta.shareCount.toLocaleString()} \nCaption: ${videoMeta.text.trim() ? videoMeta.text : '-'}`
                    await cabe.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : `⚠ Los videos sin marca de agua no están disponibles. \n\n${caps}`, '', { headers: { 'User-Agent': 'okhttp/4.5.0', referer: 'https://www.tiktok.com/' } }, true)
                        .then((serialized) => console.log(`SEnvío exitoso de archivos con id: ${serialized} procesado durante${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                }).catch(() => cabe.reply(from, 'No se pudieron recuperar los metadatos, el vínculo que envió no es válido. [Enlace no válido]', id))
                break
                case 'twt':
                    case 'twitter':
                        if (args.length !== 1) return cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id)
                        if (!is.Url(url) & !url.includes('twitter.com') || url.includes('t.co')) return cabe.reply(from, 'Lo sentimos, la URL que envió no es válida. [Enlace no válido]', id)
                        await cabe.reply(from, `_Scraping Metadata..._ \n\n${menuId.textDonasi()}`, id)
                        downloader.tweet(url).then(async (data) => {
                            if (data.type === 'video') {
                                const content = data.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                                const result = await urlShortener(content[0].url)
                                console.log('Shortlink: ' + result)
                                await cabe.sendFileFromUrl(from, content[0].url, 'video.mp4', `Link de descarga ${result} \n\nProcesado por ${processTime(t, moment())} _segundos`, null, null, true)
                                    .then((serialized) => console.log(`Envío exitoso de archivos con id: ${serialized} procesado durante ${processTime(t, moment())}`))
                                    .catch((err) => console.error(err))
                            } else if (data.type === 'photo') {
                                for (let i = 0; i < data.variants.length; i++) {
                                    await cabe.sendFileFromUrl(from, data.variants[i], data.variants[i].split('/media/')[1], '', null, null, true)
                                        .then((serialized) => console.log(`Envío exitoso de archivos con id: ${serialized} procesado durante ${processTime(t, moment())}`))
                                        .catch((err) => console.error(err))
                                }
                            }
                        })
                            .catch(() => cabe.sendText(from, 'Lo sentimos, el enlace no es válido o no hay medios en el enlace que envió. [Enlace no válido]'))
                        break
                    case 'fb':
                    case 'facebook':
                        if (args.length !== 1) return cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id)
                        if (!is.Url(url) && !url.includes('facebook.com')) return cabe.reply(from, 'Lo sentimos, la URL que envió no es válida. [Enlace no válido]', id)
                        await cabe.reply(from, '_Extracción de metadatos..._ \n\nGracias por usar este bot', id)
                        downloader.facebook(url).then(async (videoMeta) => {
                            const title = videoMeta.response.title
                            const thumbnail = videoMeta.response.thumbnail
                            const links = videoMeta.response.links
                            const shorts = []
                            for (let i = 0; i < links.length; i++) {
                                const shortener = await urlShortener(links[i].url)
                                console.log('Shortlink: ' + shortener)
                                links[i].short = shortener
                                shorts.push(links[i])
                            }
                            const link = shorts.map((x) => `${x.resolution} Quality: ${x.short}`)
                            const caption = `Text: ${title} \n\nLink de descarga: \n${link.join('\n')} \n\nProcesado por ${processTime(t, moment())} _Segundos_`
                            await cabe.sendFileFromUrl(from, thumbnail, 'videos.jpg', caption, null, null, true)
                                .then((serialized) => console.log(`Envío exitoso de archivos con ID:${serialized} procesado durante${processTime(t, moment())}`))
                                .catch((err) => console.error(err))
                        })
                            .catch((err) => cabe.reply(from, `Error, la URL no es válida o el video no se carga. [Enlace no válido o sin vídeo] \n\n${err}`, id))
                        break
        case 'ytmp3':
            if (args.length == 0) return cabe.reply(from, `Para descargar canciones de youtube \n escriba: ${prefix}ytmp3 [link_yt]`, id)
            const mp3 = await rugaapi.ytmp3(args[0])
            await cabe.sendFileFromUrl(from, mp3, '', '', id)
            break
        case 'ytmp4':
            if (args.length == 0) return cabe.reply(from, `Para descargar videos de youtube \n escriba: ${prefix}ytmp4 [link_yt]`)
            const mp4 = await rugaapi.ytmp4(args[0])
            await cabe.sendFileFromUrl(from, mp4, '', '', id)
            break
        case 'xnxx':
            if (!isNsfw) return cabe.reply(from, 'comando / comando NSFW no activado en este grupo!', id)
                if (isLimit(serial)) return cabe.reply(from, `Lo siento ${pushname}, Su límite de cuota se ha agotado, escriba #limit para verificar su límite de cuota`, id)
                
                await limitAdd(serial)
                if (args.length === 1) return cabe.reply(from, 'Enviar comando *#xnxx [linkXnxx]*, por ejemplo, envíe el comando *#readme*')
                if (!args[1].match(isUrl) && !args[1].includes('xnxx.com')) return cabe.reply(from, mess.error.Iv, id)
                try {
                    cabe.reply(from, mess.wait, id)
                    const resq = await axios.get('https://mhankbarbar.herokuapp.com/api/xnxx?url='+ args[1] +'&apiKey='+ barbarkey)
                    const resp = resq.data
                     if (resp.error) {
                        cabe.reply(from, ytvv.error, id)
                    } else {
                        if (Number(resp.result.size.split(' MB')[0]) > 20.00) return cabe.reply(from, 'Maaf durasi video sudah melebihi batas maksimal 20 menit!', id)
                        cabe.sendFileFromUrl(from, resp.result.thumb, 'thumb.jpg', `➸ *Judul* : ${resp.result.judul}\n➸ *Deskripsi* : ${resp.result.desc}\n➸ *Filesize* : ${resp.result.size}\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit.`, id)
                        await cabe.sendFileFromUrl(from, resp.result.vid, `${resp.result.title}.mp4`, '', id)}
                } catch (err) {
                    console.log(err)
                    await cabe.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Video tidak ditemukan')
                    cabe.sendText(ownerNumber, 'Xnxx Error : ' + err)
                }
                break
                case 'google':
            if (isLimit(serial)) return cabe.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            cabe.reply(from, mess.wait, id)
            const googleQuery = body.slice(8)
            if(googleQuery == undefined || googleQuery == ' ') return cabe.reply(from, `*Hasil Pencarian : ${googleQuery}* tidak ditemukan`, id)
            google({ 'query': googleQuery }).then(results => {
            let vars = `_*Hasil Pencarian : ${googleQuery}*_\n`
            for (let i = 0; i < results.length; i++) {
                vars +=  `\n═════════════════\n\n*Judul* : ${results[i].title}\n\n*Deskripsi* : ${results[i].snippet}\n\n*Link* : ${results[i].link}\n\n`
            }
                cabe.reply(from, vars, id);
            }).catch(e => {
                console.log(e)
                cabe.sendText(ownerNumber, 'Google Error : ' + e);
            })
            break
            case 'googleimage':
                if (isLimit(serial)) return cabe.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
                
                await limitAdd(serial)
                if (args.length === 1) return cabe.reply(from, 'Kirim perintah *#googleimage [query]*\nContoh : *#googleimage Elaina*', id)
                try{
                    cabe.reply(from, mess.wait, id)
                    const gimgg = body.slice(13)
                    const gamb = `https://api.vhtear.com/googleimg?query=${gimgg}&apikey=${vhtearkey}`
                    const gimg = await axios.get(gamb)
                    var gimg2 = Math.floor(Math.random() * gimg.data.result.result_search.length)
                    console.log(gimg2)
                    await cabe.sendFileFromUrl(from, gimg.data.result.result_search[gimg2], `gam.${gimg.data.result.result_search[gimg2]}`, `*Google Image*\n\n*Hasil Pencarian : ${gimgg}*`, id)
                } catch (err) {
                    console.log(err); 
                    cabe.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Gambar tidak ditemukan')
                    cabe.sendText(ownerNumber, 'Google Image Error : ' + err)
                }
              break
              case 'nsfw':
                if (!isGroupMsg) return cabe.reply(from, '¡Este comando solo se puede usar en grupos!', id)
                if (!isGroupAdmins) return cabe.reply(from, '¡Este comando solo puede ser utilizado por los admins del grupo!', id)
                if (args.length === 1) return cabe.reply(from, 'Seleccione habilitar o deshabilitar!', id)
                if (args[1].toLowerCase() === 'habilitar') {
                    nsfw_.push(chat.id)
                    fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                    cabe.reply(from, '¡El comando NSWF se ha activado con éxito en este grupo! enviar el comando *!nsfwMenu* para encontrar el menú', id)
                } else if (args[1].toLowerCase() === 'deshabilitar') {
                    nsfw_.splice(chat.id, 1)
                    fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                    cabe.reply(from, 'Comando NSFW desactivado con éxito en este grupo!', id)
                } else {
                    cabe.reply(from, 'Seleccione habilitar o deshabilitar!', id)
                }
                break
                case 'simisimi':
			if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id)
			cabe.reply(from, `Para habilitar simi-simi en el chat grupal\n\nUtilizar\n${prefix}simi on --activar\n${prefix}simi off - desactivar\n`, id)
			break
		case 'simi':
			if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id)
            if (!isGroupAdmins) return cabe.reply(from, 'Falló, este comando solo puede ser utilizado por los admins del grupo.', id)
			if (args.length !== 1) return cabe.reply(from, `Para habilitar simi-simi en el chat grupal\n\nUtilizar\n${prefix}simi on --activar\n${prefix}simi off - desactivar\n`, id)
			if (args[0] == 'on') {
				simi.push(chat.id)
				fs.writeFileSync('./settings/simi.json', JSON.stringify(simi))
                cabe.reply(from, '¡Activa el bot simi-simi!', id)
			} else if (args[0] == 'off') {
				let inxx = simi.indexOf(chat.id)
				simi.splice(inxx, 1)
				fs.writeFileSync('./settings/simi.json', JSON.stringify(simi))
				cabe.reply(from, 'inhabilitar el bot simi-simi!', id)
			} else {
				cabe.reply(from, `Para habilitar simi-simi en el chat grupal\n\nUtilizar\n${prefix}simi on --activar\n${prefix}simi off - desactivar\n`, id)
			}
			break
        // Random Kata
        case 'fakta':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt')
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                cabe.reply(from, randomnix, id)
            })
            break
        case 'katabijak':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt')
            .then(res => res.text())
            .then(body => {
                let splitbijak = body.split('\n')
                let randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)]
                cabe.reply(from, randombijak, id)
            })
            break
        case 'pantun':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt')
            .then(res => res.text())
            .then(body => {
                let splitpantun = body.split('\n')
                let randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)]
                cabe.reply(from, randompantun.replace(/aruga-line/g,"\n"), id)
            })
            break
        case 'quote':
            const quotex = await rugaapi.quote()
            await cabe.reply(from, quotex, id)
            break

        //Random Images
        case 'anime':
            if (args.length == 0) return cabe.reply(from, `Usar ${prefix}anime\nPor favor escribe: ${prefix}anime [consulta]\nejemplo: ${prefix}anime random\n\n consultas disponibles:\n random, waifu, husbu, neko`, id)
            if (args[0] == 'random' || args[0] == 'waifu' || args[0] == 'husbu' || args[0] == 'neko') {
                fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomnime = body.split('\n')
                    let randomnimex = randomnime[Math.floor(Math.random() * randomnime.length)]
                    cabe.sendFileFromUrl(from, randomnimex, '', 'Aqui esta', id)
                })
            } else {
                cabe.reply(from, `Lo sentimos, la consulta no está disponible. Por favor escribe ${prefix}anime para ver la lista de consultas`)
            }
            break
        case 'kpop':
            if (args.length == 0) return cabe.reply(from, `Usar ${prefix}kpop\nPor favor escribe: ${prefix}kpop [consulta]\nEjemplos: ${prefix}kpop bts\n\nconsultas disponibles:\nblackpink, exo, bts`, id)
            if (args[0] == 'blackpink' || args[0] == 'exo' || args[0] == 'bts') {
                fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomkpop = body.split('\n')
                    let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
                    cabe.sendFileFromUrl(from, randomkpopx, '', 'Aqui...', id)
                })
            } else {
                cabe.reply(from, `Lo sentimos, la consulta no está disponible. Por favor escribe ${prefix}kpop para ver la lista de consultas`)
            }
            break
        case 'memes':
            const randmeme = await meme.random()
            cabe.sendFileFromUrl(from, randmeme, '', '', id)
            break
        
        // Search Any
        case 'imagen':
        case 'images':
            if (args.length == 0) return cabe.reply(from, `Para buscar imágenes en pinterest\nescriba: ${prefix}imagen [busqueda]\nejemplo: ${prefix}imagen naruto`, id)
            const cariwall = body.slice(8)
            const hasilwall = await images.fdci(cariwall)
            cabe.sendFileFromUrl(from, hasilwall, '', '', id)
            break
        case 'sreddit':
            if (args.length == 0) return cabe.reply(from, `Para buscar imágenes en sub reddit\nescriba: ${prefix}sreddit [busqueda]\nejemplo: ${prefix}sreddit naruto`, id)
            const carireddit = body.slice(9)
            const hasilreddit = await images.sreddit(carireddit)
            cabe.sendFileFromUrl(from, hasilreddit, '', '', id)
        break 
        case 'resep':
            if (args.length == 0) return cabe.reply(from, `Para buscar recetas de comida\nescribir: ${prefix}resep [busqueda]\n\nejemplo: ${prefix}resep tahu`, id)
            const cariresep = body.slice(7)
            const hasilresep = await resep.resep(cariresep)
            cabe.reply(from, hasilresep + '\n\nEsta es la receta de la comida ...', id)
            break
        case 'nekopoi':
            cabe.sendText(from, `Buscando los últimos videos del sitio web de nekopoi ...`)
            rugapoi.getLatest()
            .then((result) => {
                rugapoi.getVideo(result.link)
                .then((res) => {
                    let heheq = '\n'
                    for (let i = 0; i < res.links.length; i++) {
                        heheq += `${res.links[i]}\n`
                    }
                    cabe.reply(from, `Titulo: ${res.title}\n\nLink:\n${heheq}\nsiendo un probador por un momento :v`)
                })
            })
            break
        case 'stalkig':
            if (args.length == 0) return cabe.reply(from, `Acechar la cuenta de Instagram de alguien\nescribir ${prefix}stalkig [nombre de usuario]\nejemplo: ${prefix}stalkig ini.arga`, id)
            const igstalk = await rugaapi.stalkig(args[0])
            const igstalkpict = await rugaapi.stalkigpict(args[0])
            await cabe.sendFileFromUrl(from, igstalkpict, '', igstalk, id)
            break
            case 'wiki':
                if (args.length === 1) return cabe.reply(from, 'Kirim perintah *!wiki [query]*\nContoh : *!wiki asu*', id)
                const query_ = body.slice(6)
                const wiki = await get.get(`https://es.wikipedia.org/w/api.php`).json()
                if (wiki.error) {
                    cabe.reply(from, wiki.error, id)
                } else {
                    cabe.reply(from, `➸ *Query* : ${query_}\n\n➸ *Result* : ${wiki.result}`, id)
                }
                break
        case 'acorde':
            if (args.length == 0) return cabe.reply(from, `Para buscar la letra y los acordes de una canción\bescribir: ${prefix}acorde [título_ canción]`, id)
            const chordq = body.slice(7)
            const chordp = await rugaapi.chord(chordq)
            await cabe.reply(from, chordp, id)
            break
            case 'ss': //jika error silahkan buka file di folder settings/api.json dan ubah apiSS 'API-KEY' yang kalian dapat dari website https://apiflash.com/
            if (args.length == 0) return cabe.reply(from, `Convertir la captura de pantalla de los bots en una web\n\nUso: ${prefix}ss [url]\n\nejemplo: ${prefix}ss http://google.com`, id)
            const scrinshit = await meme.ss(args[0])
            await cabe.sendFile(from, scrinshit, 'ss.jpg', 'cekrek', id)
            break
            case 'play'://silahkan kalian custom sendiri jika ada yang ingin diubah
            if (args.length == 0) return cabe.reply(from, `Para buscar canciones de youtube\n\nUtilizar: ${prefix}play título de la canción(este comando no anda x el momento,estoy trajando para arreglar)`, id)
            axios.get(`https://arugaytdl.herokuapp.com/search?q=${body.slice(6)}`)
            .then(async (res) => {
                await cabe.sendFileFromUrl(from, `${res.data[0].thumbnail}`, ``, `Canción encontrada\n\nTítulo: ${res.data[0].title}\nDuración: ${res.data[0].duration}detik\nUploaded: ${res.data[0].uploadDate}\nView: ${res.data[0].viewCount}\n\nsedang dikirim\n(este comando no anda x el momento,estoy trajando para arreglar)`, id)
                axios.get(`https://arugaz.herokuapp.com/api/yta?url=https://youtu.be/${res.data[0].id}`)
                .then(async(rest) => {
                    await cabe.sendPtt(from, `${rest.data.result}`, id)
                })
             })
            break
        case 'whatanime':
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                cabe.reply(from, 'Buscando....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                	if (resolt.docs && resolt.docs.length <= 0) {
                		cabe.reply(from, 'Lo siento, no sé qué anime es este, asegúrese de que la imagen que se buscará no esté borrosa / cortada', id)
                	}
                    const { is_adult, title, title_chinese, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                    	teks = '*Tengo poca fe en esto* :\n\n'
                    }
                    teks += `➸ *Título japonés* : ${title}\n➸ *Título chino* : ${title_chinese}\n➸ *Título Inglés* : ${title_english}\n`
                    teks += `➸ *R-18?* : ${is_adult}\n`
                    teks += `➸ *Eps* : ${episode.toString()}\n`
                    teks += `➸ *Semejanza* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    cabe.sendFileFromUrl(from, video, 'anime.mp4', teks, id).catch(() => {
                        cabe.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    cabe.reply(from, 'Error!', id)
                })
            }
            break
             
        // Other Command
        case 'resi':
            if (args.length !== 2) return cabe.reply(from, `Lo sentimos, el formato del mensaje es incorrecto.\nIntroduzca su mensaje con ${prefix}resi <kurir> <no_resi>\n\nKurir yang tersedia:\njne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex`, id)
            const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
            if (!kurirs.includes(args[0])) return cabe.sendText(from, `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`)
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0])
            cekResi(args[0], args[1]).then((result) => cabe.sendText(from, result))
            break
        case 'tts':
            if (args.length == 0) return cabe.reply(from, `Cambiar texto a sonido (voz de Google) \n tipo: ${prefix}tts <código de idioma> <texto> \n ejemplos: ${prefix}tts es hola \n para ver el código de idioma aquí: https://anotepad.com/note/read/5xqahdy8`)
            const ttsGB = require('node-gtts')(args[0])
            const dataText = body.slice(8)
                if (dataText === '') return cabe.reply(from, 'cual es el texto..', id)
                try {
                    ttsGB.save('./media/tts.mp3', dataText, function () {
                    cabe.sendPtt(from, './media/tts.mp3', id)
                    })
                } catch (err) {
                    cabe.reply(from, err, id)
                }
            break
        case 'translate':
            if (args.length != 1) return cabe.reply(from, `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${prefix}translate <kode_bahasa>\ncontoh ${prefix}translate id`, id)
            if (!quotedMsg) return cabe.reply(from, `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${prefix}translate <kode_bahasa>\ncontoh ${prefix}translate id`, id)
            const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
            translate(quoteText, args[0])
                .then((result) => cabe.sendText(from, result))
                .catch(() => cabe.sendText(from, 'Error, Kode bahasa salah.'))
            break
        case 'shortlink':
            if (args.length == 0) return cabe.reply(from, `ketik ${prefix}shortlink <url>`, message.id)
            if (!isUrl(args[0])) return cabe.reply(from, 'Maaf, url yang kamu kirim tidak valid.', message.id)
            const shortlink = await urlShortener(args[0]);
            await cabe.sendText(from, shortlink);
            break

        // Comando para Admins del grupo (solo admins del grupo)
	    case 'agregar':
            if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id)
            if (!isGroupAdmins) return cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo!', id)
            if (!isBotGroupAdmins) return cabe.reply(from, 'Falló, agregue el bot como admin del grupo!', id)
	        if (args.length !== 1) return cabe.reply(from, `Usar ${prefix}agregar\nUtilizar: ${prefix}agregar <numero>\nejemplo: ${prefix}agregar 54xxxxxx`, id)
                try {
                    await cabe.addParticipant(from,`${args[0]}@c.us`)
		            .then(() => cabe.reply(from, 'Hola bienvenido', id))
                } catch {
                    cabe.reply(from, 'No se pudo agregar el objetivo', id)
                }
            break
        case 'eliminar':
            if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id)
            if (!isGroupAdmins) return cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id)
            if (!isBotGroupAdmins) return cabe.reply(from, 'Falló, agregue el bot como admin del grupo.', id)
            if (mentionedJidList.length === 0) return cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n etiquete a una o más personas para eliminar del grupo', id)
            if (mentionedJidList[0] === botNumber) return await cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n No puedo expulsar la cuenta del bot por mí mismo', id)
            await cabe.sendTextWithMentions(from, `Solicitud recibida, problema:\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await cabe.sendText(from, 'Error, no puede eliminar a el admin del grupo.')
                await cabe.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'promover':
            if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id)
            if (!isGroupAdmins) return cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id)
            if (!isBotGroupAdmins) return cabe.reply(from, 'Falló, agregue el bot como administrador de grupo.', id)
            if (mentionedJidList.length !== 1) return cabe.reply(from, 'Lo sentimos, solo puedo promover a 1 usuario', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await cabe.reply(from, 'Lo siento, el usuario ya es admin.', id)
            if (mentionedJidList[0] === botNumber) return await cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n no se puede promover la cuenta del bot por sí solo', id)
            await cabe.promoteParticipant(groupId, mentionedJidList[0])
            await cabe.sendTextWithMentions(from, `Solicitud aceptada, agregad@ @${mentionedJidList[0].replace('@c.us', '')} como admin.`)
            break
        case 'degradar':
            if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id)
            if (!isGroupAdmins) return cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id)
            if (!isBotGroupAdmins) return cabe.reply(from, 'Falló, agregue el bot como administrador de grupo.', id)
            if (mentionedJidList.length !== 1) return cabe.reply(from, 'Lo sentimos, solo se puede degradar a 1 usuario', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await cabe.reply(from, 'Lo sentimos, el usuario aún no es administrador.', id)
            if (mentionedJidList[0] === botNumber) return await cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n No se puede eliminar la cuenta del bot.', id)
            await cabe.demoteParticipant(groupId, mentionedJidList[0])
            await cabe.sendTextWithMentions(from, `Solicitud aceptada, eliminar posición @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
        case 'bye':
            if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id)
            if (!isGroupAdmins) return cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo.', id)
            cabe.sendText(from, 'Adiós, ya no me quieren aqui...( ⇀‸↼‶ )').then(() => cabe.leaveGroup(groupId))
            break
        case 'borrar':
            if (!isGroupAdmins) return cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo!', id)
            if (!quotedMsg) return cabe.reply(from, `Lo sentimos, el formato del mensaje es incorrecto, por favor. \n Responde enviar un mensaje al bot con un título ${prefix}borrar`, id)
            if (!quotedMsgObj.fromMe) return cabe.reply(from, `Lo sentimos, el formato del mensaje es incorrecto, por favor. \n Responde enviar un mensaje al bot con el título ${prefix}borrar`, id)
            cabe.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case 'lista':
        case 'lista':
            if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id)
            if (!isGroupAdmins) return cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo.', id)
            const groupMem = await cabe.getGroupMembers(groupId)
            let hehex = '╔══✪〘 Mencionar a todos 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehex += '╠➥'
                hehex += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehex += '╚═〘 *CABE  B O T* 〙'
            await cabe.sendTextWithMentions(from, hehex)
            break
        case 'botstat': {
            const loadedMsg = await cabe.getAmountOfLoadedMessages()
            const chatIds = await cabe.getAllChatIds()
            const groups = await cabe.getAllGroups()
            cabe.sendText(from, `Estado :\n- *${loadedMsg}* Mensajes cargados\n- *${groups.length}* Chats grupales\n- *${chatIds.length - groups.length}* Chats personales\n- *${chatIds.length}* Total de chats`)
            break
        }
        //Grupo propietario
        case 'kickall': //eliminar todos los miembros
        if (!isGroupMsg) return cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id)
        let isOwner = chat.groupMetadata.owner == sender.id
        if (!isOwner) return cabe.reply(from, 'Lo sentimos, este comando solo puede ser utilizado por el propietario del grupo.', id)
        if (!isBotGroupAdmins) return cabe.reply(from, 'Falló, agregue el bot como admin del grupo.', id)
            const allMem = await cabe.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {

                } else {
                    await cabe.removeParticipant(groupId, allMem[i].id)
                }
            }
            cabe.reply(from, 'Exito expulsar a todos los miembros', id)
        break
        //propietario del bot
        case 'ban':
            if (!isOwnerBot) return cabe.reply(from, '¡Este pedido es solo para el propietario del bot!', id)
            if (args.length == 0) return cabe.reply(from, `Prohibir que alguien use comandos\n\nEscribir: \n${prefix}ban add 54xx --Activar\n${prefix}ban del 54xx --deshabilitar\n\ncómo prohibir rápidamente muchos tipos en grupos:\n${prefix}ban @tag @tag @tag`, id)
            if (args[0] == 'add') {
                banned.push(args[1]+'@c.us')
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                cabe.reply(from, 'Objetivo baneado con éxito!')
            } else
            if (args[0] == 'del') {
                let xnxx = banned.indexOf(args[1]+'@c.us')
                banned.splice(xnxx,1)
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                cabe.reply(from, '¡Objetivo no prohibido con éxito!')
            } else {
             for (let i = 0; i < mentionedJidList.length; i++) {
                banned.push(mentionedJidList[i])
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                cabe.reply(from, '¡Objetivo de prohibición de éxito!', id)
                }
            }
            break
        case 'bc': //untuk broadcast atau promosi
            if (!isOwnerBot) return cabe.reply(from, '¡Este pedido es solo para el propietario del bot!', id)
            if (args.length == 0) return cabe.reply(from, `Para transmitir a todos los chats, escriba:\n${prefix}bc [rellenar el chat]`)
            let msg = body.slice(4)
            const chatz = await cabe.getAllChatIds()
            for (let idk of chatz) {
                var cvk = await cabe.getChatById(idk)
                if (!cvk.isReadOnly) cabe.sendText(idk, `〘 *C A B E  B C* 〙\n\n${msg}`)
                if (cvk.isReadOnly) cabe.sendText(idk, `〘 *C A B E  B C* 〙\n\n${msg}`)
            }
            cabe.reply(from, 'Éxito de la transmisión!', id)
            break
        case 'leaveall': //mengeluarkan bot dari semua group serta menghapus chatnya
            if (!isOwnerBot) return cabe.reply(from, 'Este comando es solo para el propietario del bot', id)
            const allChatz = await cabe.getAllChatIds()
            const allGroupz = await cabe.getAllGroups()
            for (let gclist of allGroupz) {
                await cabe.sendText(gclist.contact.id, `Lo siento, el bot está limpiando, el chat total está activo : ${allChatz.length}`)
                await cabe.leaveGroup(gclist.contact.id)
                await cabe.deleteChat(gclist.contact.id)
            }
            cabe.reply(from, 'Exito dejar todo el grupo!', id)
            break
        case 'clearall': //menghapus seluruh pesan diakun bot
            if (!isOwnerBot) return cabe.reply(from, 'Este comando es solo para el propietario del bot', id)
            const allChatx = await cabe.getAllChats()
            for (let dchat of allChatx) {
                await cabe.deleteChat(dchat.id)
            }
            cabe.reply(from, 'Tiene éxito borrar todo el chat!', id)
            break
        default:
            console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Comando no registrado de', color(pushname))
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
    })
}

create ('cabe', options(true, start))
    .then((cabe) => start(cabe))
    .catch((err) => new Error(err))
