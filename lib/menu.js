const fs = require('fs-extra')
const { 
    prefix
} = JSON.parse(fs.readFileSync('./settings/setting.json'))


exports.textTnC = () => {
    return `
    El código fuente / bot es un programa de código abierto (gratuito) escrito con Javascript, puede usar, copiar, modificar, combinar, publicar, distribuir, sublicenciar o vender copias sin eliminar el autor principal del código fuente / bot.
    Al usar este código fuente / bot, acepta los siguientes Términos y condiciones:
    - El código fuente / bot no almacena sus datos en nuestros servidores.
    - El código fuente / bot no es responsable de sus pedidos a este bot.
Editor del codigo Cabe Wa.me/+543757437404.
Si queres aprender sobre legiones, asi como crear spams, crear trabas, mandar y salir de soporte, crear tu propio bot entre mas unete a la legion ༆⃢🇫🇰➴ꪾ͡ꦿ᭄σғc тнε яεмηαηт➴ꪾ͡ꦿ᭄፝⃟༘༆⃢🇫🇰 ( https://chat.whatsapp.com/KqwwdQoHIHVHBS18ynD0Ic )`
    
}


exports.textMenu = (pushname) => {
    return `
Hola, ${pushname}! 👋️
¡Estas son algunas de las características de este bot! ✨
〘🅒🅡🅔🅐🅓🅞🅡〙
➸. *${prefix}sticker*
➸. *${prefix}stickergif*
➸. *${prefix}stickergiphy*
➸. *${prefix}meme*
➸. *${prefix}quotemaker*
➸. *${prefix}escribir*
_-_-_-_-_-_-_-_-_-_-_-_-_-_
〘🅓🅔🅢🅒🅐🅡🅖🅐〙
➸. *${prefix}instagram*
➸. *${prefix}tiktok* 
➸. *${prefix}fb*
➸. *${prefix}twt*  
➸. *${prefix}ytmp3*
➸. *${prefix}ytmp4*
➸. *${prefix}xnxx*
➸. *${prefix}google*
➸. *${prefix}googleimage*
➸. *${prefix}NSFW [enable|disable]*
_-_-_-_-_-_-_-_-_-_-_-_-_-_
〘🅑🅤🅢🅠🅤🅔🅓🅐〙
➸. *${prefix}imagen*
➸. *${prefix}sreddit*
➸. *${prefix}resep*
➸. *${prefix}nekopoi*
➸. *${prefix}stalkig*
➸. *${prefix}wiki*
➸. *${prefix}acorde*
➸. *${prefix}ss*
➸. *${prefix}play*
➸. *${prefix}whatanime*
_-_-_-_-_-_-_-_-_-_-_-_-_-_
〘🅣🅔🅧🅣🅞 🅐🅛🅔🅐🅣🅞🅡🅘🅞〙
➸. *${prefix}fakta*
➸. *${prefix}pantun*
➸. *${prefix}katabijak*
➸. *${prefix}quote*
_-_-_-_-_-_-_-_-_-_-_-_-_-_
〘🅘🅜🅐🅖🅔🅝🅔🅢 🅡🅐🅝🅓🅞🅜〙
➸. *${prefix}anime*
➸. *${prefix}kpop*
➸. *${prefix}memes*
_-_-_-_-_-_-_-_-_-_-_-_-_-_
〘🅞🅣🅡🅞〙
➸. *${prefix}tts*
➸. *${prefix}translate*
➸. *${prefix}resi*
➸. *${prefix}shortlink*
_-_-_-_-_-_-_-_-_-_-_-_-_-_
〘🅐🅒🅔🅡🅒🅐 🅓🅔🅛 🅑🅞🅣〙
➸. *${prefix}tnc*
➸. *${prefix}donar*
➸. *${prefix}propietario del bot*
➸. *${prefix}join*
_-_-_-_-_-_-_-_-_-_-_-_-_-_
〘🅟🅡🅞🅟🅘🅔🅣🅐🅡🅘🅞 🅓🅔🅛 🅑🅞🅣〙
➸. *${prefix}ban* - prohibir
➸. *${prefix}bc* - promosi
➸. *${prefix}leaveall* - salir de todos los grupos
➸. *${prefix}clearall* - eliminar todos los chats
_-_-_-_-_-_-_-_-_-_-_-_-_-_
Si queres aprender sobre legiones, asi como crear spams, crear trabas, mandar y salir de soporte, crear tu propio bot entre mas unete a la legion ༆⃢🇫🇰➴ꪾ͡ꦿ᭄σғc тнε яεмηαηт➴ꪾ͡ꦿ᭄፝⃟༘༆⃢🇫🇰 ( https://chat.whatsapp.com/KqwwdQoHIHVHBS18ynD0Ic )
 (si el bot falla hablar con Wa.me/+543757437404 ) ✨
 IG https://www.instagram.com/cabe.gus/
Para donar seguir este enlace. Gracias https://www.paypal.com/paypalme/cabegus?locale.x=es_XC
¡Espero que tengas un gran día!`
}

exports.textAdmin = () => {
    return `
⚠〘🅢🅞🅛🅞 🅒🅡🅔🅐🅓🅞🅡 🅓🅔🅛 🅖🅡🅤🅟🅞〙⚠
¡Aquí están las características del creador del grupo en este bot!
. *${prefix}kickall* (elimana a todos los miembros del grupo)
_-_-_-_-_-_-_-_-_-_-_-_-_-_
⚠〘🅒🅞🅜🅐🅝🅓🅞 🅟🅐🅡🅐 🅐🅓🅜🅘🅝🅢〙⚠ 
¡Aquí están las funciones de administración de grupo de este bot!
➸. *${prefix}agregar* numero sin + y todo junto (#agregar 5400)
➸. *${prefix}eliminar* @usuario (elimina participante/s)
➸. *${prefix}promover* @usuario (promueve a admin a un miembro)
➸. *${prefix}degradar* @usuario (degrada de admin a un miembro)
➸. *${prefix}lista* (crea una lista de todos los miembros)
➸. *${prefix}borrar* (borra el mensaje del bot)
➸. *${prefix}bye* (sale del chat)
_-_-_-_-_-_-_-_-_-_-_-_-_-_
`
}

exports.textDonasi = () => {
    return `
    Hola, gracias por usar este bot, para apoyar este bot puedes ayudar donando:
    La donación se utilizará para el desarrollo y funcionamiento de este bot.
    PayPal https://www.paypal.com/paypalme/cabegus?locale.x=es_XC
    Gracias.`
}
exports.textTR = () => {
    return `
    Hola the remnant`
}