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

  cabe.onMessage(function _callee16(message) {
    var type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList, body, name, formattedTitle, pushname, verifiedName, formattedName, botNumber, groupId, groupAdmins, isGroupAdmins, isBotGroupAdmins, isOwnerBot, isBanned, command, arg, args, isCmd, uaOverride, url, isQuotedImage, isQuotedVideo, linkgrup, islink, chekgrup, cgrup, encryptMedia, _mimetype, _mediaData, _imageBase, mediaData, imageBase64, base64img, outFile, result, filename, isGiphy, isMediaGiphy, getGiphyCode, giphyCode, smallGifUrl, gifUrl, _smallGifUrl, top, bottom, _encryptMedia, _mediaData2, getUrl, ImageBase64, qmaker, quotes, author, theme, hasilqmaker, nulisq, nulisp, instag, mp3, mp4, resq, resp, googleQuery, gimgg, gamb, gimg, gimg2, inxx, quotex, randmeme, cariwall, hasilwall, carireddit, hasilreddit, cariresep, hasilresep, igstalk, igstalkpict, query_, wiki, chordq, chordp, scrinshit, _fetch, imgBS4, kurirs, ttsGB, dataText, quoteText, shortlink, i, groupMem, hehex, _i, loadedMsg, chatIds, groups, isOwner, allMem, _i2, xnxx, _i3, msg, chatz, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, idk, cvk, allChatz, allGroupz, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, gclist, allChatx, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, dchat;

    return regeneratorRuntime.async(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            cabe.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
            .then(function (msg) {
              if (msg >= 3000) {
                console.log('[cabe]', color("Alcance de mensaje cargado ".concat(msg, ", cortando la cach\xE9 de mensajes..."), 'yellow'));
                cabe.cutMsgCache();
              }
            }); //Message

            _context16.prev = 1;
            type = message.type, id = message.id, from = message.from, t = message.t, sender = message.sender, isGroupMsg = message.isGroupMsg, chat = message.chat, caption = message.caption, isMedia = message.isMedia, mimetype = message.mimetype, quotedMsg = message.quotedMsg, quotedMsgObj = message.quotedMsgObj, mentionedJidList = message.mentionedJidList;
            body = message.body;
            name = chat.name, formattedTitle = chat.formattedTitle;
            pushname = sender.pushname, verifiedName = sender.verifiedName, formattedName = sender.formattedName;
            pushname = pushname || verifiedName || formattedName; // verifiedName is the name of someone who uses a business account

            _context16.next = 9;
            return regeneratorRuntime.awrap(cabe.getHostNumber());

          case 9:
            _context16.t0 = _context16.sent;
            botNumber = _context16.t0 + '@c.us';
            groupId = isGroupMsg ? chat.groupMetadata.id : '';

            if (!isGroupMsg) {
              _context16.next = 18;
              break;
            }

            _context16.next = 15;
            return regeneratorRuntime.awrap(cabe.getGroupAdmins(groupId));

          case 15:
            _context16.t1 = _context16.sent;
            _context16.next = 19;
            break;

          case 18:
            _context16.t1 = '';

          case 19:
            groupAdmins = _context16.t1;
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
              _context16.next = 35;
              break;
            }

            return _context16.abrupt("return", console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname)));

          case 35:
            if (!(isCmd && msgFilter.isFiltered(from) && isGroupMsg)) {
              _context16.next = 37;
              break;
            }

            return _context16.abrupt("return", console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname), 'en', color(name || formattedTitle)));

          case 37:
            if (isCmd) {
              _context16.next = 39;
              break;
            }

            return _context16.abrupt("return");

          case 39:
            if (isCmd && !isGroupMsg) {
              console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname));
            }

            if (isCmd && isGroupMsg) {
              console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname), 'en', color(name || formattedTitle));
            } // [BETA] Avoid Spam Message


            msgFilter.addFilter(from);

            if (!isBanned) {
              _context16.next = 44;
              break;
            }

            return _context16.abrupt("return", console.log(color('[BAN]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color("".concat(command, " [").concat(args.length, "]")), 'para', color(pushname)));

          case 44:
            _context16.t2 = command;
            _context16.next = _context16.t2 === 'velocidad' ? 47 : _context16.t2 === 'ping' ? 47 : _context16.t2 === 'tnc' ? 50 : _context16.t2 === 'menu' ? 53 : _context16.t2 === 'help' ? 53 : _context16.t2 === 'menuadmin' ? 56 : _context16.t2 === 'donar' ? 63 : _context16.t2 === 'donar' ? 63 : _context16.t2 === 'TR' ? 66 : _context16.t2 === 'propietario del bot' ? 69 : _context16.t2 === 'join' ? 72 : _context16.t2 === 'sticker' ? 96 : _context16.t2 === 'stiker' ? 96 : _context16.t2 === 'stickergif' ? 141 : _context16.t2 === 'stikergif' ? 141 : _context16.t2 === 'stikergiphy' ? 159 : _context16.t2 === 'stickergiphy' ? 159 : _context16.t2 === 'meme' ? 183 : _context16.t2 === 'quotemaker' ? 202 : _context16.t2 === 'escribir' ? 222 : _context16.t2 === 'nulis' ? 222 : _context16.t2 === 'instagram' ? 231 : _context16.t2 === 'tiktok' ? 239 : _context16.t2 === 'twt' ? 247 : _context16.t2 === 'twitter' ? 247 : _context16.t2 === 'fb' ? 255 : _context16.t2 === 'facebook' ? 255 : _context16.t2 === 'ytmp3' ? 259 : _context16.t2 === 'ytmp4' ? 267 : _context16.t2 === 'xnxx' ? 275 : _context16.t2 === 'google' ? 309 : _context16.t2 === 'googleimage' ? 319 : _context16.t2 === 'nsfw' ? 344 : _context16.t2 === 'simisimi' ? 352 : _context16.t2 === 'simi' ? 356 : _context16.t2 === 'fakta' ? 364 : _context16.t2 === 'katabijak' ? 366 : _context16.t2 === 'pantun' ? 368 : _context16.t2 === 'quote' ? 370 : _context16.t2 === 'anime' ? 376 : _context16.t2 === 'kpop' ? 380 : _context16.t2 === 'memes' ? 384 : _context16.t2 === 'imagen' ? 389 : _context16.t2 === 'images' ? 389 : _context16.t2 === 'sreddit' ? 397 : _context16.t2 === 'resep' ? 405 : _context16.t2 === 'nekopoi' ? 413 : _context16.t2 === 'stalkig' ? 416 : _context16.t2 === 'wiki' ? 427 : _context16.t2 === 'acorde' ? 435 : _context16.t2 === 'ss' ? 444 : _context16.t2 === 'play' ? 452 : _context16.t2 === 'whatanime' ? 456 : _context16.t2 === 'cersex' ? 474 : _context16.t2 === 'resi' ? 476 : _context16.t2 === 'tts' ? 484 : _context16.t2 === 'translate' ? 492 : _context16.t2 === 'shortlink' ? 499 : _context16.t2 === 'agregar' ? 509 : _context16.t2 === 'eliminar' ? 526 : _context16.t2 === 'promover' ? 552 : _context16.t2 === 'degradar' ? 573 : _context16.t2 === 'bye' ? 594 : _context16.t2 === 'borrar' ? 600 : _context16.t2 === 'lista' ? 608 : _context16.t2 === 'lista' ? 608 : _context16.t2 === 'botstat' ? 621 : _context16.t2 === 'kickall' ? 632 : _context16.t2 === 'ban' ? 654 : _context16.t2 === 'bc' ? 660 : _context16.t2 === 'leaveall' ? 699 : _context16.t2 === 'clearall' ? 739 : 772;
            break;

          case 47:
            _context16.next = 49;
            return regeneratorRuntime.awrap(cabe.sendText(from, "Pong!!!!\nvelocidad: ".concat(processTime(t, moment()), " _Segundos_")));

          case 49:
            return _context16.abrupt("break", 774);

          case 50:
            _context16.next = 52;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textTnC()));

          case 52:
            return _context16.abrupt("break", 774);

          case 53:
            _context16.next = 55;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textMenu(pushname)).then(function () {
              return isGroupMsg && isGroupAdmins ? cabe.sendText(from, "Men\xFA de admins del grupo: *".concat(prefix, "menuadmin*")) : null;
            }));

          case 55:
            return _context16.abrupt("break", 774);

          case 56:
            if (isGroupMsg) {
              _context16.next = 58;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 58:
            if (isGroupAdmins) {
              _context16.next = 60;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 60:
            _context16.next = 62;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textAdmin()));

          case 62:
            return _context16.abrupt("break", 774);

          case 63:
            _context16.next = 65;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textDonasi()));

          case 65:
            return _context16.abrupt("break", 774);

          case 66:
            _context16.next = 68;
            return regeneratorRuntime.awrap(cabe.sedText(from, 'holaaaaaaaaaaaaaaaaaa'));

          case 68:
            return _context16.abrupt("break", 774);

          case 69:
            _context16.next = 71;
            return regeneratorRuntime.awrap(cabe.sendContact(from, ownerNumber).then(function () {
              return cabe.sedText(from, 'Si desea donar lo puede hacer por PayPal https://www.paypal.com/paypalme/cabegus?locale.x=es_XC!');
            }));

          case 71:
            return _context16.abrupt("break", 774);

          case 72:
            if (!(args.length == 0)) {
              _context16.next = 74;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Si desea invitar al bot al grupo, inv\xEDtelo o escriba ".concat(prefix, "join [link del grupo]"), id));

          case 74:
            linkgrup = body.slice(6);
            islink = linkgrup.match(/(https:\/\/chat.whatsapp.com)/gi);
            _context16.next = 78;
            return regeneratorRuntime.awrap(cabe.inviteInfo(linkgrup));

          case 78:
            chekgrup = _context16.sent;

            if (islink) {
              _context16.next = 81;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo siento, el enlace del grupo es incorrecto, enviar el enlace correcto', id));

          case 81:
            if (!isOwnerBot) {
              _context16.next = 86;
              break;
            }

            _context16.next = 84;
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
            _context16.next = 95;
            break;

          case 86:
            _context16.next = 88;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 88:
            cgrup = _context16.sent;

            if (!(cgrup.length > groupLimit)) {
              _context16.next = 91;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Lo siento, el grupo de este bot est\xE1 completo\nEl grupo m\xE1ximo es: ".concat(groupLimit), id));

          case 91:
            if (!(cgrup.size < memberLimit)) {
              _context16.next = 93;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Lo siento, CABE-BOT no se unir\xE1 si los miembros del grupo no superan las".concat(memberLimit, " personas"), id));

          case 93:
            _context16.next = 95;
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
            return _context16.abrupt("break", 774);

          case 96:
            if (!((isMedia || isQuotedImage) && args.length === 0)) {
              _context16.next = 106;
              break;
            }

            encryptMedia = isQuotedImage ? quotedMsg : message;
            _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype;
            _context16.next = 101;
            return regeneratorRuntime.awrap(decryptMedia(encryptMedia, uaOverride));

          case 101:
            _mediaData = _context16.sent;
            _imageBase = "data:".concat(_mimetype, ";base64,").concat(_mediaData.toString('base64'));
            cabe.sendImageAsSticker(from, _imageBase).then(function () {
              cabe.reply(from, 'Aqui esta tu sticker(si el sticker sale mal, intentar recortarlo he intentar de nuevo)');
              console.log("Sticker procesado por ".concat(processTime(t, moment()), " Segundo"));
            });
            _context16.next = 140;
            break;

          case 106:
            if (!(args[0] === 'nobg')) {
              _context16.next = 131;
              break;
            }

            if (!(isMedia || isQuotedImage)) {
              _context16.next = 129;
              break;
            }

            _context16.prev = 108;
            _context16.next = 111;
            return regeneratorRuntime.awrap(decryptMedia(message, uaOverride));

          case 111:
            mediaData = _context16.sent;
            imageBase64 = "data:".concat(mimetype, ";base64,").concat(mediaData.toString('base64'));
            base64img = imageBase64;
            outFile = './media/noBg.png'; // kamu dapat mengambil api key dari website remove.bg dan ubahnya difolder settings/api.json

            _context16.next = 117;
            return regeneratorRuntime.awrap(removeBackgroundFromImageBase64({
              base64img: base64img,
              apiKey: apiNoBg,
              size: 'auto',
              type: 'auto',
              outFile: outFile
            }));

          case 117:
            result = _context16.sent;
            _context16.next = 120;
            return regeneratorRuntime.awrap(fs.writeFile(outFile, result.base64img));

          case 120:
            _context16.next = 122;
            return regeneratorRuntime.awrap(cabe.sendImageAsSticker(from, "data:".concat(mimetype, ";base64,").concat(result.base64img)));

          case 122:
            _context16.next = 129;
            break;

          case 124:
            _context16.prev = 124;
            _context16.t3 = _context16["catch"](108);
            console.log(_context16.t3);
            _context16.next = 129;
            return regeneratorRuntime.awrap(cabe.reply(from, 'lo siento, el límite de uso de hoy es máximo', id));

          case 129:
            _context16.next = 140;
            break;

          case 131:
            if (!(args.length === 1)) {
              _context16.next = 138;
              break;
            }

            if (isUrl(url)) {
              _context16.next = 135;
              break;
            }

            _context16.next = 135;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el enlace que envió no es válido.', id));

          case 135:
            cabe.sendStickerfromUrl(from, url).then(function (r) {
              return !r && r !== undefined ? cabe.sendText(from, 'Lo sentimos, el enlace que envió no contiene una imagen.') : cabe.reply(from, 'Aqui esta tu sticker');
            }).then(function () {
              return console.log("Sticker Procesado por ".concat(processTime(t, moment()), " Segundo"));
            });
            _context16.next = 140;
            break;

          case 138:
            _context16.next = 140;
            return regeneratorRuntime.awrap(cabe.reply(from, "\xA1Sin imagen! Usar ".concat(prefix, "sticker\n\n\nEnviar im\xE1genes con subt\xEDtulos\n").concat(prefix, "sticker <usual>\n").concat(prefix, "sticker nobg <sin fondo>\n\n o enviar mensaje con\n").concat(prefix, "sticker <link>"), id));

          case 140:
            return _context16.abrupt("break", 774);

          case 141:
            if (!(isMedia || isQuotedVideo)) {
              _context16.next = 157;
              break;
            }

            if (!(mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10)) {
              _context16.next = 154;
              break;
            }

            _context16.next = 145;
            return regeneratorRuntime.awrap(decryptMedia(message, uaOverride));

          case 145:
            mediaData = _context16.sent;
            cabe.reply(from, '[ESPERAR] En curso⏳ espere ± 1 min.', id);
            filename = "./media/stickergif.".concat(mimetype.split('/')[1]);
            _context16.next = 150;
            return regeneratorRuntime.awrap(fs.writeFileSync(filename, mediaData));

          case 150:
            _context16.next = 152;
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
            _context16.next = 155;
            break;

          case 154:
            cabe.reply(from, "[\u2757] Enviar un gif con el t\xEDtulo *".concat(prefix, "stickergif* max 10 seg!"), id);

          case 155:
            _context16.next = 158;
            break;

          case 157:
            cabe.reply(from, "[\u2757] Enviar un gif con el titulo *".concat(prefix, "stickergif*"), id);

          case 158:
            return _context16.abrupt("break", 774);

          case 159:
            if (!(args.length !== 1)) {
              _context16.next = 161;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto. \nescribe el mensaje con".concat(prefix, "stickergiphy <link de giphy https://giphy.com/>"), id));

          case 161:
            isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'));
            isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'));

            if (!isGiphy) {
              _context16.next = 172;
              break;
            }

            getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'));

            if (getGiphyCode) {
              _context16.next = 167;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'No se pudo recuperar el código giphy', id));

          case 167:
            giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '');
            smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif';
            cabe.sendGiphyAsSticker(from, smallGifUrl).then(function () {
              cabe.reply(from, 'Aqui esta tu sticker');
              console.log("Sticker Procesado por ".concat(processTime(t, moment()), " Segundo"));
            })["catch"](function (err) {
              return console.log(err);
            });
            _context16.next = 182;
            break;

          case 172:
            if (!isMediaGiphy) {
              _context16.next = 180;
              break;
            }

            gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'));

            if (gifUrl) {
              _context16.next = 176;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'No se pudo recuperar el código giphy', id));

          case 176:
            _smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif');
            cabe.sendGiphyAsSticker(from, _smallGifUrl).then(function () {
              cabe.reply(from, 'Aqui esta tu sticker');
              console.log("Sticker Procesado ".concat(processTime(t, moment()), " Segundo"));
            })["catch"](function (err) {
              return console.log(err);
            });
            _context16.next = 182;
            break;

          case 180:
            _context16.next = 182;
            return regeneratorRuntime.awrap(cabe.reply(from, 'lo siento, los comandos de la etiqueta giphy solo pueden usar enlaces de giphy.  [Solo Giphy]', id));

          case 182:
            return _context16.abrupt("break", 774);

          case 183:
            if (!((isMedia || isQuotedImage) && args.length >= 2)) {
              _context16.next = 199;
              break;
            }

            top = arg.split('|')[0];
            bottom = arg.split('|')[1];
            _encryptMedia = isQuotedImage ? quotedMsg : message;
            _context16.next = 189;
            return regeneratorRuntime.awrap(decryptMedia(_encryptMedia, uaOverride));

          case 189:
            _mediaData2 = _context16.sent;
            _context16.next = 192;
            return regeneratorRuntime.awrap(uploadImages(_mediaData2, false));

          case 192:
            getUrl = _context16.sent;
            _context16.next = 195;
            return regeneratorRuntime.awrap(meme.custom(getUrl, top, bottom));

          case 195:
            ImageBase64 = _context16.sent;
            cabe.sendFile(from, ImageBase64, 'image.png', '', null, true).then(function (serialized) {
              return console.log("Env\xEDo exitoso de archivos con ID: ".concat(serialized, " procesada durante ").concat(processTime(t, moment())));
            })["catch"](function (err) {
              return console.error(err);
            });
            _context16.next = 201;
            break;

          case 199:
            _context16.next = 201;
            return regeneratorRuntime.awrap(cabe.reply(from, "\xA1Sin imagen! Env\xEDe una imagen con la descripcion. ".concat(prefix, "meme <texto superior> | <texto abajo>\nejemplo: ").concat(prefix, "meme texto superior | texto de abajo "), id));

          case 201:
            return _context16.abrupt("break", 774);

          case 202:
            qmaker = body.trim().split('|');

            if (!(qmaker.length >= 3)) {
              _context16.next = 220;
              break;
            }

            quotes = qmaker[1];
            author = qmaker[2];
            theme = qmaker[3];
            cabe.reply(from, 'versos como', id);
            _context16.prev = 208;
            _context16.next = 211;
            return regeneratorRuntime.awrap(images.quote(quotes, author, theme));

          case 211:
            hasilqmaker = _context16.sent;
            cabe.sendFileFromUrl(from, "".concat(hasilqmaker), '', 'Este es hermano ...', id);
            _context16.next = 218;
            break;

          case 215:
            _context16.prev = 215;
            _context16.t4 = _context16["catch"](208);
            cabe.reply('bueno, el proceso falló, hermano, el contenido es correcto, ¿no?..', id);

          case 218:
            _context16.next = 221;
            break;

          case 220:
            cabe.reply(from, "Usar ".concat(prefix, "quotemaker |cita de isi|autor|tema \n\n ejemplo: ").concat(prefix, "quotemaker |Te amo|CabeBot|aleatorio \n\n para el tema usar random s\xED hermano.."));

          case 221:
            return _context16.abrupt("break", 774);

          case 222:
            if (!(args.length == 0)) {
              _context16.next = 224;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Haz que el bot escriba el texto que se env\xEDa como imagen\nUilizar: ".concat(prefix, "escribir [texto]\n\nEjemplo: ").concat(prefix, "escribir hola me llamo Cabebot y mi version es 1.2"), id));

          case 224:
            nulisq = body.slice(7);
            _context16.next = 227;
            return regeneratorRuntime.awrap(rugaapi.tulis(nulisq));

          case 227:
            nulisp = _context16.sent;
            _context16.next = 230;
            return regeneratorRuntime.awrap(cabe.sendImage(from, "".concat(nulisp), '', 'Aqui esta tu texto', id)["catch"](function () {
              cabe.reply(from, '¡Hay un Error!', id);
            }));

          case 230:
            return _context16.abrupt("break", 774);

          case 231:
            if (!(args.length == 0)) {
              _context16.next = 233;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para descargar im\xE1genes o videos de instagram \n escriba: ".concat(prefix, "instagram [link_ig]"), id));

          case 233:
            _context16.next = 235;
            return regeneratorRuntime.awrap(rugaapi.insta(args[0]));

          case 235:
            instag = _context16.sent;
            _context16.next = 238;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, instag, '', '', id));

          case 238:
            return _context16.abrupt("break", 774);

          case 239:
            if (!(args.length !== 1)) {
              _context16.next = 241;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id));

          case 241:
            if (!(!is.Url(url) && !url.includes('tiktok.com'))) {
              _context16.next = 243;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, el enlace que envió no es válido. [Enlace no válido]', id));

          case 243:
            _context16.next = 245;
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
            return _context16.abrupt("break", 774);

          case 247:
            if (!(args.length !== 1)) {
              _context16.next = 249;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id));

          case 249:
            if (!(!is.Url(url) || !url.includes('twitter.com') || url.includes('t.co'))) {
              _context16.next = 251;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, la URL que envió no es válida. [Enlace no válido]', id));

          case 251:
            _context16.next = 253;
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
            return _context16.abrupt("break", 774);

          case 255:
            if (!(args.length == 0)) {
              _context16.next = 257;
              break;
            }

            return _context16.abrupt("return", aruga.reply(from, "Untuk mendownload video dari link facebook\nketik: ".concat(prefix, "fb [link_fb]"), id));

          case 257:
            rugaapi.fb(args[0]).then(function _callee12(res) {
              var link, linkhd, linksd;
              return regeneratorRuntime.async(function _callee12$(_context12) {
                while (1) {
                  switch (_context12.prev = _context12.next) {
                    case 0:
                      link = res.link, linkhd = res.linkhd, linksd = res.linksd;

                      if (!(res.status == 'error')) {
                        _context12.next = 3;
                        break;
                      }

                      return _context12.abrupt("return", aruga.sendFileFromUrl(from, link, '', 'Maaf url anda tidak dapat ditemukan', id));

                    case 3:
                      _context12.next = 5;
                      return regeneratorRuntime.awrap(aruga.sendFileFromUrl(from, linkhd, '', 'Nih ngab videonya', id)["catch"](function _callee11() {
                        return regeneratorRuntime.async(function _callee11$(_context11) {
                          while (1) {
                            switch (_context11.prev = _context11.next) {
                              case 0:
                                _context11.next = 2;
                                return regeneratorRuntime.awrap(aruga.sendFileFromUrl(from, linksd, '', 'Nih ngab videonya', id)["catch"](function () {
                                  aruga.reply(from, 'Maaf url anda tidak dapat ditemukan', id);
                                }));

                              case 2:
                              case "end":
                                return _context11.stop();
                            }
                          }
                        });
                      }));

                    case 5:
                    case "end":
                      return _context12.stop();
                  }
                }
              });
            });
            return _context16.abrupt("break", 774);

          case 259:
            if (!(args.length == 0)) {
              _context16.next = 261;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para descargar canciones de youtube \n escriba: ".concat(prefix, "ytmp3 [link_yt]"), id));

          case 261:
            _context16.next = 263;
            return regeneratorRuntime.awrap(rugaapi.ytmp3(args[0]));

          case 263:
            mp3 = _context16.sent;
            _context16.next = 266;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, mp3, '', '', id));

          case 266:
            return _context16.abrupt("break", 774);

          case 267:
            if (!(args.length == 0)) {
              _context16.next = 269;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para descargar videos de youtube \n escriba: ".concat(prefix, "ytmp4 [link_yt]")));

          case 269:
            _context16.next = 271;
            return regeneratorRuntime.awrap(rugaapi.ytmp4(args[0]));

          case 271:
            mp4 = _context16.sent;
            _context16.next = 274;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, mp4, '', '', id));

          case 274:
            return _context16.abrupt("break", 774);

          case 275:
            if (isNsfw) {
              _context16.next = 277;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'comando / comando NSFW no activado en este grupo!', id));

          case 277:
            if (!isLimit(serial)) {
              _context16.next = 279;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Lo siento ".concat(pushname, ", Su l\xEDmite de cuota se ha agotado, escriba #limit para verificar su l\xEDmite de cuota"), id));

          case 279:
            _context16.next = 281;
            return regeneratorRuntime.awrap(limitAdd(serial));

          case 281:
            if (!(args.length === 1)) {
              _context16.next = 283;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Enviar comando *#xnxx [linkXnxx]*, por ejemplo, envíe el comando *#readme*'));

          case 283:
            if (!(!args[1].match(isUrl) && !args[1].includes('xnxx.com'))) {
              _context16.next = 285;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, mess.error.Iv, id));

          case 285:
            _context16.prev = 285;
            cabe.reply(from, mess.wait, id);
            _context16.next = 289;
            return regeneratorRuntime.awrap(axios.get('https://mhankbarbar.herokuapp.com/api/xnxx?url=' + args[1] + '&apiKey=' + barbarkey));

          case 289:
            resq = _context16.sent;
            resp = resq.data;

            if (!resp.error) {
              _context16.next = 295;
              break;
            }

            cabe.reply(from, ytvv.error, id);
            _context16.next = 300;
            break;

          case 295:
            if (!(Number(resp.result.size.split(' MB')[0]) > 20.00)) {
              _context16.next = 297;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Maaf durasi video sudah melebihi batas maksimal 20 menit!', id));

          case 297:
            cabe.sendFileFromUrl(from, resp.result.thumb, 'thumb.jpg', "\u27B8 *Judul* : ".concat(resp.result.judul, "\n\u27B8 *Deskripsi* : ").concat(resp.result.desc, "\n\u27B8 *Filesize* : ").concat(resp.result.size, "\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit."), id);
            _context16.next = 300;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, resp.result.vid, "".concat(resp.result.title, ".mp4"), '', id));

          case 300:
            _context16.next = 308;
            break;

          case 302:
            _context16.prev = 302;
            _context16.t5 = _context16["catch"](285);
            console.log(_context16.t5);
            _context16.next = 307;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Video tidak ditemukan'));

          case 307:
            cabe.sendText(ownerNumber, 'Xnxx Error : ' + _context16.t5);

          case 308:
            return _context16.abrupt("break", 774);

          case 309:
            if (!isLimit(serial)) {
              _context16.next = 311;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Maaf ".concat(pushname, ", Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu"), id));

          case 311:
            _context16.next = 313;
            return regeneratorRuntime.awrap(limitAdd(serial));

          case 313:
            cabe.reply(from, mess.wait, id);
            googleQuery = body.slice(8);

            if (!(googleQuery == undefined || googleQuery == ' ')) {
              _context16.next = 317;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "*Hasil Pencarian : ".concat(googleQuery, "* tidak ditemukan"), id));

          case 317:
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
            return _context16.abrupt("break", 774);

          case 319:
            if (!isLimit(serial)) {
              _context16.next = 321;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Maaf ".concat(pushname, ", Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu"), id));

          case 321:
            _context16.next = 323;
            return regeneratorRuntime.awrap(limitAdd(serial));

          case 323:
            if (!(args.length === 1)) {
              _context16.next = 325;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Kirim perintah *#googleimage [query]*\nContoh : *#googleimage Elaina*', id));

          case 325:
            _context16.prev = 325;
            cabe.reply(from, mess.wait, id);
            gimgg = body.slice(13);
            gamb = "https://api.vhtear.com/googleimg?query=".concat(gimgg, "&apikey=").concat(vhtearkey);
            _context16.next = 331;
            return regeneratorRuntime.awrap(axios.get(gamb));

          case 331:
            gimg = _context16.sent;
            gimg2 = Math.floor(Math.random() * gimg.data.result.result_search.length);
            console.log(gimg2);
            _context16.next = 336;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, gimg.data.result.result_search[gimg2], "gam.".concat(gimg.data.result.result_search[gimg2]), "*Google Image*\n\n*Hasil Pencarian : ".concat(gimgg, "*"), id));

          case 336:
            _context16.next = 343;
            break;

          case 338:
            _context16.prev = 338;
            _context16.t6 = _context16["catch"](325);
            console.log(_context16.t6);
            cabe.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Gambar tidak ditemukan');
            cabe.sendText(ownerNumber, 'Google Image Error : ' + _context16.t6);

          case 343:
            return _context16.abrupt("break", 774);

          case 344:
            if (isGroupMsg) {
              _context16.next = 346;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, '¡Este comando solo se puede usar en grupos!', id));

          case 346:
            if (isGroupAdmins) {
              _context16.next = 348;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, '¡Este comando solo puede ser utilizado por los admins del grupo!', id));

          case 348:
            if (!(args.length === 1)) {
              _context16.next = 350;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Seleccione habilitar o deshabilitar!', id));

          case 350:
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

            return _context16.abrupt("break", 774);

          case 352:
            if (isGroupMsg) {
              _context16.next = 354;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id));

          case 354:
            cabe.reply(from, "Para habilitar simi-simi en el chat grupal\n\nUtilizar\n".concat(prefix, "simi on --activar\n").concat(prefix, "simi off - desactivar\n"), id);
            return _context16.abrupt("break", 774);

          case 356:
            if (isGroupMsg) {
              _context16.next = 358;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id));

          case 358:
            if (isGroupAdmins) {
              _context16.next = 360;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por los admins del grupo.', id));

          case 360:
            if (!(args.length !== 1)) {
              _context16.next = 362;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para habilitar simi-simi en el chat grupal\n\nUtilizar\n".concat(prefix, "simi on --activar\n").concat(prefix, "simi off - desactivar\n"), id));

          case 362:
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

            return _context16.abrupt("break", 774);

          case 364:
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt').then(function (res) {
              return res.text();
            }).then(function (body) {
              var splitnix = body.split('\n');
              var randomnix = splitnix[Math.floor(Math.random() * splitnix.length)];
              cabe.reply(from, randomnix, id);
            });
            return _context16.abrupt("break", 774);

          case 366:
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt').then(function (res) {
              return res.text();
            }).then(function (body) {
              var splitbijak = body.split('\n');
              var randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)];
              cabe.reply(from, randombijak, id);
            });
            return _context16.abrupt("break", 774);

          case 368:
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt').then(function (res) {
              return res.text();
            }).then(function (body) {
              var splitpantun = body.split('\n');
              var randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)];
              cabe.reply(from, randompantun.replace(/cabe-line/g, "\n"), id);
            });
            return _context16.abrupt("break", 774);

          case 370:
            _context16.next = 372;
            return regeneratorRuntime.awrap(rugaapi.quote());

          case 372:
            quotex = _context16.sent;
            _context16.next = 375;
            return regeneratorRuntime.awrap(cabe.reply(from, quotex, id));

          case 375:
            return _context16.abrupt("break", 774);

          case 376:
            if (!(args.length == 0)) {
              _context16.next = 378;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Usar ".concat(prefix, "anime\nPor favor escribe: ").concat(prefix, "anime [consulta]\nejemplo: ").concat(prefix, "anime random\n\n consultas disponibles:\n random, waifu, husbu, neko"), id));

          case 378:
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

            return _context16.abrupt("break", 774);

          case 380:
            if (!(args.length == 0)) {
              _context16.next = 382;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Usar ".concat(prefix, "kpop\nPor favor escribe: ").concat(prefix, "kpop [consulta]\nEjemplos: ").concat(prefix, "kpop bts\n\nconsultas disponibles:\nblackpink, exo, bts"), id));

          case 382:
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

            return _context16.abrupt("break", 774);

          case 384:
            _context16.next = 386;
            return regeneratorRuntime.awrap(meme.random());

          case 386:
            randmeme = _context16.sent;
            cabe.sendFileFromUrl(from, randmeme, '', '', id);
            return _context16.abrupt("break", 774);

          case 389:
            if (!(args.length == 0)) {
              _context16.next = 391;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para buscar im\xE1genes en pinterest\nescriba: ".concat(prefix, "imagen [busqueda]\nejemplo: ").concat(prefix, "imagen naruto"), id));

          case 391:
            cariwall = body.slice(8);
            _context16.next = 394;
            return regeneratorRuntime.awrap(images.fdci(cariwall));

          case 394:
            hasilwall = _context16.sent;
            cabe.sendFileFromUrl(from, hasilwall, '', '', id);
            return _context16.abrupt("break", 774);

          case 397:
            if (!(args.length == 0)) {
              _context16.next = 399;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para buscar im\xE1genes en sub reddit\nescriba: ".concat(prefix, "sreddit [busqueda]\nejemplo: ").concat(prefix, "sreddit naruto"), id));

          case 399:
            carireddit = body.slice(9);
            _context16.next = 402;
            return regeneratorRuntime.awrap(images.sreddit(carireddit));

          case 402:
            hasilreddit = _context16.sent;
            cabe.sendFileFromUrl(from, hasilreddit, '', '', id);
            return _context16.abrupt("break", 774);

          case 405:
            if (!(args.length == 0)) {
              _context16.next = 407;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para buscar recetas de comida\nescribir: ".concat(prefix, "resep [busqueda]\n\nejemplo: ").concat(prefix, "resep tahu"), id));

          case 407:
            cariresep = body.slice(7);
            _context16.next = 410;
            return regeneratorRuntime.awrap(resep.resep(cariresep));

          case 410:
            hasilresep = _context16.sent;
            cabe.reply(from, hasilresep + '\n\nEsta es la receta de la comida ...', id);
            return _context16.abrupt("break", 774);

          case 413:
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
            return _context16.abrupt("break", 774);

          case 416:
            if (!(args.length == 0)) {
              _context16.next = 418;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Acechar la cuenta de Instagram de alguien\nescribir ".concat(prefix, "stalkig [nombre de usuario]\nejemplo: ").concat(prefix, "stalkig ini.arga"), id));

          case 418:
            _context16.next = 420;
            return regeneratorRuntime.awrap(rugaapi.stalkig(args[0]));

          case 420:
            igstalk = _context16.sent;
            _context16.next = 423;
            return regeneratorRuntime.awrap(rugaapi.stalkigpict(args[0]));

          case 423:
            igstalkpict = _context16.sent;
            _context16.next = 426;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, igstalkpict, '', igstalk, id));

          case 426:
            return _context16.abrupt("break", 774);

          case 427:
            if (!(args.length === 1)) {
              _context16.next = 429;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Kirim perintah *!wiki [query]*\nContoh : *!wiki asu*', id));

          case 429:
            query_ = body.slice(6);
            _context16.next = 432;
            return regeneratorRuntime.awrap(get.get("https://es.wikipedia.org/w/api.php".concat(query_)).json());

          case 432:
            wiki = _context16.sent;

            if (wiki.error) {
              cabe.reply(from, wiki.error, id);
            } else {
              cabe.reply(from, "\u27B8 *Query* : ".concat(query_, "\n\n\u27B8 *Result* : ").concat(wiki.result), id);
            }

            return _context16.abrupt("break", 774);

          case 435:
            if (!(args.length == 0)) {
              _context16.next = 437;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para buscar la letra y los acordes de una canci\xF3n\bescribir: ".concat(prefix, "acorde [t\xEDtulo_ canci\xF3n]"), id));

          case 437:
            chordq = body.slice(7);
            _context16.next = 440;
            return regeneratorRuntime.awrap(rugaapi.chord(chordq));

          case 440:
            chordp = _context16.sent;
            _context16.next = 443;
            return regeneratorRuntime.awrap(cabe.reply(from, chordp, id));

          case 443:
            return _context16.abrupt("break", 774);

          case 444:
            if (!(args.length == 0)) {
              _context16.next = 446;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Convertir la captura de pantalla de los bots en una web\n\nUso: ".concat(prefix, "ss [url]\n\nejemplo: ").concat(prefix, "ss http://google.com"), id));

          case 446:
            _context16.next = 448;
            return regeneratorRuntime.awrap(meme.ss(args[0]));

          case 448:
            scrinshit = _context16.sent;
            _context16.next = 451;
            return regeneratorRuntime.awrap(cabe.sendFile(from, scrinshit, 'ss.jpg', 'cekrek', id));

          case 451:
            return _context16.abrupt("break", 774);

          case 452:
            if (!(args.length == 0)) {
              _context16.next = 454;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para buscar canciones de youtube\n\nUtilizar: ".concat(prefix, "play t\xEDtulo de la canci\xF3n"), id));

          case 454:
            axios.get("https://arugaytdl.herokuapp.com/search?q=".concat(body.slice(6))).then(function _callee14(res) {
              return regeneratorRuntime.async(function _callee14$(_context14) {
                while (1) {
                  switch (_context14.prev = _context14.next) {
                    case 0:
                      _context14.next = 2;
                      return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, "".concat(res.data[0].thumbnail), "", "Canci\xF3n encontrada\n\nT\xEDtulo: ".concat(res.data[0].title, "\nDuracion: ").concat(res.data[0].duration, "segundos\nSubido: ").concat(res.data[0].uploadDate, "\nVistas: ").concat(res.data[0].viewCount, "\n\nest\xE1 siendo enviado"), id));

                    case 2:
                      rugaapi.ytmp3("https://youtu.be/".concat(res.data[0].id)).then(function _callee13(res) {
                        return regeneratorRuntime.async(function _callee13$(_context13) {
                          while (1) {
                            switch (_context13.prev = _context13.next) {
                              case 0:
                                if (!(res.status == 'error')) {
                                  _context13.next = 2;
                                  break;
                                }

                                return _context13.abrupt("return", cabe.sendFileFromUrl(from, "".concat(res.link), '', "".concat(res.error)));

                              case 2:
                                _context13.next = 4;
                                return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, "".concat(res.thumb), '', "Canci\xF3n encontrada\n\nT\xEDtulo ".concat(res.title, "\n\nPaciencia, enviada de nuevo"), id));

                              case 4:
                                _context13.next = 6;
                                return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, "".concat(res.link), '', '', id)["catch"](function () {
                                  cabe.reply(from, "ESTA URL ".concat(args[0], " YA DESCARGADO ANTERIORMENTE... LA URL SE REINICIAR\xC1 DESPU\xC9S DE 60 MINUTOS"), id);
                                }));

                              case 6:
                              case "end":
                                return _context13.stop();
                            }
                          }
                        });
                      });

                    case 3:
                    case "end":
                      return _context14.stop();
                  }
                }
              });
            })["catch"](function () {
              cabe.reply(from, 'Hay un error!', id);
            });
            return _context16.abrupt("break", 774);

          case 456:
            if (!(isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image')) {
              _context16.next = 472;
              break;
            }

            if (!isMedia) {
              _context16.next = 463;
              break;
            }

            _context16.next = 460;
            return regeneratorRuntime.awrap(decryptMedia(message, uaOverride));

          case 460:
            mediaData = _context16.sent;
            _context16.next = 466;
            break;

          case 463:
            _context16.next = 465;
            return regeneratorRuntime.awrap(decryptMedia(quotedMsg, uaOverride));

          case 465:
            mediaData = _context16.sent;

          case 466:
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

            _context16.next = 473;
            break;

          case 472:
            cabe.reply(from, "Lo siento, el formato es incorrecto\n\nEnv\xEDe una foto con un t\xEDtulo ".concat(prefix, "whatanime\n\nO responde a las fotos con subt\xEDtulos ").concat(prefix, "whatanime"), id);

          case 473:
            return _context16.abrupt("break", 774);

          case 474:
            rugaapi.cersex().then(function _callee15(res) {
              return regeneratorRuntime.async(function _callee15$(_context15) {
                while (1) {
                  switch (_context15.prev = _context15.next) {
                    case 0:
                      _context15.next = 2;
                      return regeneratorRuntime.awrap(cabe.reply(from, res.result, id));

                    case 2:
                    case "end":
                      return _context15.stop();
                  }
                }
              });
            });
            return _context16.abrupt("break", 774);

          case 476:
            if (!(args.length !== 2)) {
              _context16.next = 478;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto.\nIntroduzca su mensaje con ".concat(prefix, "resi <mensajero> <no_resi>\n\nKurir yang tersedia:\njne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex"), id));

          case 478:
            kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex'];

            if (kurirs.includes(args[0])) {
              _context16.next = 481;
              break;
            }

            return _context16.abrupt("return", cabe.sendText(from, "Lo sentimos, el tipo de expedici\xF3n de env\xEDo no es compatible. Este servicio solo admite expedici\xF3n de env\xEDo ".concat(kurirs.join(', '), " Por favor revise de nuevo.")));

          case 481:
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0]);
            cekResi(args[0], args[1]).then(function (result) {
              return cabe.sendText(from, result);
            });
            return _context16.abrupt("break", 774);

          case 484:
            if (!(args.length == 0)) {
              _context16.next = 486;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Cambiar texto a sonido (voz de Google) \n tipo: ".concat(prefix, "tts <c\xF3digo de idioma> <texto> \n ejemplos: ").concat(prefix, "tts es hola \n para ver el c\xF3digo de idioma aqu\xED: https://anotepad.com/note/read/5xqahdy8")));

          case 486:
            ttsGB = require('node-gtts')(args[0]);
            dataText = body.slice(8);

            if (!(dataText === '')) {
              _context16.next = 490;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'cual es el texto..', id));

          case 490:
            try {
              ttsGB.save('./media/tts.mp3', dataText, function () {
                cabe.sendPtt(from, './media/tts.mp3', id);
              });
            } catch (err) {
              cabe.reply(from, err, id);
            }

            return _context16.abrupt("break", 774);

          case 492:
            if (!(args.length != 1)) {
              _context16.next = 494;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ".concat(prefix, "translate <kode_bahasa>\ncontoh ").concat(prefix, "translate id"), id));

          case 494:
            if (quotedMsg) {
              _context16.next = 496;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ".concat(prefix, "translate <kode_bahasa>\ncontoh ").concat(prefix, "translate id"), id));

          case 496:
            quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : '';
            translate(quoteText, args[0]).then(function (result) {
              return cabe.sendText(from, result);
            })["catch"](function () {
              return cabe.sendText(from, 'Error, Kode bahasa salah.');
            });
            return _context16.abrupt("break", 774);

          case 499:
            if (!(args.length == 0)) {
              _context16.next = 501;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "ketik ".concat(prefix, "shortlink <url>"), message.id));

          case 501:
            if (isUrl(args[0])) {
              _context16.next = 503;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Maaf, url yang kamu kirim tidak valid.', message.id));

          case 503:
            _context16.next = 505;
            return regeneratorRuntime.awrap(urlShortener(args[0]));

          case 505:
            shortlink = _context16.sent;
            _context16.next = 508;
            return regeneratorRuntime.awrap(cabe.sendText(from, shortlink));

          case 508:
            return _context16.abrupt("break", 774);

          case 509:
            if (isGroupMsg) {
              _context16.next = 511;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id));

          case 511:
            if (isGroupAdmins) {
              _context16.next = 513;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo!', id));

          case 513:
            if (isBotGroupAdmins) {
              _context16.next = 515;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como admin del grupo!', id));

          case 515:
            if (!(args.length !== 1)) {
              _context16.next = 517;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Usar ".concat(prefix, "agregar\nUtilizar: ").concat(prefix, "agregar <numero>\nejemplo: ").concat(prefix, "agregar 54xxxxxx"), id));

          case 517:
            _context16.prev = 517;
            _context16.next = 520;
            return regeneratorRuntime.awrap(cabe.addParticipant(from, "".concat(args[0], "@c.us")).then(function () {
              return cabe.reply(from, 'Hola bienvenido', id);
            }));

          case 520:
            _context16.next = 525;
            break;

          case 522:
            _context16.prev = 522;
            _context16.t7 = _context16["catch"](517);
            cabe.reply(from, 'No se pudo agregar el objetivo', id);

          case 525:
            return _context16.abrupt("break", 774);

          case 526:
            if (isGroupMsg) {
              _context16.next = 528;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 528:
            if (isGroupAdmins) {
              _context16.next = 530;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 530:
            if (isBotGroupAdmins) {
              _context16.next = 532;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como admin del grupo.', id));

          case 532:
            if (!(mentionedJidList.length === 0)) {
              _context16.next = 534;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n etiquete a una o más personas para eliminar del grupo', id));

          case 534:
            if (!(mentionedJidList[0] === botNumber)) {
              _context16.next = 538;
              break;
            }

            _context16.next = 537;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n No puedo expulsar la cuenta del bot por mí mismo', id));

          case 537:
            return _context16.abrupt("return", _context16.sent);

          case 538:
            _context16.next = 540;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, "Solicitud recibida, problema:\n".concat(mentionedJidList.map(function (x) {
              return "@".concat(x.replace('@c.us', ''));
            }).join('\n'))));

          case 540:
            i = 0;

          case 541:
            if (!(i < mentionedJidList.length)) {
              _context16.next = 551;
              break;
            }

            if (!groupAdmins.includes(mentionedJidList[i])) {
              _context16.next = 546;
              break;
            }

            _context16.next = 545;
            return regeneratorRuntime.awrap(cabe.sendText(from, 'Error, no puede eliminar a el admin del grupo.'));

          case 545:
            return _context16.abrupt("return", _context16.sent);

          case 546:
            _context16.next = 548;
            return regeneratorRuntime.awrap(cabe.removeParticipant(groupId, mentionedJidList[i]));

          case 548:
            i++;
            _context16.next = 541;
            break;

          case 551:
            return _context16.abrupt("break", 774);

          case 552:
            if (isGroupMsg) {
              _context16.next = 554;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 554:
            if (isGroupAdmins) {
              _context16.next = 556;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 556:
            if (isBotGroupAdmins) {
              _context16.next = 558;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como administrador de grupo.', id));

          case 558:
            if (!(mentionedJidList.length !== 1)) {
              _context16.next = 560;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, solo puedo promover a 1 usuario', id));

          case 560:
            if (!groupAdmins.includes(mentionedJidList[0])) {
              _context16.next = 564;
              break;
            }

            _context16.next = 563;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo siento, el usuario ya es admin.', id));

          case 563:
            return _context16.abrupt("return", _context16.sent);

          case 564:
            if (!(mentionedJidList[0] === botNumber)) {
              _context16.next = 568;
              break;
            }

            _context16.next = 567;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n no se puede promover la cuenta del bot por sí solo', id));

          case 567:
            return _context16.abrupt("return", _context16.sent);

          case 568:
            _context16.next = 570;
            return regeneratorRuntime.awrap(cabe.promoteParticipant(groupId, mentionedJidList[0]));

          case 570:
            _context16.next = 572;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, "Solicitud aceptada, agregad@ @".concat(mentionedJidList[0].replace('@c.us', ''), " como admin.")));

          case 572:
            return _context16.abrupt("break", 774);

          case 573:
            if (isGroupMsg) {
              _context16.next = 575;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 575:
            if (isGroupAdmins) {
              _context16.next = 577;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 577:
            if (isBotGroupAdmins) {
              _context16.next = 579;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como administrador de grupo.', id));

          case 579:
            if (!(mentionedJidList.length !== 1)) {
              _context16.next = 581;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, solo se puede degradar a 1 usuario', id));

          case 581:
            if (groupAdmins.includes(mentionedJidList[0])) {
              _context16.next = 585;
              break;
            }

            _context16.next = 584;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el usuario aún no es administrador.', id));

          case 584:
            return _context16.abrupt("return", _context16.sent);

          case 585:
            if (!(mentionedJidList[0] === botNumber)) {
              _context16.next = 589;
              break;
            }

            _context16.next = 588;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n No se puede eliminar la cuenta del bot.', id));

          case 588:
            return _context16.abrupt("return", _context16.sent);

          case 589:
            _context16.next = 591;
            return regeneratorRuntime.awrap(cabe.demoteParticipant(groupId, mentionedJidList[0]));

          case 591:
            _context16.next = 593;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, "Solicitud aceptada, eliminar posici\xF3n @".concat(mentionedJidList[0].replace('@c.us', ''), ".")));

          case 593:
            return _context16.abrupt("break", 774);

          case 594:
            if (isGroupMsg) {
              _context16.next = 596;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 596:
            if (isGroupAdmins) {
              _context16.next = 598;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo.', id));

          case 598:
            cabe.sendText(from, 'Adiós, ya no me quieren aqui...( ⇀‸↼‶ )').then(function () {
              return cabe.leaveGroup(groupId);
            });
            return _context16.abrupt("break", 774);

          case 600:
            if (isGroupAdmins) {
              _context16.next = 602;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo!', id));

          case 602:
            if (quotedMsg) {
              _context16.next = 604;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto, por favor. \n Responde enviar un mensaje al bot con un t\xEDtulo ".concat(prefix, "borrar"), id));

          case 604:
            if (quotedMsgObj.fromMe) {
              _context16.next = 606;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto, por favor. \n Responde enviar un mensaje al bot con el t\xEDtulo ".concat(prefix, "borrar"), id));

          case 606:
            cabe.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
            return _context16.abrupt("break", 774);

          case 608:
            if (isGroupMsg) {
              _context16.next = 610;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 610:
            if (isGroupAdmins) {
              _context16.next = 612;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo.', id));

          case 612:
            _context16.next = 614;
            return regeneratorRuntime.awrap(cabe.getGroupMembers(groupId));

          case 614:
            groupMem = _context16.sent;
            hehex = '╔══✪〘 Mencionar a todos 〙✪══\n';

            for (_i = 0; _i < groupMem.length; _i++) {
              hehex += '╠➥';
              hehex += " @".concat(groupMem[_i].id.replace(/@c.us/g, ''), "\n");
            }

            hehex += '╚═〘 *CABE  B O T* 〙';
            _context16.next = 620;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, hehex));

          case 620:
            return _context16.abrupt("break", 774);

          case 621:
            _context16.next = 623;
            return regeneratorRuntime.awrap(cabe.getAmountOfLoadedMessages());

          case 623:
            loadedMsg = _context16.sent;
            _context16.next = 626;
            return regeneratorRuntime.awrap(cabe.getAllChatIds());

          case 626:
            chatIds = _context16.sent;
            _context16.next = 629;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 629:
            groups = _context16.sent;
            cabe.sendText(from, "Estado :\n- *".concat(loadedMsg, "* Mensajes cargados\n- *").concat(groups.length, "* Chats grupales\n- *").concat(chatIds.length - groups.length, "* Chats personales\n- *").concat(chatIds.length, "* Total de chats"));
            return _context16.abrupt("break", 774);

          case 632:
            if (isGroupMsg) {
              _context16.next = 634;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 634:
            isOwner = chat.groupMetadata.owner == sender.id;

            if (isOwner) {
              _context16.next = 637;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo puede ser utilizado por el propietario del grupo.', id));

          case 637:
            if (isBotGroupAdmins) {
              _context16.next = 639;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como admin del grupo.', id));

          case 639:
            _context16.next = 641;
            return regeneratorRuntime.awrap(cabe.getGroupMembers(groupId));

          case 641:
            allMem = _context16.sent;
            _i2 = 0;

          case 643:
            if (!(_i2 < allMem.length)) {
              _context16.next = 652;
              break;
            }

            if (!groupAdmins.includes(allMem[_i2].id)) {
              _context16.next = 647;
              break;
            }

            _context16.next = 649;
            break;

          case 647:
            _context16.next = 649;
            return regeneratorRuntime.awrap(cabe.removeParticipant(groupId, allMem[_i2].id));

          case 649:
            _i2++;
            _context16.next = 643;
            break;

          case 652:
            cabe.reply(from, 'Exito expulsar a todos los miembros', id);
            return _context16.abrupt("break", 774);

          case 654:
            if (isOwnerBot) {
              _context16.next = 656;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, '¡Este pedido es solo para el propietario del bot!', id));

          case 656:
            if (!(args.length == 0)) {
              _context16.next = 658;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Prohibir que alguien use comandos\n\nEscribir: \n".concat(prefix, "ban add 54xx --Activar\n").concat(prefix, "ban del 54xx --deshabilitar\n\nc\xF3mo prohibir r\xE1pidamente muchos tipos en grupos:\n").concat(prefix, "ban @tag @tag @tag"), id));

          case 658:
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

            return _context16.abrupt("break", 774);

          case 660:
            if (isOwnerBot) {
              _context16.next = 662;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, '¡Este pedido es solo para el propietario del bot!', id));

          case 662:
            if (!(args.length == 0)) {
              _context16.next = 664;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, "Para transmitir a todos los chats, escriba:\n".concat(prefix, "bc [rellenar el chat]")));

          case 664:
            msg = body.slice(4);
            _context16.next = 667;
            return regeneratorRuntime.awrap(cabe.getAllChatIds());

          case 667:
            chatz = _context16.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context16.prev = 671;
            _iterator = chatz[Symbol.iterator]();

          case 673:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context16.next = 683;
              break;
            }

            idk = _step.value;
            _context16.next = 677;
            return regeneratorRuntime.awrap(cabe.getChatById(idk));

          case 677:
            cvk = _context16.sent;
            if (!cvk.isReadOnly) cabe.sendText(idk, "\u3018 *C A B E  B C* \u3019\n\n".concat(msg));
            if (cvk.isReadOnly) cabe.sendText(idk, "\u3018 *C A B E  B C* \u3019\n\n".concat(msg));

          case 680:
            _iteratorNormalCompletion = true;
            _context16.next = 673;
            break;

          case 683:
            _context16.next = 689;
            break;

          case 685:
            _context16.prev = 685;
            _context16.t8 = _context16["catch"](671);
            _didIteratorError = true;
            _iteratorError = _context16.t8;

          case 689:
            _context16.prev = 689;
            _context16.prev = 690;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 692:
            _context16.prev = 692;

            if (!_didIteratorError) {
              _context16.next = 695;
              break;
            }

            throw _iteratorError;

          case 695:
            return _context16.finish(692);

          case 696:
            return _context16.finish(689);

          case 697:
            cabe.reply(from, 'Éxito de la transmisión!', id);
            return _context16.abrupt("break", 774);

          case 699:
            if (isOwnerBot) {
              _context16.next = 701;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Este comando es solo para el propietario del bot', id));

          case 701:
            _context16.next = 703;
            return regeneratorRuntime.awrap(cabe.getAllChatIds());

          case 703:
            allChatz = _context16.sent;
            _context16.next = 706;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 706:
            allGroupz = _context16.sent;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context16.prev = 710;
            _iterator2 = allGroupz[Symbol.iterator]();

          case 712:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context16.next = 723;
              break;
            }

            gclist = _step2.value;
            _context16.next = 716;
            return regeneratorRuntime.awrap(cabe.sendText(gclist.contact.id, "Lo siento, el bot est\xE1 limpiando, el chat total est\xE1 activo : ".concat(allChatz.length)));

          case 716:
            _context16.next = 718;
            return regeneratorRuntime.awrap(cabe.leaveGroup(gclist.contact.id));

          case 718:
            _context16.next = 720;
            return regeneratorRuntime.awrap(cabe.deleteChat(gclist.contact.id));

          case 720:
            _iteratorNormalCompletion2 = true;
            _context16.next = 712;
            break;

          case 723:
            _context16.next = 729;
            break;

          case 725:
            _context16.prev = 725;
            _context16.t9 = _context16["catch"](710);
            _didIteratorError2 = true;
            _iteratorError2 = _context16.t9;

          case 729:
            _context16.prev = 729;
            _context16.prev = 730;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 732:
            _context16.prev = 732;

            if (!_didIteratorError2) {
              _context16.next = 735;
              break;
            }

            throw _iteratorError2;

          case 735:
            return _context16.finish(732);

          case 736:
            return _context16.finish(729);

          case 737:
            cabe.reply(from, 'Exito dejar todo el grupo!', id);
            return _context16.abrupt("break", 774);

          case 739:
            if (isOwnerBot) {
              _context16.next = 741;
              break;
            }

            return _context16.abrupt("return", cabe.reply(from, 'Este comando es solo para el propietario del bot', id));

          case 741:
            _context16.next = 743;
            return regeneratorRuntime.awrap(cabe.getAllChats());

          case 743:
            allChatx = _context16.sent;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context16.prev = 747;
            _iterator3 = allChatx[Symbol.iterator]();

          case 749:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context16.next = 756;
              break;
            }

            dchat = _step3.value;
            _context16.next = 753;
            return regeneratorRuntime.awrap(cabe.deleteChat(dchat.id));

          case 753:
            _iteratorNormalCompletion3 = true;
            _context16.next = 749;
            break;

          case 756:
            _context16.next = 762;
            break;

          case 758:
            _context16.prev = 758;
            _context16.t10 = _context16["catch"](747);
            _didIteratorError3 = true;
            _iteratorError3 = _context16.t10;

          case 762:
            _context16.prev = 762;
            _context16.prev = 763;

            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }

          case 765:
            _context16.prev = 765;

            if (!_didIteratorError3) {
              _context16.next = 768;
              break;
            }

            throw _iteratorError3;

          case 768:
            return _context16.finish(765);

          case 769:
            return _context16.finish(762);

          case 770:
            cabe.reply(from, 'Tiene éxito borrar todo el chat!', id);
            return _context16.abrupt("break", 774);

          case 772:
            console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Comando no registrado de', color(pushname));
            return _context16.abrupt("break", 774);

          case 774:
            _context16.next = 779;
            break;

          case 776:
            _context16.prev = 776;
            _context16.t11 = _context16["catch"](1);
            console.log(color('[ERROR]', 'red'), _context16.t11);

          case 779:
          case "end":
            return _context16.stop();
        }
      }
    }, null, null, [[1, 776], [108, 124], [208, 215], [285, 302], [325, 338], [517, 522], [671, 685, 689, 697], [690,, 692, 696], [710, 725, 729, 737], [730,, 732, 736], [747, 758, 762, 770], [763,, 765, 769]]);
  });
};

create('cabe', options(true, start)).then(function (cabe) {
  return start(cabe);
})["catch"](function (err) {
  return new Error(err);
});