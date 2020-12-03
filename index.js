const { create, Client } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const left = require('./lib/left')
const msgHandler = require('./tobz')
const options = require('./options')
const fs = require('fs-extra')
const figlet = require('figlet')

const adminNumber = JSON.parse(fs.readFileSync('./lib/admin.json'))
const setting = JSON.parse(fs.readFileSync('./lib/setting.json'))
const isWhite = (chatId) => adminNumber.includes(chatId) ? true : false

let { 
    limitCount,
    memberLimit, 
    groupLimit,
    mtc: mtcState,
    banChats,
    restartState: isRestart
    } = setting

function restartAwal(tobz){
    setting.restartState = false
    isRestart = false
    tobz.sendText(setting.restartId, 'Reiniciar con éxito!')
    setting.restartId = 'indefinido'
    //fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null,2));
}

const start = async (tobz = new Client()) => {
        console.log('------------------------------------------------')
        console.log(color(figlet.textSync('CABE BOT', { horizontalLayout: 'lleno' })))
        console.log('------------------------------------------------')
        console.log('[DEV] CABE')
        console.log('[SERVIDOR] Servidor iniciado!')
        if(isRestart){restartAwal(tobz);}
        // Force it to keep the current session
        tobz.onStateChanged((state) => {
            console.log('[Estado del cliente]', state)
            if (state === 'CONFLICTO' || state === 'NO LANZADO') tobz.forceRefocus()
        })
        // listening on message
        tobz.onMessage((async (message) => {

            tobz.getAllChats()
            .then((msg) => {
                if (msg >= 200) {
                    tobz.deleteChat()
                }
            })
            msgHandler(tobz, message)
        }))
           

        tobz.onGlobalParicipantsChanged((async (heuh) => {
            await welcome(tobz, heuh) 
            left(tobz, heuh)
            }))
        
        tobz.onAddedToGroup(async (chat) => {
            if(isWhite(chat.id)) return tobz.sendText(chat.id, 'Hola, soy CABE BOT 2.1, escribe #menu para ver mi lista de comandos...')
            if(mtcState === false){
                const groups = await tobz.getAllGroups()
                // BOT group count less than
                if(groups.length > groupLimit){
                    await tobz.sendText(chat.id, 'Lo sentimos, el límite de grupo que CABE BOT puede acomodar está completo').then(async () =>{
                        tobz.deleteChat(chat.id)
                        tobz.leaveGroup(chat.id)
                    })
                }else{
                    if(chat.groupMetadata.participants.length < memberLimit){
                        await tobz.sendText(chat.id, `Lo sentimos, BOT sale si el grupo de miembros no excede ${memberLimit} personas`).then(async () =>{
                            tobz.deleteChat(chat.id)
                            tobz.leaveGroup(chat.id)
                        })
                    }else{
                        if(!chat.isReadOnly) tobz.sendText(chat.id, 'Hola, soy CABE BOT 2.1, escribe #menu para ver mi lista de comandos ...')
                    }
                }
            }else{
                await tobz.sendText(chat.id, 'CABE BOT está en mantenimiento, prueba en otro momento favor de tener paciencia y comunicarse con wa.me/543757437404').then(async () => {
                    tobz.deleteChat(chat.id)
                    tobz.leaveGroup(chat.id)
                })
            }
        })

        /*tobz.onAck((x => {
            const { from, to, ack } = x
            if (x !== 3) tobz.sendSeen(to)
        }))*/

        // listening on Incoming Call
        tobz.onIncomingCall(( async (call) => {
            await tobz.sendText(call.peerJid, 'Lo siento, no puedo recibir llamadas = bloquear!.\nSi desea abrir un bloque, por favor chatee con el propietario!')
            .then(() => tobz.contactBlock(call.peerJid))
        }))
    }

create('CABE BOT', options(true, start))
    .then(tobz => start(tobz))
    .catch((error) => console.log(error))