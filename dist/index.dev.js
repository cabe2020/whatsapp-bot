"use strict";

require('dotenv').config();

var _require = require('@open-wa/wa-automate'),
    create = _require.create,
    decryptMedia = _require.decryptMedia,
    Client = _require.Client;

var moment = require('moment-timezone');

moment.tz.setDefault('America/Argentina/Buenos_Aires').locale('id');

var figlet = require('figlet');

var fs = require('fs-extra');

var axios = require('axios');

var fetch = require('node-fetch');

var banned = JSON.parse(fs.readFileSync('./settings/banned.json'));
var nsfw_ = JSON.parse(fs.readFileSync('./lib/NSFW.json'));
var simi = JSON.parse(fs.readFileSync('./settings/simi.json'));

var _require2 = require('remove.bg'),
    removeBackgroundFromImageBase64 = _require2.removeBackgroundFromImageBase64;

var _require3 = require('child_process'),
    exec = _require3.exec;

var _require4 = require('./lib'),
    menuId = _require4.menuId,
    cekResi = _require4.cekResi,
    urlShortener = _require4.urlShortener,
    meme = _require4.meme,
    translate = _require4.translate,
    images = _require4.images,
    resep = _require4.resep,
    rugapoi = _require4.rugapoi,
    rugaapi = _require4.rugaapi;

var _require5 = require('./utils'),
    msgFilter = _require5.msgFilter,
    color = _require5.color,
    processTime = _require5.processTime,
    isUrl = _require5.isUrl;

var options = require('./utils/options');

var _require6 = require('./utils/fetcher'),
    uploadImages = _require6.uploadImages;

var _JSON$parse = JSON.parse(fs.readFileSync('./settings/setting.json')),
    ownerNumber = _JSON$parse.ownerNumber,
    groupLimit = _JSON$parse.groupLimit,
    memberLimit = _JSON$parse.memberLimit,
    prefix = _JSON$parse.prefix;

var _JSON$parse2 = JSON.parse(fs.readFileSync('./settings/api.json')),
    apiNoBg = _JSON$parse2.apiNoBg,
    apiSimi = _JSON$parse2.apiSimi;

var start = function start() {
  var cabe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Client();
  console.log(color(figlet.textSync('----------------', {
    horizontalLayout: 'default'
  })));
  console.log(color(figlet.textSync('CABEBOT', {
    font: 'Ghost',
    horizontalLayout: 'default'
  })));
  console.log(color(figlet.textSync('----------------', {
    horizontalLayout: 'default'
  })));
  console.log(color('[DEV]'), color('CABE', 'yellow'));
  console.log(color('[~>>]'), color('BOT iniciado!', 'green')); // cuando el bot es invitado al grupo

  cabe.onStateChanged(function (state) {
    console.log(color('[~>>]', 'red'), state);
    if (state === 'CONFLICT' || state === 'UNLAUNCHED') cabe.forceRefocus();
  }); // // cuando el bot es invitado al grupo

  cabe.onAddedToGroup(function _callee2(chat) {
    var groups;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 2:
            groups = _context2.sent;

            if (!(groups.length > groupLimit)) {
              _context2.next = 8;
              break;
            }

            _context2.next = 6;
            return regeneratorRuntime.awrap(cabe.sendText(chat.id, "Lo sentimos, el grupo de este bot est\xE1 completo\nEl grupo m\xE1ximo es: ".concat(groupLimit)).then(function () {
              cabe.leaveGroup(chat.id);
              cabe.deleteChat(chat.id);
            }));

          case 6:
            _context2.next = 15;
            break;

          case 8:
            if (!(chat.groupMetadata.participants.length < memberLimit)) {
              _context2.next = 13;
              break;
            }

            _context2.next = 11;
            return regeneratorRuntime.awrap(cabe.sendText(chat.id, "Lo siento, CABE-BOT se sale si los miembros del grupo no exceden ".concat(memberLimit, " personas")).then(function () {
              cabe.leaveGroup(chat.id);
              cabe.deleteChat(chat.id);
            }));

          case 11:
            _context2.next = 15;
            break;

          case 13:
            _context2.next = 15;
            return regeneratorRuntime.awrap(cabe.simulateTyping(chat.id, true).then(function _callee() {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return regeneratorRuntime.awrap(cabe.sendText(chat.id, "Hola, soy CABE BOT. Un bot que les facilitara la vida, para ver los comandos de este bot escribe un mensaje con la palabra ".concat(prefix, "menu\nY para que sepas mas de mi te dejo mi IG: https://www.instagram.com/cabe.gus/")));

                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            }));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    });
  }); // ketika seseorang masuk/keluar dari group

  cabe.onGlobalParicipantsChanged(function _callee3(event) {
    var host;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(cabe.getHostNumber());

          case 2:
            _context3.t0 = _context3.sent;
            host = _context3.t0 + '@c.us';

            if (!(event.action === 'add' || event.action == 'invite')) {
              _context3.next = 7;
              break;
            }

            _context3.next = 7;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(event.chat, "Hola bienvenid@ al grupo @".concat(event.who.replace('@c.us', ''), " \n\nDivi\xE9rtete con nosotros\u2728")));

          case 7:
            if (!(event.action === 'remove' || event.action == 'leave')) {
              _context3.next = 10;
              break;
            }

            _context3.next = 10;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(event.chat, "Adi\xF3s @".concat(event.who.replace('@c.us', ''), ", Te echaremos de menos\u2728")));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
  cabe.onIncomingCall(function _callee5(callData) {
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(cabe.sendText(callData.peerJid, 'Lo siento, no puedo recibir llamadas de\n\nnadie soy un bot').then(function _callee4() {
              return regeneratorRuntime.async(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return regeneratorRuntime.awrap(cabe.contactBlock(callData.peerJid));

                    case 2:
                    case "end":
                      return _context4.stop();
                  }
                }
              });
            }));

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    });
  }); // ketika seseorang mengirim pesan

  cabe.onMessage(function _callee15(message) {
    var type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList, body, name, formattedTitle, pushname, verifiedName, formattedName, botNumber, groupId, groupAdmins, isGroupAdmins, isBotGroupAdmins, isOwnerBot, isBanned, command, arg, args, isCmd, uaOverride, url, isQuotedImage, isQuotedVideo, linkgrup, islink, chekgrup, cgrup, encryptMedia, _mimetype, _mediaData, _imageBase, mediaData, imageBase64, base64img, outFile, result, filename, isGiphy, isMediaGiphy, getGiphyCode, giphyCode, smallGifUrl, gifUrl, _smallGifUrl, top, bottom, _encryptMedia, _mediaData2, getUrl, ImageBase64, qmaker, quotes, author, theme, hasilqmaker, nulisq, nulisp, instag, mp3, mp4, resq, resp, googleQuery, gimgg, gamb, gimg, gimg2, inxx, quotex, randmeme, cariwall, hasilwall, carireddit, hasilreddit, cariresep, hasilresep, igstalk, igstalkpict, query_, wiki, chordq, chordp, scrinshit, _fetch, imgBS4, kurirs, ttsGB, dataText, quoteText, shortlink, i, groupMem, hehex, _i, loadedMsg, chatIds, groups, isOwner, allMem, _i2, xnxx, _i3, msg, chatz, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, idk, cvk, allChatz, allGroupz, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, gclist, allChatx, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, dchat;

    return regeneratorRuntime.async(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            cabe.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
            .then(function (msg) {
              if (msg >= 3000) {
                console.log('[cabe]', color("Alcance de mensaje cargado ".concat(msg, ", cortando la cach\xE9 de mensajes..."), 'yellow'));
                cabe.cutMsgCache();
              }
            }); //Message

            _context15.prev = 1;
            type = message.type, id = message.id, from = message.from, t = message.t, sender = message.sender, isGroupMsg = message.isGroupMsg, chat = message.chat, caption = message.caption, isMedia = message.isMedia, mimetype = message.mimetype, quotedMsg = message.quotedMsg, quotedMsgObj = message.quotedMsgObj, mentionedJidList = message.mentionedJidList;
            body = message.body;
            name = chat.name, formattedTitle = chat.formattedTitle;
            pushname = sender.pushname, verifiedName = sender.verifiedName, formattedName = sender.formattedName;
            pushname = pushname || verifiedName || formattedName; // verifiedName is the name of someone who uses a business account

            _context15.next = 9;
            return regeneratorRuntime.awrap(cabe.getHostNumber());

          case 9:
            _context15.t0 = _context15.sent;
            botNumber = _context15.t0 + '@c.us';
            groupId = isGroupMsg ? chat.groupMetadata.id : '';

            if (!isGroupMsg) {
              _context15.next = 18;
              break;
            }

            _context15.next = 15;
            return regeneratorRuntime.awrap(cabe.getGroupAdmins(groupId));

          case 15:
            _context15.t1 = _context15.sent;
            _context15.next = 19;
            break;

          case 18:
            _context15.t1 = '';

          case 19:
            groupAdmins = _context15.t1;
            isGroupAdmins = groupAdmins.includes(sender.id) || false;
            isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
            isOwnerBot = ownerNumber == sender.id;
            isBanned = banned.includes(sender.id); // Bot Prefix

            body = type === 'chat' && body.startsWith(prefix) ? body : (type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix) ? caption : '';
            command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
            arg = body.trim().substring(body.indexOf(' ') + 1);
            args = body.trim().split(/ +/).slice(1);
            isCmd = body.startsWith(prefix);
            uaOverride = process.env.UserAgent;
            url = args.length !== 0 ? args[0] : '';
            isQuotedImage = quotedMsg && quotedMsg.type === 'image';
            isQuotedVideo = quotedMsg && quotedMsg.type === 'video'; // [BETA] Avoid Spam Message

            if (!(isCmd && msgFilter.isFiltered(from) && !isGroupMsg)) {
              _context15.next = 35;
              break;
            }

            return _context15.abrupt("return", console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname)));

          case 35:
            if (!(isCmd && msgFilter.isFiltered(from) && isGroupMsg)) {
              _context15.next = 37;
              break;
            }

            return _context15.abrupt("return", console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname), 'en', color(name || formattedTitle)));

          case 37:
            if (isCmd) {
              _context15.next = 39;
              break;
            }

            return _context15.abrupt("return");

          case 39:
            if (isCmd && !isGroupMsg) {
              console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname));
            }

            if (isCmd && isGroupMsg) {
              console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname), 'en', color(name || formattedTitle));
            } // [BETA] Avoid Spam Message


            msgFilter.addFilter(from);

            if (!isBanned) {
              _context15.next = 44;
              break;
            }

            return _context15.abrupt("return", console.log(color('[BAN]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname)));

          case 44:
            _context15.t2 = command;
            _context15.next = _context15.t2 === 'velocidad' ? 47 : _context15.t2 === 'ping' ? 47 : _context15.t2 === 'tnc' ? 50 : _context15.t2 === 'menu' ? 53 : _context15.t2 === 'help' ? 53 : _context15.t2 === 'menuadmin' ? 56 : _context15.t2 === 'donar' ? 63 : _context15.t2 === 'donar' ? 63 : _context15.t2 === 'TR' ? 66 : _context15.t2 === 'propietario del bot' ? 69 : _context15.t2 === 'join' ? 72 : _context15.t2 === 'sticker' ? 96 : _context15.t2 === 'stiker' ? 96 : _context15.t2 === 'stickergif' ? 141 : _context15.t2 === 'stikergif' ? 141 : _context15.t2 === 'stikergiphy' ? 159 : _context15.t2 === 'stickergiphy' ? 159 : _context15.t2 === 'meme' ? 183 : _context15.t2 === 'quotemaker' ? 202 : _context15.t2 === 'escribir' ? 222 : _context15.t2 === 'nulis' ? 222 : _context15.t2 === 'instagram' ? 231 : _context15.t2 === 'tiktok' ? 239 : _context15.t2 === 'twt' ? 247 : _context15.t2 === 'twitter' ? 247 : _context15.t2 === 'fb' ? 255 : _context15.t2 === 'facebook' ? 255 : _context15.t2 === 'ytmp3' ? 263 : _context15.t2 === 'ytmp4' ? 271 : _context15.t2 === 'xnxx' ? 279 : _context15.t2 === 'google' ? 313 : _context15.t2 === 'googleimage' ? 323 : _context15.t2 === 'nsfw' ? 348 : _context15.t2 === 'simisimi' ? 356 : _context15.t2 === 'simi' ? 360 : _context15.t2 === 'fakta' ? 368 : _context15.t2 === 'katabijak' ? 370 : _context15.t2 === 'pantun' ? 372 : _context15.t2 === 'quote' ? 374 : _context15.t2 === 'anime' ? 380 : _context15.t2 === 'kpop' ? 384 : _context15.t2 === 'memes' ? 388 : _context15.t2 === 'imagen' ? 393 : _context15.t2 === 'images' ? 393 : _context15.t2 === 'sreddit' ? 401 : _context15.t2 === 'resep' ? 409 : _context15.t2 === 'nekopoi' ? 417 : _context15.t2 === 'stalkig' ? 420 : _context15.t2 === 'wiki' ? 431 : _context15.t2 === 'acorde' ? 439 : _context15.t2 === 'ss' ? 448 : _context15.t2 === 'play' ? 456 : _context15.t2 === 'whatanime' ? 460 : _context15.t2 === 'cersex' ? 478 : _context15.t2 === 'resi' ? 480 : _context15.t2 === 'tts' ? 488 : _context15.t2 === 'translate' ? 496 : _context15.t2 === 'shortlink' ? 503 : _context15.t2 === 'agregar' ? 513 : _context15.t2 === 'eliminar' ? 530 : _context15.t2 === 'promover' ? 556 : _context15.t2 === 'degradar' ? 577 : _context15.t2 === 'bye' ? 598 : _context15.t2 === 'borrar' ? 604 : _context15.t2 === 'lista' ? 612 : _context15.t2 === 'lista' ? 612 : _context15.t2 === 'botstat' ? 625 : _context15.t2 === 'kickall' ? 636 : _context15.t2 === 'ban' ? 658 : _context15.t2 === 'bc' ? 664 : _context15.t2 === 'leaveall' ? 703 : _context15.t2 === 'clearall' ? 743 : 776;
            break;

          case 47:
            _context15.next = 49;
            return regeneratorRuntime.awrap(cabe.sendText(from, "Pong!!!!\nvelocidad: ".concat(processTime(t, moment()), " _Segundos_")));

          case 49:
            return _context15.abrupt("break", 778);

          case 50:
            _context15.next = 52;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textTnC()));

          case 52:
            return _context15.abrupt("break", 778);

          case 53:
            _context15.next = 55;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textMenu(pushname)).then(function () {
              return isGroupMsg && isGroupAdmins ? cabe.sendText(from, "Men\xFA de admins del grupo: *".concat(prefix, "menuadmin*")) : null;
            }));

          case 55:
            return _context15.abrupt("break", 778);

          case 56:
            if (isGroupMsg) {
              _context15.next = 58;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 58:
            if (isGroupAdmins) {
              _context15.next = 60;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 60:
            _context15.next = 62;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textAdmin()));

          case 62:
            return _context15.abrupt("break", 778);

          case 63:
            _context15.next = 65;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textDonasi()));

          case 65:
            return _context15.abrupt("break", 778);

          case 66:
            _context15.next = 68;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.TR()));

          case 68:
            return _context15.abrupt("break", 778);

          case 69:
            _context15.next = 71;
            return regeneratorRuntime.awrap(cabe.sendContact(from, ownerNumber).then(function () {
              return cabe.sedText(from, 'Si desea donar lo puede hacer por PayPal https://www.paypal.com/paypalme/cabegus?locale.x=es_XC!');
            }));

          case 71:
            return _context15.abrupt("break", 778);

          case 72:
            if (!(args.length == 0)) {
              _context15.next = 74;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Si desea invitar al bot al grupo, inv\xEDtelo o escriba ".concat(prefix, "join [link del grupo]"), id));

          case 74:
            linkgrup = body.slice(6);
            islink = linkgrup.match(/(https:\/\/chat.whatsapp.com)/gi);
            _context15.next = 78;
            return regeneratorRuntime.awrap(cabe.inviteInfo(linkgrup));

          case 78:
            chekgrup = _context15.sent;

            if (islink) {
              _context15.next = 81;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo siento, el enlace del grupo es incorrecto, enviar el enlace correcto', id));

          case 81:
            if (!isOwnerBot) {
              _context15.next = 86;
              break;
            }

            _context15.next = 84;
            return regeneratorRuntime.awrap(cabe.joinGroupViaLink(linkgrup).then(function _callee6() {
              return regeneratorRuntime.async(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.next = 2;
                      return regeneratorRuntime.awrap(cabe.sendText(from, 'Se unió al grupo con éxito a través del enlace!'));

                    case 2:
                      _context6.next = 4;
                      return regeneratorRuntime.awrap(cabe.sendText(chekgrup.id, "Hola, soy CABE-BOT. Para averiguar los comandos de este tipo de bot escriba".concat(prefix, "menu")));

                    case 4:
                    case "end":
                      return _context6.stop();
                  }
                }
              });
            }));

          case 84:
            _context15.next = 95;
            break;

          case 86:
            _context15.next = 88;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 88:
            cgrup = _context15.sent;

            if (!(cgrup.length > groupLimit)) {
              _context15.next = 91;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo siento, el grupo de este bot est\xE1 completo\nEl grupo m\xE1ximo es: ".concat(groupLimit), id));

          case 91:
            if (!(cgrup.size < memberLimit)) {
              _context15.next = 93;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo siento, CABE-BOT no se unir\xE1 si los miembros del grupo no superan las".concat(memberLimit, " personas"), id));

          case 93:
            _context15.next = 95;
            return regeneratorRuntime.awrap(cabe.joinGroupViaLink(linkgrup).then(function _callee7() {
              return regeneratorRuntime.async(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.next = 2;
                      return regeneratorRuntime.awrap(cabe.reply(from, 'Se unió al grupo con éxito a través del enlace!', id));

                    case 2:
                    case "end":
                      return _context7.stop();
                  }
                }
              });
            })["catch"](function () {
              cabe.reply(from, 'Ha fallado!', id);
            }));

          case 95:
            return _context15.abrupt("break", 778);

          case 96:
            if (!((isMedia || isQuotedImage) && args.length === 0)) {
              _context15.next = 106;
              break;
            }

            encryptMedia = isQuotedImage ? quotedMsg : message;
            _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype;
            _context15.next = 101;
            return regeneratorRuntime.awrap(decryptMedia(encryptMedia, uaOverride));

          case 101:
            _mediaData = _context15.sent;
            _imageBase = "data:".concat(_mimetype, ";base64,").concat(_mediaData.toString('base64'));
            cabe.sendImageAsSticker(from, _imageBase).then(function () {
              cabe.reply(from, 'Aqui esta tu sticker(si el sticker sale mal, intentar recortarlo he intentar de nuevo)');
              console.log("Sticker procesado por ".concat(processTime(t, moment()), " Segundo"));
            });
            _context15.next = 140;
            break;

          case 106:
            if (!(args[0] === 'nobg')) {
              _context15.next = 131;
              break;
            }

            if (!(isMedia || isQuotedImage)) {
              _context15.next = 129;
              break;
            }

            _context15.prev = 108;
            _context15.next = 111;
            return regeneratorRuntime.awrap(decryptMedia(message, uaOverride));

          case 111:
            mediaData = _context15.sent;
            imageBase64 = "data:".concat(mimetype, ";base64,").concat(mediaData.toString('base64'));
            base64img = imageBase64;
            outFile = './media/noBg.png'; // kamu dapat mengambil api key dari website remove.bg dan ubahnya difolder settings/api.json

            _context15.next = 117;
            return regeneratorRuntime.awrap(removeBackgroundFromImageBase64({
              base64img: base64img,
              apiKey: apiNoBg,
              size: 'auto',
              type: 'auto',
              outFile: outFile
            }));

          case 117:
            result = _context15.sent;
            _context15.next = 120;
            return regeneratorRuntime.awrap(fs.writeFile(outFile, result.base64img));

          case 120:
            _context15.next = 122;
            return regeneratorRuntime.awrap(cabe.sendImageAsSticker(from, "data:".concat(mimetype, ";base64,").concat(result.base64img)));

          case 122:
            _context15.next = 129;
            break;

          case 124:
            _context15.prev = 124;
            _context15.t3 = _context15["catch"](108);
            console.log(_context15.t3);
            _context15.next = 129;
            return regeneratorRuntime.awrap(cabe.reply(from, 'lo siento, el límite de uso de hoy es máximo', id));

          case 129:
            _context15.next = 140;
            break;

          case 131:
            if (!(args.length === 1)) {
              _context15.next = 138;
              break;
            }

            if (isUrl(url)) {
              _context15.next = 135;
              break;
            }

            _context15.next = 135;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el enlace que envió no es válido.', id));

          case 135:
            cabe.sendStickerfromUrl(from, url).then(function (r) {
              return !r && r !== undefined ? cabe.sendText(from, 'Lo sentimos, el enlace que envió no contiene una imagen.') : cabe.reply(from, 'Aqui esta tu sticker');
            }).then(function () {
              return console.log("Sticker Procesado por ".concat(processTime(t, moment()), " Segundo"));
            });
            _context15.next = 140;
            break;

          case 138:
            _context15.next = 140;
            return regeneratorRuntime.awrap(cabe.reply(from, "\xA1Sin imagen! Usar ".concat(prefix, "sticker\n\n\nEnviar im\xE1genes con subt\xEDtulos\n").concat(prefix, "sticker <usual>\n").concat(prefix, "sticker nobg <sin fondo>\n\n o enviar mensaje con\n").concat(prefix, "sticker <link>"), id));

          case 140:
            return _context15.abrupt("break", 778);

          case 141:
            if (!(isMedia || isQuotedVideo)) {
              _context15.next = 157;
              break;
            }

            if (!(mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10)) {
              _context15.next = 154;
              break;
            }

            _context15.next = 145;
            return regeneratorRuntime.awrap(decryptMedia(message, uaOverride));

          case 145:
            mediaData = _context15.sent;
            cabe.reply(from, '[ESPERAR] En curso⏳ espere ± 1 min.', id);
            filename = "./media/stickergif.".concat(mimetype.split('/')[1]);
            _context15.next = 150;
            return regeneratorRuntime.awrap(fs.writeFileSync(filename, mediaData));

          case 150:
            _context15.next = 152;
            return regeneratorRuntime.awrap(exec("gify ".concat(filename, " ./media/stickergf.gif --fps=30 --scale=240:240"), function _callee8(error, stdout, stderr) {
              var gif;
              return regeneratorRuntime.async(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      _context8.next = 2;
                      return regeneratorRuntime.awrap(fs.readFileSync('./media/stickergf.gif', {
                        encoding: "base64"
                      }));

                    case 2:
                      gif = _context8.sent;
                      _context8.next = 5;
                      return regeneratorRuntime.awrap(cabe.sendImageAsSticker(from, "data:image/gif;base64,".concat(gif.toString('base64'))));

                    case 5:
                    case "end":
                      return _context8.stop();
                  }
                }
              });
            }));

          case 152:
            _context15.next = 155;
            break;

          case 154:
            cabe.reply(from, "[\u2757] Enviar un gif con el t\xEDtulo *".concat(prefix, "stickergif* max 10 seg!"), id);

          case 155:
            _context15.next = 158;
            break;

          case 157:
            cabe.reply(from, "[\u2757] Enviar un gif con el titulo *".concat(prefix, "stickergif*"), id);

          case 158:
            return _context15.abrupt("break", 778);

          case 159:
            if (!(args.length !== 1)) {
              _context15.next = 161;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto. \nescribe el mensaje con".concat(prefix, "stickergiphy <link de giphy https://giphy.com/>"), id));

          case 161:
            isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'));
            isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'));

            if (!isGiphy) {
              _context15.next = 172;
              break;
            }

            getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'));

            if (getGiphyCode) {
              _context15.next = 167;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'No se pudo recuperar el código giphy', id));

          case 167:
            giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '');
            smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif';
            cabe.sendGiphyAsSticker(from, smallGifUrl).then(function () {
              cabe.reply(from, 'Aqui esta tu sticker');
              console.log("Sticker Procesado por ".concat(processTime(t, moment()), " Segundo"));
            })["catch"](function (err) {
              return console.log(err);
            });
            _context15.next = 182;
            break;

          case 172:
            if (!isMediaGiphy) {
              _context15.next = 180;
              break;
            }

            gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'));

            if (gifUrl) {
              _context15.next = 176;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'No se pudo recuperar el código giphy', id));

          case 176:
            _smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif');
            cabe.sendGiphyAsSticker(from, _smallGifUrl).then(function () {
              cabe.reply(from, 'Aqui esta tu sticker');
              console.log("Sticker Procesado ".concat(processTime(t, moment()), " Segundo"));
            })["catch"](function (err) {
              return console.log(err);
            });
            _context15.next = 182;
            break;

          case 180:
            _context15.next = 182;
            return regeneratorRuntime.awrap(cabe.reply(from, 'lo siento, los comandos de la etiqueta giphy solo pueden usar enlaces de giphy.  [Solo Giphy]', id));

          case 182:
            return _context15.abrupt("break", 778);

          case 183:
            if (!((isMedia || isQuotedImage) && args.length >= 2)) {
              _context15.next = 199;
              break;
            }

            top = arg.split('|')[0];
            bottom = arg.split('|')[1];
            _encryptMedia = isQuotedImage ? quotedMsg : message;
            _context15.next = 189;
            return regeneratorRuntime.awrap(decryptMedia(_encryptMedia, uaOverride));

          case 189:
            _mediaData2 = _context15.sent;
            _context15.next = 192;
            return regeneratorRuntime.awrap(uploadImages(_mediaData2, false));

          case 192:
            getUrl = _context15.sent;
            _context15.next = 195;
            return regeneratorRuntime.awrap(meme.custom(getUrl, top, bottom));

          case 195:
            ImageBase64 = _context15.sent;
            cabe.sendFile(from, ImageBase64, 'image.png', '', null, true).then(function (serialized) {
              return console.log("Env\xEDo exitoso de archivos con ID: ".concat(serialized, " procesada durante ").concat(processTime(t, moment())));
            })["catch"](function (err) {
              return console.error(err);
            });
            _context15.next = 201;
            break;

          case 199:
            _context15.next = 201;
            return regeneratorRuntime.awrap(cabe.reply(from, "\xA1Sin imagen! Env\xEDe una imagen con la descripcion. ".concat(prefix, "meme <texto superior> | <texto abajo>\nejemplo: ").concat(prefix, "meme texto superior | texto de abajo "), id));

          case 201:
            return _context15.abrupt("break", 778);

          case 202:
            qmaker = body.trim().split('|');

            if (!(qmaker.length >= 3)) {
              _context15.next = 220;
              break;
            }

            quotes = qmaker[1];
            author = qmaker[2];
            theme = qmaker[3];
            cabe.reply(from, 'versos como', id);
            _context15.prev = 208;
            _context15.next = 211;
            return regeneratorRuntime.awrap(images.quote(quotes, author, theme));

          case 211:
            hasilqmaker = _context15.sent;
            cabe.sendFileFromUrl(from, "".concat(hasilqmaker), '', 'Este es hermano ...', id);
            _context15.next = 218;
            break;

          case 215:
            _context15.prev = 215;
            _context15.t4 = _context15["catch"](208);
            cabe.reply('bueno, el proceso falló, hermano, el contenido es correcto, ¿no?..', id);

          case 218:
            _context15.next = 221;
            break;

          case 220:
            cabe.reply(from, "Usar ".concat(prefix, "quotemaker |cita de isi|autor|tema \n\n ejemplo: ").concat(prefix, "quotemaker |Te amo|CabeBot|aleatorio \n\n para el tema usar random s\xED hermano.."));

          case 221:
            return _context15.abrupt("break", 778);

          case 222:
            if (!(args.length == 0)) {
              _context15.next = 224;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Haz que el bot escriba el texto que se env\xEDa como imagen\nUilizar: ".concat(prefix, "escribir [texto]\n\nEjemplo: ").concat(prefix, "escribir hola me llamo Cabebot y mi version es 1.2"), id));

          case 224:
            nulisq = body.slice(7);
            _context15.next = 227;
            return regeneratorRuntime.awrap(rugaapi.tulis(nulisq));

          case 227:
            nulisp = _context15.sent;
            _context15.next = 230;
            return regeneratorRuntime.awrap(cabe.sendImage(from, "".concat(nulisp), '', 'Aqui esta tu texto', id)["catch"](function () {
              cabe.reply(from, '¡Hay un Error!', id);
            }));

          case 230:
            return _context15.abrupt("break", 778);

          case 231:
            if (!(args.length == 0)) {
              _context15.next = 233;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para descargar im\xE1genes o videos de instagram \n escriba: ".concat(prefix, "instagram [link_ig]"), id));

          case 233:
            _context15.next = 235;
            return regeneratorRuntime.awrap(rugaapi.insta(args[0]));

          case 235:
            instag = _context15.sent;
            _context15.next = 238;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, instag, '', '', id));

          case 238:
            return _context15.abrupt("break", 778);

          case 239:
            if (!(args.length !== 1)) {
              _context15.next = 241;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id));

          case 241:
            if (!(!is.Url(url) && !url.includes('tiktok.com'))) {
              _context15.next = 243;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el enlace que envió no es válido. [Enlace no válido]', id));

          case 243:
            _context15.next = 245;
            return regeneratorRuntime.awrap(cabe.reply(from, "_Extracci\xF3n de metadatos ..._ \n\n".concat(menuId.textDonasi()), id));

          case 245:
            downloader.tiktok(url).then(function _callee9(videoMeta) {
              var filename, caps;
              return regeneratorRuntime.async(function _callee9$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      filename = videoMeta.authorMeta.name + '.mp4';
                      caps = "*Metadata:*\nUsername: ".concat(videoMeta.authorMeta.name, " \nMusic: ").concat(videoMeta.musicMeta.musicName, " \nView: ").concat(videoMeta.playCount.toLocaleString(), " \nLike: ").concat(videoMeta.diggCount.toLocaleString(), " \nComment: ").concat(videoMeta.commentCount.toLocaleString(), " \nShare: ").concat(videoMeta.shareCount.toLocaleString(), " \nCaption: ").concat(videoMeta.text.trim() ? videoMeta.text : '-');
                      _context9.next = 4;
                      return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : "\u26A0 Los videos sin marca de agua no est\xE1n disponibles. \n\n".concat(caps), '', {
                        headers: {
                          'User-Agent': 'okhttp/4.5.0',
                          referer: 'https://www.tiktok.com/'
                        }
                      }, true).then(function (serialized) {
                        return console.log("SEnv\xEDo exitoso de archivos con id: ".concat(serialized, " procesado durante").concat(processTime(t, moment())));
                      })["catch"](function (err) {
                        return console.error(err);
                      }));

                    case 4:
                    case "end":
                      return _context9.stop();
                  }
                }
              });
            })["catch"](function () {
              return cabe.reply(from, 'No se pudieron recuperar los metadatos, el vínculo que envió no es válido. [Enlace no válido]', id);
            });
            return _context15.abrupt("break", 778);

          case 247:
            if (!(args.length !== 1)) {
              _context15.next = 249;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id));

          case 249:
            if (!(!is.Url(url) || !url.includes('twitter.com') || url.includes('t.co'))) {
              _context15.next = 251;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, la URL que envió no es válida. [Enlace no válido]', id));

          case 251:
            _context15.next = 253;
            return regeneratorRuntime.awrap(cabe.reply(from, "_Scraping Metadata..._ \n\n".concat(menuId.textDonasi()), id));

          case 253:
            downloader.tweet(url).then(function _callee10(data) {
              var content, _result, i;

              return regeneratorRuntime.async(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      if (!(data.type === 'video')) {
                        _context10.next = 10;
                        break;
                      }

                      content = data.variants.filter(function (x) {
                        return x.content_type !== 'application/x-mpegURL';
                      }).sort(function (a, b) {
                        return b.bitrate - a.bitrate;
                      });
                      _context10.next = 4;
                      return regeneratorRuntime.awrap(urlShortener(content[0].url));

                    case 4:
                      _result = _context10.sent;
                      console.log('Shortlink: ' + _result);
                      _context10.next = 8;
                      return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, content[0].url, 'video.mp4', "Link de descarga ".concat(_result, " \n\nProcesado por ").concat(processTime(t, moment()), " _segundos"), null, null, true).then(function (serialized) {
                        return console.log("Env\xEDo exitoso de archivos con id: ".concat(serialized, " procesado durante ").concat(processTime(t, moment())));
                      })["catch"](function (err) {
                        return console.error(err);
                      }));

                    case 8:
                      _context10.next = 18;
                      break;

                    case 10:
                      if (!(data.type === 'photo')) {
                        _context10.next = 18;
                        break;
                      }

                      i = 0;

                    case 12:
                      if (!(i < data.variants.length)) {
                        _context10.next = 18;
                        break;
                      }

                      _context10.next = 15;
                      return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, data.variants[i], data.variants[i].split('/media/')[1], '', null, null, true).then(function (serialized) {
                        return console.log("Env\xEDo exitoso de archivos con id: ".concat(serialized, " procesado durante ").concat(processTime(t, moment())));
                      })["catch"](function (err) {
                        return console.error(err);
                      }));

                    case 15:
                      i++;
                      _context10.next = 12;
                      break;

                    case 18:
                    case "end":
                      return _context10.stop();
                  }
                }
              });
            })["catch"](function () {
              return cabe.sendText(from, 'Lo sentimos, el enlace no es válido o no hay medios en el enlace que envió. [Enlace no válido]');
            });
            return _context15.abrupt("break", 778);

          case 255:
            if (!(args.length !== 1)) {
              _context15.next = 257;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id));

          case 257:
            if (!(!is.Url(url) && !url.includes('facebook.com'))) {
              _context15.next = 259;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, la URL que envió no es válida. [Enlace no válido]', id));

          case 259:
            _context15.next = 261;
            return regeneratorRuntime.awrap(cabe.reply(from, '_Extracción de metadatos..._ \n\nGracias por usar este bot', id));

          case 261:
            downloader.facebook(url).then(function _callee11(videoMeta) {
              var title, thumbnail, links, shorts, i, shortener, link, caption;
              return regeneratorRuntime.async(function _callee11$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      title = videoMeta.response.title;
                      thumbnail = videoMeta.response.thumbnail;
                      links = videoMeta.response.links;
                      shorts = [];
                      i = 0;

                    case 5:
                      if (!(i < links.length)) {
                        _context11.next = 15;
                        break;
                      }

                      _context11.next = 8;
                      return regeneratorRuntime.awrap(urlShortener(links[i].url));

                    case 8:
                      shortener = _context11.sent;
                      console.log('Shortlink: ' + shortener);
                      links[i]["short"] = shortener;
                      shorts.push(links[i]);

                    case 12:
                      i++;
                      _context11.next = 5;
                      break;

                    case 15:
                      link = shorts.map(function (x) {
                        return "".concat(x.resolution, " Quality: ").concat(x["short"]);
                      });
                      caption = "Text: ".concat(title, " \n\nLink de descarga: \n").concat(link.join('\n'), " \n\nProcesado por ").concat(processTime(t, moment()), " _Segundos_");
                      _context11.next = 19;
                      return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, thumbnail, 'videos.jpg', caption, null, null, true).then(function (serialized) {
                        return console.log("Env\xEDo exitoso de archivos con ID:".concat(serialized, " procesado durante").concat(processTime(t, moment())));
                      })["catch"](function (err) {
                        return console.error(err);
                      }));

                    case 19:
                    case "end":
                      return _context11.stop();
                  }
                }
              });
            })["catch"](function (err) {
              return cabe.reply(from, "Error, la URL no es v\xE1lida o el video no se carga. [Enlace no v\xE1lido o sin v\xEDdeo] \n\n".concat(err), id);
            });
            return _context15.abrupt("break", 778);

          case 263:
            if (!(args.length == 0)) {
              _context15.next = 265;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para descargar canciones de youtube \n escriba: ".concat(prefix, "ytmp3 [link_yt]"), id));

          case 265:
            _context15.next = 267;
            return regeneratorRuntime.awrap(rugaapi.ytmp3(args[0]));

          case 267:
            mp3 = _context15.sent;
            _context15.next = 270;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, mp3, '', '', id));

          case 270:
            return _context15.abrupt("break", 778);

          case 271:
            if (!(args.length == 0)) {
              _context15.next = 273;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para descargar videos de youtube \n escriba: ".concat(prefix, "ytmp4 [link_yt]")));

          case 273:
            _context15.next = 275;
            return regeneratorRuntime.awrap(rugaapi.ytmp4(args[0]));

          case 275:
            mp4 = _context15.sent;
            _context15.next = 278;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, mp4, '', '', id));

          case 278:
            return _context15.abrupt("break", 778);

          case 279:
            if (isNsfw) {
              _context15.next = 281;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'comando / comando NSFW no activado en este grupo!', id));

          case 281:
            if (!isLimit(serial)) {
              _context15.next = 283;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo siento ".concat(pushname, ", Su l\xEDmite de cuota se ha agotado, escriba #limit para verificar su l\xEDmite de cuota"), id));

          case 283:
            _context15.next = 285;
            return regeneratorRuntime.awrap(limitAdd(serial));

          case 285:
            if (!(args.length === 1)) {
              _context15.next = 287;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Enviar comando *#xnxx [linkXnxx]*, por ejemplo, envíe el comando *#readme*'));

          case 287:
            if (!(!args[1].match(isUrl) && !args[1].includes('xnxx.com'))) {
              _context15.next = 289;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, mess.error.Iv, id));

          case 289:
            _context15.prev = 289;
            cabe.reply(from, mess.wait, id);
            _context15.next = 293;
            return regeneratorRuntime.awrap(axios.get('https://mhankbarbar.herokuapp.com/api/xnxx?url=' + args[1] + '&apiKey=' + barbarkey));

          case 293:
            resq = _context15.sent;
            resp = resq.data;

            if (!resp.error) {
              _context15.next = 299;
              break;
            }

            cabe.reply(from, ytvv.error, id);
            _context15.next = 304;
            break;

          case 299:
            if (!(Number(resp.result.size.split(' MB')[0]) > 20.00)) {
              _context15.next = 301;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Maaf durasi video sudah melebihi batas maksimal 20 menit!', id));

          case 301:
            cabe.sendFileFromUrl(from, resp.result.thumb, 'thumb.jpg', "\u27B8 *Judul* : ".concat(resp.result.judul, "\n\u27B8 *Deskripsi* : ").concat(resp.result.desc, "\n\u27B8 *Filesize* : ").concat(resp.result.size, "\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit."), id);
            _context15.next = 304;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, resp.result.vid, "".concat(resp.result.title, ".mp4"), '', id));

          case 304:
            _context15.next = 312;
            break;

          case 306:
            _context15.prev = 306;
            _context15.t5 = _context15["catch"](289);
            console.log(_context15.t5);
            _context15.next = 311;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Video tidak ditemukan'));

          case 311:
            cabe.sendText(ownerNumber, 'Xnxx Error : ' + _context15.t5);

          case 312:
            return _context15.abrupt("break", 778);

          case 313:
            if (!isLimit(serial)) {
              _context15.next = 315;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Maaf ".concat(pushname, ", Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu"), id));

          case 315:
            _context15.next = 317;
            return regeneratorRuntime.awrap(limitAdd(serial));

          case 317:
            cabe.reply(from, mess.wait, id);
            googleQuery = body.slice(8);

            if (!(googleQuery == undefined || googleQuery == ' ')) {
              _context15.next = 321;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "*Hasil Pencarian : ".concat(googleQuery, "* tidak ditemukan"), id));

          case 321:
            google({
              'query': googleQuery
            }).then(function (results) {
              var vars = "_*Hasil Pencarian : ".concat(googleQuery, "*_\n");

              for (var i = 0; i < results.length; i++) {
                vars += "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\n*Judul* : ".concat(results[i].title, "\n\n*Deskripsi* : ").concat(results[i].snippet, "\n\n*Link* : ").concat(results[i].link, "\n\n");
              }

              cabe.reply(from, vars, id);
            })["catch"](function (e) {
              console.log(e);
              cabe.sendText(ownerNumber, 'Google Error : ' + e);
            });
            return _context15.abrupt("break", 778);

          case 323:
            if (!isLimit(serial)) {
              _context15.next = 325;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Maaf ".concat(pushname, ", Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu"), id));

          case 325:
            _context15.next = 327;
            return regeneratorRuntime.awrap(limitAdd(serial));

          case 327:
            if (!(args.length === 1)) {
              _context15.next = 329;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Kirim perintah *#googleimage [query]*\nContoh : *#googleimage Elaina*', id));

          case 329:
            _context15.prev = 329;
            cabe.reply(from, mess.wait, id);
            gimgg = body.slice(13);
            gamb = "https://api.vhtear.com/googleimg?query=".concat(gimgg, "&apikey=").concat(vhtearkey);
            _context15.next = 335;
            return regeneratorRuntime.awrap(axios.get(gamb));

          case 335:
            gimg = _context15.sent;
            gimg2 = Math.floor(Math.random() * gimg.data.result.result_search.length);
            console.log(gimg2);
            _context15.next = 340;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, gimg.data.result.result_search[gimg2], "gam.".concat(gimg.data.result.result_search[gimg2]), "*Google Image*\n\n*Hasil Pencarian : ".concat(gimgg, "*"), id));

          case 340:
            _context15.next = 347;
            break;

          case 342:
            _context15.prev = 342;
            _context15.t6 = _context15["catch"](329);
            console.log(_context15.t6);
            cabe.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Gambar tidak ditemukan');
            cabe.sendText(ownerNumber, 'Google Image Error : ' + _context15.t6);

          case 347:
            return _context15.abrupt("break", 778);

          case 348:
            if (isGroupMsg) {
              _context15.next = 350;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, '¡Este comando solo se puede usar en grupos!', id));

          case 350:
            if (isGroupAdmins) {
              _context15.next = 352;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, '¡Este comando solo puede ser utilizado por los admins del grupo!', id));

          case 352:
            if (!(args.length === 1)) {
              _context15.next = 354;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Seleccione habilitar o deshabilitar!', id));

          case 354:
            if (args[1].toLowerCase() === 'habilitar') {
              nsfw_.push(chat.id);
              fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_));
              cabe.reply(from, '¡El comando NSWF se ha activado con éxito en este grupo! enviar el comando *!nsfwMenu* para encontrar el menú', id);
            } else if (args[1].toLowerCase() === 'deshabilitar') {
              nsfw_.splice(chat.id, 1);
              fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_));
              cabe.reply(from, 'Comando NSFW desactivado con éxito en este grupo!', id);
            } else {
              cabe.reply(from, 'Seleccione habilitar o deshabilitar!', id);
            }

            return _context15.abrupt("break", 778);

          case 356:
            if (isGroupMsg) {
              _context15.next = 358;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id));

          case 358:
            cabe.reply(from, "Para habilitar simi-simi en el chat grupal\n\nUtilizar\n".concat(prefix, "simi on --activar\n").concat(prefix, "simi off - desactivar\n"), id);
            return _context15.abrupt("break", 778);

          case 360:
            if (isGroupMsg) {
              _context15.next = 362;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id));

          case 362:
            if (isGroupAdmins) {
              _context15.next = 364;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por los admins del grupo.', id));

          case 364:
            if (!(args.length !== 1)) {
              _context15.next = 366;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para habilitar simi-simi en el chat grupal\n\nUtilizar\n".concat(prefix, "simi on --activar\n").concat(prefix, "simi off - desactivar\n"), id));

          case 366:
            if (args[0] == 'on') {
              simi.push(chat.id);
              fs.writeFileSync('./settings/simi.json', JSON.stringify(simi));
              cabe.reply(from, '¡Activa el bot simi-simi!', id);
            } else if (args[0] == 'off') {
              inxx = simi.indexOf(chat.id);
              simi.splice(inxx, 1);
              fs.writeFileSync('./settings/simi.json', JSON.stringify(simi));
              cabe.reply(from, 'inhabilitar el bot simi-simi!', id);
            } else {
              cabe.reply(from, "Para habilitar simi-simi en el chat grupal\n\nUtilizar\n".concat(prefix, "simi on --activar\n").concat(prefix, "simi off - desactivar\n"), id);
            }

            return _context15.abrupt("break", 778);

          case 368:
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt').then(function (res) {
              return res.text();
            }).then(function (body) {
              var splitnix = body.split('\n');
              var randomnix = splitnix[Math.floor(Math.random() * splitnix.length)];
              cabe.reply(from, randomnix, id);
            });
            return _context15.abrupt("break", 778);

          case 370:
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt').then(function (res) {
              return res.text();
            }).then(function (body) {
              var splitbijak = body.split('\n');
              var randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)];
              cabe.reply(from, randombijak, id);
            });
            return _context15.abrupt("break", 778);

          case 372:
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt').then(function (res) {
              return res.text();
            }).then(function (body) {
              var splitpantun = body.split('\n');
              var randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)];
              cabe.reply(from, randompantun.replace(/cabe-line/g, "\n"), id);
            });
            return _context15.abrupt("break", 778);

          case 374:
            _context15.next = 376;
            return regeneratorRuntime.awrap(rugaapi.quote());

          case 376:
            quotex = _context15.sent;
            _context15.next = 379;
            return regeneratorRuntime.awrap(cabe.reply(from, quotex, id));

          case 379:
            return _context15.abrupt("break", 778);

          case 380:
            if (!(args.length == 0)) {
              _context15.next = 382;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Usar ".concat(prefix, "anime\nPor favor escribe: ").concat(prefix, "anime [consulta]\nejemplo: ").concat(prefix, "anime random\n\n consultas disponibles:\n random, waifu, husbu, neko"), id));

          case 382:
            if (args[0] == 'random' || args[0] == 'waifu' || args[0] == 'husbu' || args[0] == 'neko') {
              fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/' + args[0] + '.txt').then(function (res) {
                return res.text();
              }).then(function (body) {
                var randomnime = body.split('\n');
                var randomnimex = randomnime[Math.floor(Math.random() * randomnime.length)];
                cabe.sendFileFromUrl(from, randomnimex, '', 'Aqui esta', id);
              });
            } else {
              cabe.reply(from, "Lo sentimos, la consulta no est\xE1 disponible. Por favor escribe ".concat(prefix, "anime para ver la lista de consultas"));
            }

            return _context15.abrupt("break", 778);

          case 384:
            if (!(args.length == 0)) {
              _context15.next = 386;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Usar ".concat(prefix, "kpop\nPor favor escribe: ").concat(prefix, "kpop [consulta]\nEjemplos: ").concat(prefix, "kpop bts\n\nconsultas disponibles:\nblackpink, exo, bts"), id));

          case 386:
            if (args[0] == 'blackpink' || args[0] == 'exo' || args[0] == 'bts') {
              fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/' + args[0] + '.txt').then(function (res) {
                return res.text();
              }).then(function (body) {
                var randomkpop = body.split('\n');
                var randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)];
                cabe.sendFileFromUrl(from, randomkpopx, '', 'Aqui...', id);
              });
            } else {
              cabe.reply(from, "Lo sentimos, la consulta no est\xE1 disponible. Por favor escribe ".concat(prefix, "kpop para ver la lista de consultas"));
            }

            return _context15.abrupt("break", 778);

          case 388:
            _context15.next = 390;
            return regeneratorRuntime.awrap(meme.random());

          case 390:
            randmeme = _context15.sent;
            cabe.sendFileFromUrl(from, randmeme, '', '', id);
            return _context15.abrupt("break", 778);

          case 393:
            if (!(args.length == 0)) {
              _context15.next = 395;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar im\xE1genes en pinterest\nescriba: ".concat(prefix, "imagen [busqueda]\nejemplo: ").concat(prefix, "imagen naruto"), id));

          case 395:
            cariwall = body.slice(8);
            _context15.next = 398;
            return regeneratorRuntime.awrap(images.fdci(cariwall));

          case 398:
            hasilwall = _context15.sent;
            cabe.sendFileFromUrl(from, hasilwall, '', '', id);
            return _context15.abrupt("break", 778);

          case 401:
            if (!(args.length == 0)) {
              _context15.next = 403;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar im\xE1genes en sub reddit\nescriba: ".concat(prefix, "sreddit [busqueda]\nejemplo: ").concat(prefix, "sreddit naruto"), id));

          case 403:
            carireddit = body.slice(9);
            _context15.next = 406;
            return regeneratorRuntime.awrap(images.sreddit(carireddit));

          case 406:
            hasilreddit = _context15.sent;
            cabe.sendFileFromUrl(from, hasilreddit, '', '', id);
            return _context15.abrupt("break", 778);

          case 409:
            if (!(args.length == 0)) {
              _context15.next = 411;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar recetas de comida\nescribir: ".concat(prefix, "resep [busqueda]\n\nejemplo: ").concat(prefix, "resep tahu"), id));

          case 411:
            cariresep = body.slice(7);
            _context15.next = 414;
            return regeneratorRuntime.awrap(resep.resep(cariresep));

          case 414:
            hasilresep = _context15.sent;
            cabe.reply(from, hasilresep + '\n\nEsta es la receta de la comida ...', id);
            return _context15.abrupt("break", 778);

          case 417:
            cabe.sendText(from, "Buscando los \xFAltimos videos del sitio web de nekopoi ...");
            rugapoi.getLatest().then(function (result) {
              rugapoi.getVideo(result.link).then(function (res) {
                var heheq = '\n';

                for (var i = 0; i < res.links.length; i++) {
                  heheq += "".concat(res.links[i], "\n");
                }

                cabe.reply(from, "Titulo: ".concat(res.title, "\n\nLink:\n").concat(heheq, "\nsiendo un probador por un momento :v"));
              });
            });
            return _context15.abrupt("break", 778);

          case 420:
            if (!(args.length == 0)) {
              _context15.next = 422;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Acechar la cuenta de Instagram de alguien\nescribir ".concat(prefix, "stalkig [nombre de usuario]\nejemplo: ").concat(prefix, "stalkig ini.arga"), id));

          case 422:
            _context15.next = 424;
            return regeneratorRuntime.awrap(rugaapi.stalkig(args[0]));

          case 424:
            igstalk = _context15.sent;
            _context15.next = 427;
            return regeneratorRuntime.awrap(rugaapi.stalkigpict(args[0]));

          case 427:
            igstalkpict = _context15.sent;
            _context15.next = 430;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, igstalkpict, '', igstalk, id));

          case 430:
            return _context15.abrupt("break", 778);

          case 431:
            if (!(args.length === 1)) {
              _context15.next = 433;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Kirim perintah *!wiki [query]*\nContoh : *!wiki asu*', id));

          case 433:
            query_ = body.slice(6);
            _context15.next = 436;
            return regeneratorRuntime.awrap(get.get("https://es.wikipedia.org/w/api.php".concat(query_)).json());

          case 436:
            wiki = _context15.sent;

            if (wiki.error) {
              cabe.reply(from, wiki.error, id);
            } else {
              cabe.reply(from, "\u27B8 *Query* : ".concat(query_, "\n\n\u27B8 *Result* : ").concat(wiki.result), id);
            }

            return _context15.abrupt("break", 778);

          case 439:
            if (!(args.length == 0)) {
              _context15.next = 441;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar la letra y los acordes de una canci\xF3n\bescribir: ".concat(prefix, "acorde [t\xEDtulo_ canci\xF3n]"), id));

          case 441:
            chordq = body.slice(7);
            _context15.next = 444;
            return regeneratorRuntime.awrap(rugaapi.chord(chordq));

          case 444:
            chordp = _context15.sent;
            _context15.next = 447;
            return regeneratorRuntime.awrap(cabe.reply(from, chordp, id));

          case 447:
            return _context15.abrupt("break", 778);

          case 448:
            if (!(args.length == 0)) {
              _context15.next = 450;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Convertir la captura de pantalla de los bots en una web\n\nUso: ".concat(prefix, "ss [url]\n\nejemplo: ").concat(prefix, "ss http://google.com"), id));

          case 450:
            _context15.next = 452;
            return regeneratorRuntime.awrap(meme.ss(args[0]));

          case 452:
            scrinshit = _context15.sent;
            _context15.next = 455;
            return regeneratorRuntime.awrap(cabe.sendFile(from, scrinshit, 'ss.jpg', 'cekrek', id));

          case 455:
            return _context15.abrupt("break", 778);

          case 456:
            if (!(args.length == 0)) {
              _context15.next = 458;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar canciones de youtube\n\nUtilizar: ".concat(prefix, "play t\xEDtulo de la canci\xF3n"), id));

          case 458:
            axios.get("https://arugaytdl.herokuapp.com/search?q=".concat(body.slice(6))).then(function _callee13(res) {
              return regeneratorRuntime.async(function _callee13$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      _context13.next = 2;
                      return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, "".concat(res.data[0].thumbnail), "", "Canci\xF3n encontrada\n\nT\xEDtulo: ".concat(res.data[0].title, "\nDuracion: ").concat(res.data[0].duration, "segundos\nSubido: ").concat(res.data[0].uploadDate, "\nVistas: ").concat(res.data[0].viewCount, "\n\nest\xE1 siendo enviado"), id));

                    case 2:
                      rugaapi.ytmp3("https://youtu.be/".concat(res.data[0].id)).then(function _callee12(res) {
                        return regeneratorRuntime.async(function _callee12$(_context12) {
                          while (1) {
                            switch (_context12.prev = _context12.next) {
                              case 0:
                                if (!(res.status == 'error')) {
                                  _context12.next = 2;
                                  break;
                                }

                                return _context12.abrupt("return", cabe.sendFileFromUrl(from, "".concat(res.link), '', "".concat(res.error)));

                              case 2:
                                _context12.next = 4;
                                return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, "".concat(res.thumb), '', "Canci\xF3n encontrada\n\nT\xEDtulo ".concat(res.title, "\n\nPaciencia, enviada de nuevo"), id));

                              case 4:
                                _context12.next = 6;
                                return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, "".concat(res.link), '', '', id)["catch"](function () {
                                  cabe.reply(from, "ESTA URL ".concat(args[0], " YA DESCARGADO ANTERIORMENTE... LA URL SE REINICIAR\xC1 DESPU\xC9S DE 60 MINUTOS"), id);
                                }));

                              case 6:
                              case "end":
                                return _context12.stop();
                            }
                          }
                        });
                      });

                    case 3:
                    case "end":
                      return _context13.stop();
                  }
                }
              });
            })["catch"](function () {
              cabe.reply(from, 'Hay un error!', id);
            });
            return _context15.abrupt("break", 778);

          case 460:
            if (!(isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image')) {
              _context15.next = 476;
              break;
            }

            if (!isMedia) {
              _context15.next = 467;
              break;
            }

            _context15.next = 464;
            return regeneratorRuntime.awrap(decryptMedia(message, uaOverride));

          case 464:
            mediaData = _context15.sent;
            _context15.next = 470;
            break;

          case 467:
            _context15.next = 469;
            return regeneratorRuntime.awrap(decryptMedia(quotedMsg, uaOverride));

          case 469:
            mediaData = _context15.sent;

          case 470:
            _fetch = require('node-fetch');
            imgBS4 = "data:".concat(mimetype, ";base64,").concat(mediaData.toString('base64'));
            cabe.reply(from, 'Buscando....', id);

            _fetch('https://trace.moe/api/search', {
              method: 'POST',
              body: JSON.stringify({
                image: imgBS4
              }),
              headers: {
                "Content-Type": "application/json"
              }
            }).then(function (respon) {
              return respon.json();
            }).then(function (resolt) {
              if (resolt.docs && resolt.docs.length <= 0) {
                cabe.reply(from, 'Lo siento, no sé qué anime es este, asegúrese de que la imagen que se buscará no esté borrosa/cortada', id);
              }

              var _resolt$docs$ = resolt.docs[0],
                  is_adult = _resolt$docs$.is_adult,
                  title = _resolt$docs$.title,
                  title_chinese = _resolt$docs$.title_chinese,
                  title_english = _resolt$docs$.title_english,
                  episode = _resolt$docs$.episode,
                  similarity = _resolt$docs$.similarity,
                  filename = _resolt$docs$.filename,
                  at = _resolt$docs$.at,
                  tokenthumb = _resolt$docs$.tokenthumb,
                  anilist_id = _resolt$docs$.anilist_id;
              teks = '';

              if (similarity < 0.92) {
                teks = '*Tengo poca fe en esto* :\n\n';
              }

              teks += "\u27B8 *T\xEDtulo japon\xE9s* : ".concat(title, "\n\u27B8 *T\xEDtulo chino* : ").concat(title_chinese, "\n\u27B8 *T\xEDtulo Ingl\xE9s* : ").concat(title_english, "\n");
              teks += "\u27B8 *R-18?* : ".concat(is_adult, "\n");
              teks += "\u27B8 *Eps* : ".concat(episode.toString(), "\n");
              teks += "\u27B8 *Semejanza* : ".concat((similarity * 100).toFixed(1), "%\n");
              var video = "https://media.trace.moe/video/".concat(anilist_id, "/").concat(encodeURIComponent(filename), "?t=").concat(at, "&token=").concat(tokenthumb);
              cabe.sendFileFromUrl(from, video, 'anime.mp4', teks, id)["catch"](function () {
                cabe.reply(from, teks, id);
              });
            })["catch"](function () {
              cabe.reply(from, 'Hay un error!', id);
            });

            _context15.next = 477;
            break;

          case 476:
            cabe.reply(from, "Lo siento, el formato es incorrecto\n\nEnv\xEDe una foto con un t\xEDtulo ".concat(prefix, "whatanime\n\nO responde a las fotos con subt\xEDtulos ").concat(prefix, "whatanime"), id);

          case 477:
            return _context15.abrupt("break", 778);

          case 478:
            rugaapi.cersex().then(function _callee14(res) {
              return regeneratorRuntime.async(function _callee14$(_context14) {
                while (1) {
                  switch (_context14.prev = _context14.next) {
                    case 0:
                      _context14.next = 2;
                      return regeneratorRuntime.awrap(cabe.reply(from, res.result, id));

                    case 2:
                    case "end":
                      return _context14.stop();
                  }
                }
              });
            });
            return _context15.abrupt("break", 778);

          case 480:
            if (!(args.length !== 2)) {
              _context15.next = 482;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto.\nIntroduzca su mensaje con ".concat(prefix, "resi <mensajero> <no_resi>\n\nKurir yang tersedia:\njne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex"), id));

          case 482:
            kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex'];

            if (kurirs.includes(args[0])) {
              _context15.next = 485;
              break;
            }

            return _context15.abrupt("return", cabe.sendText(from, "Lo sentimos, el tipo de expedici\xF3n de env\xEDo no es compatible. Este servicio solo admite expedici\xF3n de env\xEDo ".concat(kurirs.join(', '), " Por favor revise de nuevo.")));

          case 485:
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0]);
            cekResi(args[0], args[1]).then(function (result) {
              return cabe.sendText(from, result);
            });
            return _context15.abrupt("break", 778);

          case 488:
            if (!(args.length == 0)) {
              _context15.next = 490;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Cambiar texto a sonido (voz de Google) \n tipo: ".concat(prefix, "tts <c\xF3digo de idioma> <texto> \n ejemplos: ").concat(prefix, "tts es hola \n para ver el c\xF3digo de idioma aqu\xED: https://anotepad.com/note/read/5xqahdy8")));

          case 490:
            ttsGB = require('node-gtts')(args[0]);
            dataText = body.slice(8);

            if (!(dataText === '')) {
              _context15.next = 494;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'cual es el texto..', id));

          case 494:
            try {
              ttsGB.save('./media/tts.mp3', dataText, function () {
                cabe.sendPtt(from, './media/tts.mp3', id);
              });
            } catch (err) {
              cabe.reply(from, err, id);
            }

            return _context15.abrupt("break", 778);

          case 496:
            if (!(args.length != 1)) {
              _context15.next = 498;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ".concat(prefix, "translate <kode_bahasa>\ncontoh ").concat(prefix, "translate id"), id));

          case 498:
            if (quotedMsg) {
              _context15.next = 500;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ".concat(prefix, "translate <kode_bahasa>\ncontoh ").concat(prefix, "translate id"), id));

          case 500:
            quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : '';
            translate(quoteText, args[0]).then(function (result) {
              return cabe.sendText(from, result);
            })["catch"](function () {
              return cabe.sendText(from, 'Error, Kode bahasa salah.');
            });
            return _context15.abrupt("break", 778);

          case 503:
            if (!(args.length == 0)) {
              _context15.next = 505;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "ketik ".concat(prefix, "shortlink <url>"), message.id));

          case 505:
            if (isUrl(args[0])) {
              _context15.next = 507;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Maaf, url yang kamu kirim tidak valid.', message.id));

          case 507:
            _context15.next = 509;
            return regeneratorRuntime.awrap(urlShortener(args[0]));

          case 509:
            shortlink = _context15.sent;
            _context15.next = 512;
            return regeneratorRuntime.awrap(cabe.sendText(from, shortlink));

          case 512:
            return _context15.abrupt("break", 778);

          case 513:
            if (isGroupMsg) {
              _context15.next = 515;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id));

          case 515:
            if (isGroupAdmins) {
              _context15.next = 517;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo!', id));

          case 517:
            if (isBotGroupAdmins) {
              _context15.next = 519;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como admin del grupo!', id));

          case 519:
            if (!(args.length !== 1)) {
              _context15.next = 521;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Usar ".concat(prefix, "agregar\nUtilizar: ").concat(prefix, "agregar <numero>\nejemplo: ").concat(prefix, "agregar 54xxxxxx"), id));

          case 521:
            _context15.prev = 521;
            _context15.next = 524;
            return regeneratorRuntime.awrap(cabe.addParticipant(from, "".concat(args[0], "@c.us")).then(function () {
              return cabe.reply(from, 'Hola bienvenido', id);
            }));

          case 524:
            _context15.next = 529;
            break;

          case 526:
            _context15.prev = 526;
            _context15.t7 = _context15["catch"](521);
            cabe.reply(from, 'No se pudo agregar el objetivo', id);

          case 529:
            return _context15.abrupt("break", 778);

          case 530:
            if (isGroupMsg) {
              _context15.next = 532;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 532:
            if (isGroupAdmins) {
              _context15.next = 534;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 534:
            if (isBotGroupAdmins) {
              _context15.next = 536;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como admin del grupo.', id));

          case 536:
            if (!(mentionedJidList.length === 0)) {
              _context15.next = 538;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n etiquete a una o más personas para eliminar del grupo', id));

          case 538:
            if (!(mentionedJidList[0] === botNumber)) {
              _context15.next = 542;
              break;
            }

            _context15.next = 541;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n No puedo expulsar la cuenta del bot por mí mismo', id));

          case 541:
            return _context15.abrupt("return", _context15.sent);

          case 542:
            _context15.next = 544;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, "Solicitud recibida, problema:\n".concat(mentionedJidList.map(function (x) {
              return "@".concat(x.replace('@c.us', ''));
            }).join('\n'))));

          case 544:
            i = 0;

          case 545:
            if (!(i < mentionedJidList.length)) {
              _context15.next = 555;
              break;
            }

            if (!groupAdmins.includes(mentionedJidList[i])) {
              _context15.next = 550;
              break;
            }

            _context15.next = 549;
            return regeneratorRuntime.awrap(cabe.sendText(from, 'Error, no puede eliminar a el admin del grupo.'));

          case 549:
            return _context15.abrupt("return", _context15.sent);

          case 550:
            _context15.next = 552;
            return regeneratorRuntime.awrap(cabe.removeParticipant(groupId, mentionedJidList[i]));

          case 552:
            i++;
            _context15.next = 545;
            break;

          case 555:
            return _context15.abrupt("break", 778);

          case 556:
            if (isGroupMsg) {
              _context15.next = 558;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 558:
            if (isGroupAdmins) {
              _context15.next = 560;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 560:
            if (isBotGroupAdmins) {
              _context15.next = 562;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como administrador de grupo.', id));

          case 562:
            if (!(mentionedJidList.length !== 1)) {
              _context15.next = 564;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, solo puedo promover a 1 usuario', id));

          case 564:
            if (!groupAdmins.includes(mentionedJidList[0])) {
              _context15.next = 568;
              break;
            }

            _context15.next = 567;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo siento, el usuario ya es admin.', id));

          case 567:
            return _context15.abrupt("return", _context15.sent);

          case 568:
            if (!(mentionedJidList[0] === botNumber)) {
              _context15.next = 572;
              break;
            }

            _context15.next = 571;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n no se puede promover la cuenta del bot por sí solo', id));

          case 571:
            return _context15.abrupt("return", _context15.sent);

          case 572:
            _context15.next = 574;
            return regeneratorRuntime.awrap(cabe.promoteParticipant(groupId, mentionedJidList[0]));

          case 574:
            _context15.next = 576;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, "Solicitud aceptada, agregad@ @".concat(mentionedJidList[0].replace('@c.us', ''), " como admin.")));

          case 576:
            return _context15.abrupt("break", 778);

          case 577:
            if (isGroupMsg) {
              _context15.next = 579;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 579:
            if (isGroupAdmins) {
              _context15.next = 581;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 581:
            if (isBotGroupAdmins) {
              _context15.next = 583;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como administrador de grupo.', id));

          case 583:
            if (!(mentionedJidList.length !== 1)) {
              _context15.next = 585;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, solo se puede degradar a 1 usuario', id));

          case 585:
            if (groupAdmins.includes(mentionedJidList[0])) {
              _context15.next = 589;
              break;
            }

            _context15.next = 588;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el usuario aún no es administrador.', id));

          case 588:
            return _context15.abrupt("return", _context15.sent);

          case 589:
            if (!(mentionedJidList[0] === botNumber)) {
              _context15.next = 593;
              break;
            }

            _context15.next = 592;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n No se puede eliminar la cuenta del bot.', id));

          case 592:
            return _context15.abrupt("return", _context15.sent);

          case 593:
            _context15.next = 595;
            return regeneratorRuntime.awrap(cabe.demoteParticipant(groupId, mentionedJidList[0]));

          case 595:
            _context15.next = 597;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, "Solicitud aceptada, eliminar posici\xF3n @".concat(mentionedJidList[0].replace('@c.us', ''), ".")));

          case 597:
            return _context15.abrupt("break", 778);

          case 598:
            if (isGroupMsg) {
              _context15.next = 600;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 600:
            if (isGroupAdmins) {
              _context15.next = 602;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo.', id));

          case 602:
            cabe.sendText(from, 'Adiós, ya no me quieren aqui...( ⇀‸↼‶ )').then(function () {
              return cabe.leaveGroup(groupId);
            });
            return _context15.abrupt("break", 778);

          case 604:
            if (isGroupAdmins) {
              _context15.next = 606;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo!', id));

          case 606:
            if (quotedMsg) {
              _context15.next = 608;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto, por favor. \n Responde enviar un mensaje al bot con un t\xEDtulo ".concat(prefix, "borrar"), id));

          case 608:
            if (quotedMsgObj.fromMe) {
              _context15.next = 610;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto, por favor. \n Responde enviar un mensaje al bot con el t\xEDtulo ".concat(prefix, "borrar"), id));

          case 610:
            cabe.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
            return _context15.abrupt("break", 778);

          case 612:
            if (isGroupMsg) {
              _context15.next = 614;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 614:
            if (isGroupAdmins) {
              _context15.next = 616;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo.', id));

          case 616:
            _context15.next = 618;
            return regeneratorRuntime.awrap(cabe.getGroupMembers(groupId));

          case 618:
            groupMem = _context15.sent;
            hehex = '╔══✪〘 Mencionar a todos 〙✪══\n';

            for (_i = 0; _i < groupMem.length; _i++) {
              hehex += '╠➥';
              hehex += " @".concat(groupMem[_i].id.replace(/@c.us/g, ''), "\n");
            }

            hehex += '╚═〘 *CABE  B O T* 〙';
            _context15.next = 624;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, hehex));

          case 624:
            return _context15.abrupt("break", 778);

          case 625:
            _context15.next = 627;
            return regeneratorRuntime.awrap(cabe.getAmountOfLoadedMessages());

          case 627:
            loadedMsg = _context15.sent;
            _context15.next = 630;
            return regeneratorRuntime.awrap(cabe.getAllChatIds());

          case 630:
            chatIds = _context15.sent;
            _context15.next = 633;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 633:
            groups = _context15.sent;
            cabe.sendText(from, "Estado :\n- *".concat(loadedMsg, "* Mensajes cargados\n- *").concat(groups.length, "* Chats grupales\n- *").concat(chatIds.length - groups.length, "* Chats personales\n- *").concat(chatIds.length, "* Total de chats"));
            return _context15.abrupt("break", 778);

          case 636:
            if (isGroupMsg) {
              _context15.next = 638;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 638:
            isOwner = chat.groupMetadata.owner == sender.id;

            if (isOwner) {
              _context15.next = 641;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo puede ser utilizado por el propietario del grupo.', id));

          case 641:
            if (isBotGroupAdmins) {
              _context15.next = 643;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como admin del grupo.', id));

          case 643:
            _context15.next = 645;
            return regeneratorRuntime.awrap(cabe.getGroupMembers(groupId));

          case 645:
            allMem = _context15.sent;
            _i2 = 0;

          case 647:
            if (!(_i2 < allMem.length)) {
              _context15.next = 656;
              break;
            }

            if (!groupAdmins.includes(allMem[_i2].id)) {
              _context15.next = 651;
              break;
            }

            _context15.next = 653;
            break;

          case 651:
            _context15.next = 653;
            return regeneratorRuntime.awrap(cabe.removeParticipant(groupId, allMem[_i2].id));

          case 653:
            _i2++;
            _context15.next = 647;
            break;

          case 656:
            cabe.reply(from, 'Exito expulsar a todos los miembros', id);
            return _context15.abrupt("break", 778);

          case 658:
            if (isOwnerBot) {
              _context15.next = 660;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, '¡Este pedido es solo para el propietario del bot!', id));

          case 660:
            if (!(args.length == 0)) {
              _context15.next = 662;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Prohibir que alguien use comandos\n\nEscribir: \n".concat(prefix, "ban add 54xx --Activar\n").concat(prefix, "ban del 54xx --deshabilitar\n\nc\xF3mo prohibir r\xE1pidamente muchos tipos en grupos:\n").concat(prefix, "ban @tag @tag @tag"), id));

          case 662:
            if (args[0] == 'add') {
              banned.push(args[1] + '@c.us');
              fs.writeFileSync('./settings/banned.json', JSON.stringify(banned));
              cabe.reply(from, 'Objetivo baneado con éxito!');
            } else if (args[0] == 'del') {
              xnxx = banned.indexOf(args[1] + '@c.us');
              banned.splice(xnxx, 1);
              fs.writeFileSync('./settings/banned.json', JSON.stringify(banned));
              cabe.reply(from, '¡Objetivo no prohibido con éxito!');
            } else {
              for (_i3 = 0; _i3 < mentionedJidList.length; _i3++) {
                banned.push(mentionedJidList[_i3]);
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned));
                cabe.reply(from, '¡Objetivo de prohibición de éxito!', id);
              }
            }

            return _context15.abrupt("break", 778);

          case 664:
            if (isOwnerBot) {
              _context15.next = 666;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, '¡Este pedido es solo para el propietario del bot!', id));

          case 666:
            if (!(args.length == 0)) {
              _context15.next = 668;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para transmitir a todos los chats, escriba:\n".concat(prefix, "bc [rellenar el chat]")));

          case 668:
            msg = body.slice(4);
            _context15.next = 671;
            return regeneratorRuntime.awrap(cabe.getAllChatIds());

          case 671:
            chatz = _context15.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context15.prev = 675;
            _iterator = chatz[Symbol.iterator]();

          case 677:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context15.next = 687;
              break;
            }

            idk = _step.value;
            _context15.next = 681;
            return regeneratorRuntime.awrap(cabe.getChatById(idk));

          case 681:
            cvk = _context15.sent;
            if (!cvk.isReadOnly) cabe.sendText(idk, "\u3018 *C A B E  B C* \u3019\n\n".concat(msg));
            if (cvk.isReadOnly) cabe.sendText(idk, "\u3018 *C A B E  B C* \u3019\n\n".concat(msg));

          case 684:
            _iteratorNormalCompletion = true;
            _context15.next = 677;
            break;

          case 687:
            _context15.next = 693;
            break;

          case 689:
            _context15.prev = 689;
            _context15.t8 = _context15["catch"](675);
            _didIteratorError = true;
            _iteratorError = _context15.t8;

          case 693:
            _context15.prev = 693;
            _context15.prev = 694;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 696:
            _context15.prev = 696;

            if (!_didIteratorError) {
              _context15.next = 699;
              break;
            }

            throw _iteratorError;

          case 699:
            return _context15.finish(696);

          case 700:
            return _context15.finish(693);

          case 701:
            cabe.reply(from, 'Éxito de la transmisión!', id);
            return _context15.abrupt("break", 778);

          case 703:
            if (isOwnerBot) {
              _context15.next = 705;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Este comando es solo para el propietario del bot', id));

          case 705:
            _context15.next = 707;
            return regeneratorRuntime.awrap(cabe.getAllChatIds());

          case 707:
            allChatz = _context15.sent;
            _context15.next = 710;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 710:
            allGroupz = _context15.sent;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context15.prev = 714;
            _iterator2 = allGroupz[Symbol.iterator]();

          case 716:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context15.next = 727;
              break;
            }

            gclist = _step2.value;
            _context15.next = 720;
            return regeneratorRuntime.awrap(cabe.sendText(gclist.contact.id, "Lo siento, el bot est\xE1 limpiando, el chat total est\xE1 activo : ".concat(allChatz.length)));

          case 720:
            _context15.next = 722;
            return regeneratorRuntime.awrap(cabe.leaveGroup(gclist.contact.id));

          case 722:
            _context15.next = 724;
            return regeneratorRuntime.awrap(cabe.deleteChat(gclist.contact.id));

          case 724:
            _iteratorNormalCompletion2 = true;
            _context15.next = 716;
            break;

          case 727:
            _context15.next = 733;
            break;

          case 729:
            _context15.prev = 729;
            _context15.t9 = _context15["catch"](714);
            _didIteratorError2 = true;
            _iteratorError2 = _context15.t9;

          case 733:
            _context15.prev = 733;
            _context15.prev = 734;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 736:
            _context15.prev = 736;

            if (!_didIteratorError2) {
              _context15.next = 739;
              break;
            }

            throw _iteratorError2;

          case 739:
            return _context15.finish(736);

          case 740:
            return _context15.finish(733);

          case 741:
            cabe.reply(from, 'Exito dejar todo el grupo!', id);
            return _context15.abrupt("break", 778);

          case 743:
            if (isOwnerBot) {
              _context15.next = 745;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Este comando es solo para el propietario del bot', id));

          case 745:
            _context15.next = 747;
            return regeneratorRuntime.awrap(cabe.getAllChats());

          case 747:
            allChatx = _context15.sent;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context15.prev = 751;
            _iterator3 = allChatx[Symbol.iterator]();

          case 753:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context15.next = 760;
              break;
            }

            dchat = _step3.value;
            _context15.next = 757;
            return regeneratorRuntime.awrap(cabe.deleteChat(dchat.id));

          case 757:
            _iteratorNormalCompletion3 = true;
            _context15.next = 753;
            break;

          case 760:
            _context15.next = 766;
            break;

          case 762:
            _context15.prev = 762;
            _context15.t10 = _context15["catch"](751);
            _didIteratorError3 = true;
            _iteratorError3 = _context15.t10;

          case 766:
            _context15.prev = 766;
            _context15.prev = 767;

            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }

          case 769:
            _context15.prev = 769;

            if (!_didIteratorError3) {
              _context15.next = 772;
              break;
            }

            throw _iteratorError3;

          case 772:
            return _context15.finish(769);

          case 773:
            return _context15.finish(766);

          case 774:
            cabe.reply(from, 'Tiene éxito borrar todo el chat!', id);
            return _context15.abrupt("break", 778);

          case 776:
            console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Comando no registrado de', color(pushname));
            return _context15.abrupt("break", 778);

          case 778:
            _context15.next = 783;
            break;

          case 780:
            _context15.prev = 780;
            _context15.t11 = _context15["catch"](1);
            console.log(color('[ERROR]', 'red'), _context15.t11);

          case 783:
          case "end":
            return _context15.stop();
        }
      }
    }, null, null, [[1, 780], [108, 124], [208, 215], [289, 306], [329, 342], [521, 526], [675, 689, 693, 701], [694,, 696, 700], [714, 729, 733, 741], [734,, 736, 740], [751, 762, 766, 774], [767,, 769, 773]]);
  });
};

create('cabe', options(true, start)).then(function (cabe) {
  return start(cabe);
})["catch"](function (err) {
  return new Error(err);
});