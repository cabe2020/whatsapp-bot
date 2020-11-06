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
    - Código fuente / bot que puedes ver en https://github.com/ArugaZ
Instagram: https://instagram.com/ini.arga/

Best regards, ArugaZ.`
    
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
Premium:
. *${prefix}pornhub*
. *${prefix}simsimi*
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
. *${prefix}donasi*
. *${prefix}ownerbot*
. *${prefix}join*
_-_-_-_-_-_-_-_-_-_-_-_-_-_
Owner Bot:
. *${prefix}ban* - banned
. *${prefix}bc* - promosi
. *${prefix}leaveall* - keluar semua grup
. *${prefix}clearall* - hapus semua chat
¡Espero que tengas un gran día! ✨`
}

exports.textAdmin = () => {
    return `
⚠ [ *Solo Admins del grupo* ] ⚠
¡Aquí están las características del propietario del grupo en este bot!
. *${prefix}kickall*
-owner adalah pembuat grup.
⚠ [ *Comando para Admins del grupo* ] ⚠ 

¡Aquí están las funciones de administración de grupo de este bot!
. *${prefix}agregar*
. *${prefix}bam* @tag
. *${prefix}promover* @tag
. *${prefix}degradar* @tag
. *${prefix}lista*
. *${prefix}borrar*
`
}

exports.textDonasi = () => {
    return `
    Hola, gracias por usar este bot, para apoyar este bot puedes ayudar donando:
    Ore para que el proyecto de bot siga creciendo
    Ore para que el autor del bot obtenga ideas más creativas
    La donación se utilizará para el desarrollo y funcionamiento de este bot.
    Gracias.`
}