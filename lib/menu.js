const fs = require('fs-extra')
const { 
    prefix
} = JSON.parse(fs.readFileSync('./settings/setting.json'))


/*
Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.
*/

exports.textTnC = () => {
    return `
    El código fuente / bot es un programa de código abierto (gratuito) escrito con Javascript, puede usar, copiar, modificar, combinar, publicar, distribuir, sublicenciar o vender copias sin eliminar el autor principal del código fuente / bot.
    Al usar este código fuente / bot, acepta los siguientes Términos y condiciones:
    - El código fuente / bot no almacena sus datos en nuestros servidores.
    - El código fuente / bot no es responsable de sus pedidos a este bot.
Editor del codigo Cabe Wa.me/+543757437404 .`
    
}

exports.textMenu = (pushname) => {
    return `
Hola, ${pushname}! 👋️
¡Estas son algunas de las características de este bot! ✨
Creador:
. *${prefix}sticker*
. *${prefix}stickergif*
. *${prefix}stickergiphy*
. *${prefix}meme*
. *${prefix}quotemaker*
. *${prefix}nulis*
Islam:
. *${prefix}infosurah*
. *${prefix}surah*
. *${prefix}tafsir*
. *${prefix}ALaudio*
. *${prefix}jsolat*
Descarga
. *${prefix}instagram*
. *${prefix}ytmp3*
. *${prefix}ytmp4*
busqueda
. *${prefix}images*
. *${prefix}sreddit*
. *${prefix}resep*
. *${prefix}nekopoi*
. *${prefix}stalkig*
. *${prefix}wiki*
. *${prefix}cuaca*
. *${prefix}chord*
. *${prefix}ss*
. *${prefix}play*
Random Teks:
. *${prefix}fakta*
. *${prefix}pantun*
. *${prefix}katabijak*
. *${prefix}quote*
imagenes random
. *${prefix}anime*
. *${prefix}kpop*
. *${prefix}memes*
Lain-lain:
. *${prefix}tts*
. *${prefix}translate*
. *${prefix}resi*
. *${prefix}ceklokasi*
. *${prefix}shortlink*
Tentang Bot:
. *${prefix}tnc*
. *${prefix}donar*
. *${prefix}ownerbot*
. *${prefix}join*
_-_-_-_-_-_-_-_-_-_-_-_-_-_
Owner Bot:
. *${prefix}ban* - banned
. *${prefix}bc* - promosi
. *${prefix}leaveall* - keluar semua grup
. *${prefix}clearall* - hapus semua chat
¡Espero que tengas un gran día! (si el bot falla hablar con Wa.me/+543757437404 ) ✨
Para donar seguir este enlace. Gracias https://www.paypal.com/paypalme/cabegus?locale.x=es_XC`
}

exports.textAdmin = () => {
    return `
⚠ [ *Solo creador del grupo* ] ⚠
¡Aquí están las características del propietario del grupo en este bot!
. *${prefix}kickall* (elimana a todos los miembros del grupo)
-propietario es el creador del grupo.
⚠ [ *Comando para Admins del grupo* ] ⚠ 

¡Aquí están las funciones de administración de grupo de este bot!
. *${prefix}agregar*
. *${prefix}eliminar* @usuario (elimina participante/s)
. *${prefix}promover* @usuario (promueve a admin a un miembro)
. *${prefix}degradar* @usuario (degrada de admin a un miembro)
. *${prefix}lista* (crea una lista de todos los miembros)
. *${prefix}borrar* (borra el mensaje del bot)
`
}

exports.textDonasi = () => {
    return `
    Hola, gracias por usar este bot, para apoyar este bot puedes ayudar donando:
    Ore para que el proyecto de bot siga creciendo
    Ore para que el autor del bot obtenga ideas más creativas
    La donación se utilizará para el desarrollo y funcionamiento de este bot.
    PayPal https://www.paypal.com/paypalme/cabegus?locale.x=es_XC
    Gracias.`
}