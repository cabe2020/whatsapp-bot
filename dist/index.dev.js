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
            _context15.next = _context15.t2 === 'velocidad' ? 47 : _context15.t2 === 'ping' ? 47 : _context15.t2 === 'tnc' ? 50 : _context15.t2 === 'menu' ? 53 : _context15.t2 === 'help' ? 53 : _context15.t2 === 'menuadmin' ? 56 : _context15.t2 === 'donar' ? 63 : _context15.t2 === 'donar' ? 63 : _context15.t2 === 'propietario del bot' ? 66 : _context15.t2 === 'join' ? 69 : _context15.t2 === 'sticker' ? 93 : _context15.t2 === 'stiker' ? 93 : _context15.t2 === 'stickergif' ? 138 : _context15.t2 === 'stikergif' ? 138 : _context15.t2 === 'stikergiphy' ? 156 : _context15.t2 === 'stickergiphy' ? 156 : _context15.t2 === 'meme' ? 180 : _context15.t2 === 'quotemaker' ? 199 : _context15.t2 === 'escribir' ? 219 : _context15.t2 === 'nulis' ? 219 : _context15.t2 === 'instagram' ? 228 : _context15.t2 === 'tiktok' ? 236 : _context15.t2 === 'twt' ? 244 : _context15.t2 === 'twitter' ? 244 : _context15.t2 === 'fb' ? 252 : _context15.t2 === 'facebook' ? 252 : _context15.t2 === 'ytmp3' ? 260 : _context15.t2 === 'ytmp4' ? 268 : _context15.t2 === 'xnxx' ? 276 : _context15.t2 === 'google' ? 310 : _context15.t2 === 'googleimage' ? 320 : _context15.t2 === 'nsfw' ? 345 : _context15.t2 === 'simisimi' ? 353 : _context15.t2 === 'simi' ? 357 : _context15.t2 === 'fakta' ? 365 : _context15.t2 === 'katabijak' ? 367 : _context15.t2 === 'pantun' ? 369 : _context15.t2 === 'quote' ? 371 : _context15.t2 === 'anime' ? 377 : _context15.t2 === 'kpop' ? 381 : _context15.t2 === 'memes' ? 385 : _context15.t2 === 'imagen' ? 390 : _context15.t2 === 'images' ? 390 : _context15.t2 === 'sreddit' ? 398 : _context15.t2 === 'resep' ? 406 : _context15.t2 === 'nekopoi' ? 414 : _context15.t2 === 'stalkig' ? 417 : _context15.t2 === 'wiki' ? 428 : _context15.t2 === 'acorde' ? 436 : _context15.t2 === 'ss' ? 445 : _context15.t2 === 'play' ? 453 : _context15.t2 === 'whatanime' ? 457 : _context15.t2 === 'cersex' ? 475 : _context15.t2 === 'resi' ? 477 : _context15.t2 === 'tts' ? 485 : _context15.t2 === 'translate' ? 493 : _context15.t2 === 'shortlink' ? 500 : _context15.t2 === 'agregar' ? 510 : _context15.t2 === 'eliminar' ? 527 : _context15.t2 === 'promover' ? 553 : _context15.t2 === 'degradar' ? 574 : _context15.t2 === 'bye' ? 595 : _context15.t2 === 'borrar' ? 601 : _context15.t2 === 'lista' ? 609 : _context15.t2 === 'lista' ? 609 : _context15.t2 === 'botstat' ? 622 : _context15.t2 === 'kickall' ? 633 : _context15.t2 === 'ban' ? 655 : _context15.t2 === 'bc' ? 661 : _context15.t2 === 'leaveall' ? 700 : _context15.t2 === 'clearall' ? 740 : 773;
            break;

          case 47:
            _context15.next = 49;
            return regeneratorRuntime.awrap(cabe.sendText(from, "Pong!!!!\nvelocidad: ".concat(processTime(t, moment()), " _Segundos_")));

          case 49:
            return _context15.abrupt("break", 775);

          case 50:
            _context15.next = 52;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textTnC()));

          case 52:
            return _context15.abrupt("break", 775);

          case 53:
            _context15.next = 55;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textMenu(pushname)).then(function () {
              return isGroupMsg && isGroupAdmins ? cabe.sendText(from, "Men\xFA de admins del grupo: *".concat(prefix, "menuadmin*")) : null;
            }));

          case 55:
            return _context15.abrupt("break", 775);

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
            return _context15.abrupt("break", 775);

          case 63:
            _context15.next = 65;
            return regeneratorRuntime.awrap(cabe.sendText(from, menuId.textDonasi()));

          case 65:
            return _context15.abrupt("break", 775);

          case 66:
            _context15.next = 68;
            return regeneratorRuntime.awrap(cabe.sendContact(from, ownerNumber).then(function () {
              return cabe.sedText(from, 'Si desea donar lo puede hacer por PayPal https://www.paypal.com/paypalme/cabegus?locale.x=es_XC!');
            }));

          case 68:
            return _context15.abrupt("break", 775);

          case 69:
            if (!(args.length == 0)) {
              _context15.next = 71;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Si desea invitar al bot al grupo, inv\xEDtelo o escriba ".concat(prefix, "join [link del grupo]"), id));

          case 71:
            linkgrup = body.slice(6);
            islink = linkgrup.match(/(https:\/\/chat.whatsapp.com)/gi);
            _context15.next = 75;
            return regeneratorRuntime.awrap(cabe.inviteInfo(linkgrup));

          case 75:
            chekgrup = _context15.sent;

            if (islink) {
              _context15.next = 78;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo siento, el enlace del grupo es incorrecto, enviar el enlace correcto', id));

          case 78:
            if (!isOwnerBot) {
              _context15.next = 83;
              break;
            }

            _context15.next = 81;
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

          case 81:
            _context15.next = 92;
            break;

          case 83:
            _context15.next = 85;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 85:
            cgrup = _context15.sent;

            if (!(cgrup.length > groupLimit)) {
              _context15.next = 88;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo siento, el grupo de este bot est\xE1 completo\nEl grupo m\xE1ximo es: ".concat(groupLimit), id));

          case 88:
            if (!(cgrup.size < memberLimit)) {
              _context15.next = 90;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo siento, CABE-BOT no se unir\xE1 si los miembros del grupo no superan las".concat(memberLimit, " personas"), id));

          case 90:
            _context15.next = 92;
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

          case 92:
            return _context15.abrupt("break", 775);

          case 93:
            if (!((isMedia || isQuotedImage) && args.length === 0)) {
              _context15.next = 103;
              break;
            }

            encryptMedia = isQuotedImage ? quotedMsg : message;
            _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype;
            _context15.next = 98;
            return regeneratorRuntime.awrap(decryptMedia(encryptMedia, uaOverride));

          case 98:
            _mediaData = _context15.sent;
            _imageBase = "data:".concat(_mimetype, ";base64,").concat(_mediaData.toString('base64'));
            cabe.sendImageAsSticker(from, _imageBase).then(function () {
              cabe.reply(from, 'Aqui esta tu sticker(si el sticker sale mal, intentar recortarlo he intentar de nuevo)');
              console.log("Sticker procesado por ".concat(processTime(t, moment()), " Segundo"));
            });
            _context15.next = 137;
            break;

          case 103:
            if (!(args[0] === 'nobg')) {
              _context15.next = 128;
              break;
            }

            if (!(isMedia || isQuotedImage)) {
              _context15.next = 126;
              break;
            }

            _context15.prev = 105;
            _context15.next = 108;
            return regeneratorRuntime.awrap(decryptMedia(message, uaOverride));

          case 108:
            mediaData = _context15.sent;
            imageBase64 = "data:".concat(mimetype, ";base64,").concat(mediaData.toString('base64'));
            base64img = imageBase64;
            outFile = './media/noBg.png'; // kamu dapat mengambil api key dari website remove.bg dan ubahnya difolder settings/api.json

            _context15.next = 114;
            return regeneratorRuntime.awrap(removeBackgroundFromImageBase64({
              base64img: base64img,
              apiKey: apiNoBg,
              size: 'auto',
              type: 'auto',
              outFile: outFile
            }));

          case 114:
            result = _context15.sent;
            _context15.next = 117;
            return regeneratorRuntime.awrap(fs.writeFile(outFile, result.base64img));

          case 117:
            _context15.next = 119;
            return regeneratorRuntime.awrap(cabe.sendImageAsSticker(from, "data:".concat(mimetype, ";base64,").concat(result.base64img)));

          case 119:
            _context15.next = 126;
            break;

          case 121:
            _context15.prev = 121;
            _context15.t3 = _context15["catch"](105);
            console.log(_context15.t3);
            _context15.next = 126;
            return regeneratorRuntime.awrap(cabe.reply(from, 'lo siento, el límite de uso de hoy es máximo', id));

          case 126:
            _context15.next = 137;
            break;

          case 128:
            if (!(args.length === 1)) {
              _context15.next = 135;
              break;
            }

            if (isUrl(url)) {
              _context15.next = 132;
              break;
            }

            _context15.next = 132;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el enlace que envió no es válido.', id));

          case 132:
            cabe.sendStickerfromUrl(from, url).then(function (r) {
              return !r && r !== undefined ? cabe.sendText(from, 'Lo sentimos, el enlace que envió no contiene una imagen.') : cabe.reply(from, 'Aqui esta tu sticker');
            }).then(function () {
              return console.log("Sticker Procesado por ".concat(processTime(t, moment()), " Segundo"));
            });
            _context15.next = 137;
            break;

          case 135:
            _context15.next = 137;
            return regeneratorRuntime.awrap(cabe.reply(from, "\xA1Sin imagen! Usar ".concat(prefix, "sticker\n\n\nEnviar im\xE1genes con subt\xEDtulos\n").concat(prefix, "sticker <usual>\n").concat(prefix, "sticker nobg <sin fondo>\n\n o enviar mensaje con\n").concat(prefix, "sticker <link>"), id));

          case 137:
            return _context15.abrupt("break", 775);

          case 138:
            if (!(isMedia || isQuotedVideo)) {
              _context15.next = 154;
              break;
            }

            if (!(mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10)) {
              _context15.next = 151;
              break;
            }

            _context15.next = 142;
            return regeneratorRuntime.awrap(decryptMedia(message, uaOverride));

          case 142:
            mediaData = _context15.sent;
            cabe.reply(from, '[ESPERAR] En curso⏳ espere ± 1 min.', id);
            filename = "./media/stickergif.".concat(mimetype.split('/')[1]);
            _context15.next = 147;
            return regeneratorRuntime.awrap(fs.writeFileSync(filename, mediaData));

          case 147:
            _context15.next = 149;
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

          case 149:
            _context15.next = 152;
            break;

          case 151:
            cabe.reply(from, "[\u2757] Enviar un gif con el t\xEDtulo *".concat(prefix, "stickergif* max 10 seg!"), id);

          case 152:
            _context15.next = 155;
            break;

          case 154:
            cabe.reply(from, "[\u2757] Enviar un gif con el titulo *".concat(prefix, "stickergif*"), id);

          case 155:
            return _context15.abrupt("break", 775);

          case 156:
            if (!(args.length !== 1)) {
              _context15.next = 158;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto. \nescribe el mensaje con".concat(prefix, "stickergiphy <link de giphy https://giphy.com/>"), id));

          case 158:
            isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'));
            isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'));

            if (!isGiphy) {
              _context15.next = 169;
              break;
            }

            getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'));

            if (getGiphyCode) {
              _context15.next = 164;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'No se pudo recuperar el código giphy', id));

          case 164:
            giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '');
            smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif';
            cabe.sendGiphyAsSticker(from, smallGifUrl).then(function () {
              cabe.reply(from, 'Aqui esta tu sticker');
              console.log("Sticker Procesado por ".concat(processTime(t, moment()), " Segundo"));
            })["catch"](function (err) {
              return console.log(err);
            });
            _context15.next = 179;
            break;

          case 169:
            if (!isMediaGiphy) {
              _context15.next = 177;
              break;
            }

            gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'));

            if (gifUrl) {
              _context15.next = 173;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'No se pudo recuperar el código giphy', id));

          case 173:
            _smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif');
            cabe.sendGiphyAsSticker(from, _smallGifUrl).then(function () {
              cabe.reply(from, 'Aqui esta tu sticker');
              console.log("Sticker Procesado ".concat(processTime(t, moment()), " Segundo"));
            })["catch"](function (err) {
              return console.log(err);
            });
            _context15.next = 179;
            break;

          case 177:
            _context15.next = 179;
            return regeneratorRuntime.awrap(cabe.reply(from, 'lo siento, los comandos de la etiqueta giphy solo pueden usar enlaces de giphy.  [Solo Giphy]', id));

          case 179:
            return _context15.abrupt("break", 775);

          case 180:
            if (!((isMedia || isQuotedImage) && args.length >= 2)) {
              _context15.next = 196;
              break;
            }

            top = arg.split('|')[0];
            bottom = arg.split('|')[1];
            _encryptMedia = isQuotedImage ? quotedMsg : message;
            _context15.next = 186;
            return regeneratorRuntime.awrap(decryptMedia(_encryptMedia, uaOverride));

          case 186:
            _mediaData2 = _context15.sent;
            _context15.next = 189;
            return regeneratorRuntime.awrap(uploadImages(_mediaData2, false));

          case 189:
            getUrl = _context15.sent;
            _context15.next = 192;
            return regeneratorRuntime.awrap(meme.custom(getUrl, top, bottom));

          case 192:
            ImageBase64 = _context15.sent;
            cabe.sendFile(from, ImageBase64, 'image.png', '', null, true).then(function (serialized) {
              return console.log("Env\xEDo exitoso de archivos con ID: ".concat(serialized, " procesada durante ").concat(processTime(t, moment())));
            })["catch"](function (err) {
              return console.error(err);
            });
            _context15.next = 198;
            break;

          case 196:
            _context15.next = 198;
            return regeneratorRuntime.awrap(cabe.reply(from, "\xA1Sin imagen! Env\xEDe una imagen con la descripcion. ".concat(prefix, "meme <texto superior> | <texto abajo>\nejemplo: ").concat(prefix, "meme texto superior | texto de abajo "), id));

          case 198:
            return _context15.abrupt("break", 775);

          case 199:
            qmaker = body.trim().split('|');

            if (!(qmaker.length >= 3)) {
              _context15.next = 217;
              break;
            }

            quotes = qmaker[1];
            author = qmaker[2];
            theme = qmaker[3];
            cabe.reply(from, 'versos como', id);
            _context15.prev = 205;
            _context15.next = 208;
            return regeneratorRuntime.awrap(images.quote(quotes, author, theme));

          case 208:
            hasilqmaker = _context15.sent;
            cabe.sendFileFromUrl(from, "".concat(hasilqmaker), '', 'Este es hermano ...', id);
            _context15.next = 215;
            break;

          case 212:
            _context15.prev = 212;
            _context15.t4 = _context15["catch"](205);
            cabe.reply('bueno, el proceso falló, hermano, el contenido es correcto, ¿no?..', id);

          case 215:
            _context15.next = 218;
            break;

          case 217:
            cabe.reply(from, "Usar ".concat(prefix, "quotemaker |cita de isi|autor|tema \n\n ejemplo: ").concat(prefix, "quotemaker |Te amo|CabeBot|aleatorio \n\n para el tema usar random s\xED hermano.."));

          case 218:
            return _context15.abrupt("break", 775);

          case 219:
            if (!(args.length == 0)) {
              _context15.next = 221;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Haz que el bot escriba el texto que se env\xEDa como imagen\nUilizar: ".concat(prefix, "escribir [texto]\n\nEjemplo: ").concat(prefix, "escribir hola me llamo Cabebot y mi version es 1.2"), id));

          case 221:
            nulisq = body.slice(7);
            _context15.next = 224;
            return regeneratorRuntime.awrap(rugaapi.tulis(nulisq));

          case 224:
            nulisp = _context15.sent;
            _context15.next = 227;
            return regeneratorRuntime.awrap(cabe.sendImage(from, "".concat(nulisp), '', 'Aqui esta tu texto', id)["catch"](function () {
              cabe.reply(from, '¡Hay un Error!', id);
            }));

          case 227:
            return _context15.abrupt("break", 775);

          case 228:
            if (!(args.length == 0)) {
              _context15.next = 230;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para descargar im\xE1genes o videos de instagram \n escriba: ".concat(prefix, "instagram [link_ig]"), id));

          case 230:
            _context15.next = 232;
            return regeneratorRuntime.awrap(rugaapi.insta(args[0]));

          case 232:
            instag = _context15.sent;
            _context15.next = 235;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, instag, '', '', id));

          case 235:
            return _context15.abrupt("break", 775);

          case 236:
            if (!(args.length !== 1)) {
              _context15.next = 238;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id));

          case 238:
            if (!(!is.Url(url) && !url.includes('tiktok.com'))) {
              _context15.next = 240;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el enlace que envió no es válido. [Enlace no válido]', id));

          case 240:
            _context15.next = 242;
            return regeneratorRuntime.awrap(cabe.reply(from, "_Extracci\xF3n de metadatos ..._ \n\n".concat(menuId.textDonasi()), id));

          case 242:
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
            return _context15.abrupt("break", 775);

          case 244:
            if (!(args.length !== 1)) {
              _context15.next = 246;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id));

          case 246:
            if (!(!is.Url(url) || !url.includes('twitter.com') || url.includes('t.co'))) {
              _context15.next = 248;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, la URL que envió no es válida. [Enlace no válido]', id));

          case 248:
            _context15.next = 250;
            return regeneratorRuntime.awrap(cabe.reply(from, "_Scraping Metadata..._ \n\n".concat(menuId.textDonasi()), id));

          case 250:
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
            return _context15.abrupt("break", 775);

          case 252:
            if (!(args.length !== 1)) {
              _context15.next = 254;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto, consulte el menú. [Formato erróneo]', id));

          case 254:
            if (!(!is.Url(url) && !url.includes('facebook.com'))) {
              _context15.next = 256;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, la URL que envió no es válida. [Enlace no válido]', id));

          case 256:
            _context15.next = 258;
            return regeneratorRuntime.awrap(cabe.reply(from, '_Extracción de metadatos..._ \n\nGracias por usar este bot', id));

          case 258:
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
            return _context15.abrupt("break", 775);

          case 260:
            if (!(args.length == 0)) {
              _context15.next = 262;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para descargar canciones de youtube \n escriba: ".concat(prefix, "ytmp3 [link_yt]"), id));

          case 262:
            _context15.next = 264;
            return regeneratorRuntime.awrap(rugaapi.ytmp3(args[0]));

          case 264:
            mp3 = _context15.sent;
            _context15.next = 267;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, mp3, '', '', id));

          case 267:
            return _context15.abrupt("break", 775);

          case 268:
            if (!(args.length == 0)) {
              _context15.next = 270;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para descargar videos de youtube \n escriba: ".concat(prefix, "ytmp4 [link_yt]")));

          case 270:
            _context15.next = 272;
            return regeneratorRuntime.awrap(rugaapi.ytmp4(args[0]));

          case 272:
            mp4 = _context15.sent;
            _context15.next = 275;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, mp4, '', '', id));

          case 275:
            return _context15.abrupt("break", 775);

          case 276:
            if (isNsfw) {
              _context15.next = 278;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'comando / comando NSFW no activado en este grupo!', id));

          case 278:
            if (!isLimit(serial)) {
              _context15.next = 280;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo siento ".concat(pushname, ", Su l\xEDmite de cuota se ha agotado, escriba #limit para verificar su l\xEDmite de cuota"), id));

          case 280:
            _context15.next = 282;
            return regeneratorRuntime.awrap(limitAdd(serial));

          case 282:
            if (!(args.length === 1)) {
              _context15.next = 284;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Enviar comando *#xnxx [linkXnxx]*, por ejemplo, envíe el comando *#readme*'));

          case 284:
            if (!(!args[1].match(isUrl) && !args[1].includes('xnxx.com'))) {
              _context15.next = 286;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, mess.error.Iv, id));

          case 286:
            _context15.prev = 286;
            cabe.reply(from, mess.wait, id);
            _context15.next = 290;
            return regeneratorRuntime.awrap(axios.get('https://mhankbarbar.herokuapp.com/api/xnxx?url=' + args[1] + '&apiKey=' + barbarkey));

          case 290:
            resq = _context15.sent;
            resp = resq.data;

            if (!resp.error) {
              _context15.next = 296;
              break;
            }

            cabe.reply(from, ytvv.error, id);
            _context15.next = 301;
            break;

          case 296:
            if (!(Number(resp.result.size.split(' MB')[0]) > 20.00)) {
              _context15.next = 298;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Maaf durasi video sudah melebihi batas maksimal 20 menit!', id));

          case 298:
            cabe.sendFileFromUrl(from, resp.result.thumb, 'thumb.jpg', "\u27B8 *Judul* : ".concat(resp.result.judul, "\n\u27B8 *Deskripsi* : ").concat(resp.result.desc, "\n\u27B8 *Filesize* : ").concat(resp.result.size, "\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit."), id);
            _context15.next = 301;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, resp.result.vid, "".concat(resp.result.title, ".mp4"), '', id));

          case 301:
            _context15.next = 309;
            break;

          case 303:
            _context15.prev = 303;
            _context15.t5 = _context15["catch"](286);
            console.log(_context15.t5);
            _context15.next = 308;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Video tidak ditemukan'));

          case 308:
            cabe.sendText(ownerNumber, 'Xnxx Error : ' + _context15.t5);

          case 309:
            return _context15.abrupt("break", 775);

          case 310:
            if (!isLimit(serial)) {
              _context15.next = 312;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Maaf ".concat(pushname, ", Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu"), id));

          case 312:
            _context15.next = 314;
            return regeneratorRuntime.awrap(limitAdd(serial));

          case 314:
            cabe.reply(from, mess.wait, id);
            googleQuery = body.slice(8);

            if (!(googleQuery == undefined || googleQuery == ' ')) {
              _context15.next = 318;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "*Hasil Pencarian : ".concat(googleQuery, "* tidak ditemukan"), id));

          case 318:
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
            return _context15.abrupt("break", 775);

          case 320:
            if (!isLimit(serial)) {
              _context15.next = 322;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Maaf ".concat(pushname, ", Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu"), id));

          case 322:
            _context15.next = 324;
            return regeneratorRuntime.awrap(limitAdd(serial));

          case 324:
            if (!(args.length === 1)) {
              _context15.next = 326;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Kirim perintah *#googleimage [query]*\nContoh : *#googleimage Elaina*', id));

          case 326:
            _context15.prev = 326;
            cabe.reply(from, mess.wait, id);
            gimgg = body.slice(13);
            gamb = "https://api.vhtear.com/googleimg?query=".concat(gimgg, "&apikey=").concat(vhtearkey);
            _context15.next = 332;
            return regeneratorRuntime.awrap(axios.get(gamb));

          case 332:
            gimg = _context15.sent;
            gimg2 = Math.floor(Math.random() * gimg.data.result.result_search.length);
            console.log(gimg2);
            _context15.next = 337;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, gimg.data.result.result_search[gimg2], "gam.".concat(gimg.data.result.result_search[gimg2]), "*Google Image*\n\n*Hasil Pencarian : ".concat(gimgg, "*"), id));

          case 337:
            _context15.next = 344;
            break;

          case 339:
            _context15.prev = 339;
            _context15.t6 = _context15["catch"](326);
            console.log(_context15.t6);
            cabe.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Gambar tidak ditemukan');
            cabe.sendText(ownerNumber, 'Google Image Error : ' + _context15.t6);

          case 344:
            return _context15.abrupt("break", 775);

          case 345:
            if (isGroupMsg) {
              _context15.next = 347;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, '¡Este comando solo se puede usar en grupos!', id));

          case 347:
            if (isGroupAdmins) {
              _context15.next = 349;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, '¡Este comando solo puede ser utilizado por los admins del grupo!', id));

          case 349:
            if (!(args.length === 1)) {
              _context15.next = 351;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Seleccione habilitar o deshabilitar!', id));

          case 351:
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

            return _context15.abrupt("break", 775);

          case 353:
            if (isGroupMsg) {
              _context15.next = 355;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id));

          case 355:
            cabe.reply(from, "Para habilitar simi-simi en el chat grupal\n\nUtilizar\n".concat(prefix, "simi on --activar\n").concat(prefix, "simi off - desactivar\n"), id);
            return _context15.abrupt("break", 775);

          case 357:
            if (isGroupMsg) {
              _context15.next = 359;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id));

          case 359:
            if (isGroupAdmins) {
              _context15.next = 361;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por los admins del grupo.', id));

          case 361:
            if (!(args.length !== 1)) {
              _context15.next = 363;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para habilitar simi-simi en el chat grupal\n\nUtilizar\n".concat(prefix, "simi on --activar\n").concat(prefix, "simi off - desactivar\n"), id));

          case 363:
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

            return _context15.abrupt("break", 775);

          case 365:
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt').then(function (res) {
              return res.text();
            }).then(function (body) {
              var splitnix = body.split('\n');
              var randomnix = splitnix[Math.floor(Math.random() * splitnix.length)];
              cabe.reply(from, randomnix, id);
            });
            return _context15.abrupt("break", 775);

          case 367:
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt').then(function (res) {
              return res.text();
            }).then(function (body) {
              var splitbijak = body.split('\n');
              var randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)];
              cabe.reply(from, randombijak, id);
            });
            return _context15.abrupt("break", 775);

          case 369:
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt').then(function (res) {
              return res.text();
            }).then(function (body) {
              var splitpantun = body.split('\n');
              var randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)];
              cabe.reply(from, randompantun.replace(/cabe-line/g, "\n"), id);
            });
            return _context15.abrupt("break", 775);

          case 371:
            _context15.next = 373;
            return regeneratorRuntime.awrap(rugaapi.quote());

          case 373:
            quotex = _context15.sent;
            _context15.next = 376;
            return regeneratorRuntime.awrap(cabe.reply(from, quotex, id));

          case 376:
            return _context15.abrupt("break", 775);

          case 377:
            if (!(args.length == 0)) {
              _context15.next = 379;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Usar ".concat(prefix, "anime\nPor favor escribe: ").concat(prefix, "anime [consulta]\nejemplo: ").concat(prefix, "anime random\n\n consultas disponibles:\n random, waifu, husbu, neko"), id));

          case 379:
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

            return _context15.abrupt("break", 775);

          case 381:
            if (!(args.length == 0)) {
              _context15.next = 383;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Usar ".concat(prefix, "kpop\nPor favor escribe: ").concat(prefix, "kpop [consulta]\nEjemplos: ").concat(prefix, "kpop bts\n\nconsultas disponibles:\nblackpink, exo, bts"), id));

          case 383:
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

            return _context15.abrupt("break", 775);

          case 385:
            _context15.next = 387;
            return regeneratorRuntime.awrap(meme.random());

          case 387:
            randmeme = _context15.sent;
            cabe.sendFileFromUrl(from, randmeme, '', '', id);
            return _context15.abrupt("break", 775);

          case 390:
            if (!(args.length == 0)) {
              _context15.next = 392;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar im\xE1genes en pinterest\nescriba: ".concat(prefix, "imagen [busqueda]\nejemplo: ").concat(prefix, "imagen naruto"), id));

          case 392:
            cariwall = body.slice(8);
            _context15.next = 395;
            return regeneratorRuntime.awrap(images.fdci(cariwall));

          case 395:
            hasilwall = _context15.sent;
            cabe.sendFileFromUrl(from, hasilwall, '', '', id);
            return _context15.abrupt("break", 775);

          case 398:
            if (!(args.length == 0)) {
              _context15.next = 400;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar im\xE1genes en sub reddit\nescriba: ".concat(prefix, "sreddit [busqueda]\nejemplo: ").concat(prefix, "sreddit naruto"), id));

          case 400:
            carireddit = body.slice(9);
            _context15.next = 403;
            return regeneratorRuntime.awrap(images.sreddit(carireddit));

          case 403:
            hasilreddit = _context15.sent;
            cabe.sendFileFromUrl(from, hasilreddit, '', '', id);
            return _context15.abrupt("break", 775);

          case 406:
            if (!(args.length == 0)) {
              _context15.next = 408;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar recetas de comida\nescribir: ".concat(prefix, "resep [busqueda]\n\nejemplo: ").concat(prefix, "resep tahu"), id));

          case 408:
            cariresep = body.slice(7);
            _context15.next = 411;
            return regeneratorRuntime.awrap(resep.resep(cariresep));

          case 411:
            hasilresep = _context15.sent;
            cabe.reply(from, hasilresep + '\n\nEsta es la receta de la comida ...', id);
            return _context15.abrupt("break", 775);

          case 414:
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
            return _context15.abrupt("break", 775);

          case 417:
            if (!(args.length == 0)) {
              _context15.next = 419;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Acechar la cuenta de Instagram de alguien\nescribir ".concat(prefix, "stalkig [nombre de usuario]\nejemplo: ").concat(prefix, "stalkig ini.arga"), id));

          case 419:
            _context15.next = 421;
            return regeneratorRuntime.awrap(rugaapi.stalkig(args[0]));

          case 421:
            igstalk = _context15.sent;
            _context15.next = 424;
            return regeneratorRuntime.awrap(rugaapi.stalkigpict(args[0]));

          case 424:
            igstalkpict = _context15.sent;
            _context15.next = 427;
            return regeneratorRuntime.awrap(cabe.sendFileFromUrl(from, igstalkpict, '', igstalk, id));

          case 427:
            return _context15.abrupt("break", 775);

          case 428:
            if (!(args.length === 1)) {
              _context15.next = 430;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Kirim perintah *!wiki [query]*\nContoh : *!wiki asu*', id));

          case 430:
            query_ = body.slice(6);
            _context15.next = 433;
            return regeneratorRuntime.awrap(get.get("https://es.wikipedia.org/w/api.php".concat(query_)).json());

          case 433:
            wiki = _context15.sent;

            if (wiki.error) {
              cabe.reply(from, wiki.error, id);
            } else {
              cabe.reply(from, "\u27B8 *Query* : ".concat(query_, "\n\n\u27B8 *Result* : ").concat(wiki.result), id);
            }

            return _context15.abrupt("break", 775);

          case 436:
            if (!(args.length == 0)) {
              _context15.next = 438;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar la letra y los acordes de una canci\xF3n\bescribir: ".concat(prefix, "acorde [t\xEDtulo_ canci\xF3n]"), id));

          case 438:
            chordq = body.slice(7);
            _context15.next = 441;
            return regeneratorRuntime.awrap(rugaapi.chord(chordq));

          case 441:
            chordp = _context15.sent;
            _context15.next = 444;
            return regeneratorRuntime.awrap(cabe.reply(from, chordp, id));

          case 444:
            return _context15.abrupt("break", 775);

          case 445:
            if (!(args.length == 0)) {
              _context15.next = 447;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Convertir la captura de pantalla de los bots en una web\n\nUso: ".concat(prefix, "ss [url]\n\nejemplo: ").concat(prefix, "ss http://google.com"), id));

          case 447:
            _context15.next = 449;
            return regeneratorRuntime.awrap(meme.ss(args[0]));

          case 449:
            scrinshit = _context15.sent;
            _context15.next = 452;
            return regeneratorRuntime.awrap(cabe.sendFile(from, scrinshit, 'ss.jpg', 'cekrek', id));

          case 452:
            return _context15.abrupt("break", 775);

          case 453:
            if (!(args.length == 0)) {
              _context15.next = 455;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para buscar canciones de youtube\n\nUtilizar: ".concat(prefix, "play t\xEDtulo de la canci\xF3n"), id));

          case 455:
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
            return _context15.abrupt("break", 775);

          case 457:
            if (!(isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image')) {
              _context15.next = 473;
              break;
            }

            if (!isMedia) {
              _context15.next = 464;
              break;
            }

            _context15.next = 461;
            return regeneratorRuntime.awrap(decryptMedia(message, uaOverride));

          case 461:
            mediaData = _context15.sent;
            _context15.next = 467;
            break;

          case 464:
            _context15.next = 466;
            return regeneratorRuntime.awrap(decryptMedia(quotedMsg, uaOverride));

          case 466:
            mediaData = _context15.sent;

          case 467:
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
                cabe.reply(from, 'Maaf, saya tidak tau ini anime apa, pastikan gambar yang akan di Search tidak Buram/Kepotong', id);
              }

              var _resolt$docs$ = resolt.docs[0],
                  is_adult = _resolt$docs$.is_adult,
                  title = _resolt$docs$.title,
                  title_chinese = _resolt$docs$.title_chinese,
                  title_romaji = _resolt$docs$.title_romaji,
                  title_english = _resolt$docs$.title_english,
                  episode = _resolt$docs$.episode,
                  similarity = _resolt$docs$.similarity,
                  filename = _resolt$docs$.filename,
                  at = _resolt$docs$.at,
                  tokenthumb = _resolt$docs$.tokenthumb,
                  anilist_id = _resolt$docs$.anilist_id;
              teks = '';

              if (similarity < 0.92) {
                teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n';
              }

              teks += "\u27B8 *Title Japanese* : ".concat(title, "\n\u27B8 *Title chinese* : ").concat(title_chinese, "\n\u27B8 *Title Romaji* : ").concat(title_romaji, "\n\u27B8 *Title English* : ").concat(title_english, "\n");
              teks += "\u27B8 *R-18?* : ".concat(is_adult, "\n");
              teks += "\u27B8 *Eps* : ".concat(episode.toString(), "\n");
              teks += "\u27B8 *Kesamaan* : ".concat((similarity * 100).toFixed(1), "%\n");
              var video = "https://media.trace.moe/video/".concat(anilist_id, "/").concat(encodeURIComponent(filename), "?t=").concat(at, "&token=").concat(tokenthumb);
              cabe.sendFileFromUrl(from, video, 'anime.mp4', teks, id)["catch"](function () {
                cabe.reply(from, teks, id);
              });
            })["catch"](function () {
              cabe.reply(from, 'Ada yang Error!', id);
            });

            _context15.next = 474;
            break;

          case 473:
            cabe.reply(from, "Maaf format salah\n\nSilahkan kirim foto dengan caption ".concat(prefix, "whatanime\n\nAtau reply foto dengan caption ").concat(prefix, "whatanime"), id);

          case 474:
            return _context15.abrupt("break", 775);

          case 475:
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
            return _context15.abrupt("break", 775);

          case 477:
            if (!(args.length !== 2)) {
              _context15.next = 479;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto.\nIntroduzca su mensaje con ".concat(prefix, "resi <kurir> <no_resi>\n\nKurir yang tersedia:\njne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex"), id));

          case 479:
            kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex'];

            if (kurirs.includes(args[0])) {
              _context15.next = 482;
              break;
            }

            return _context15.abrupt("return", cabe.sendText(from, "Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ".concat(kurirs.join(', '), " Tolong periksa kembali.")));

          case 482:
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0]);
            cekResi(args[0], args[1]).then(function (result) {
              return cabe.sendText(from, result);
            });
            return _context15.abrupt("break", 775);

          case 485:
            if (!(args.length == 0)) {
              _context15.next = 487;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Cambiar texto a sonido (voz de Google) \n tipo: ".concat(prefix, "tts <c\xF3digo de idioma> <texto> \n ejemplos: ").concat(prefix, "tts es hola \n para ver el c\xF3digo de idioma aqu\xED: https://anotepad.com/note/read/5xqahdy8")));

          case 487:
            ttsGB = require('node-gtts')(args[0]);
            dataText = body.slice(8);

            if (!(dataText === '')) {
              _context15.next = 491;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'cual es el texto..', id));

          case 491:
            try {
              ttsGB.save('./media/tts.mp3', dataText, function () {
                cabe.sendPtt(from, './media/tts.mp3', id);
              });
            } catch (err) {
              cabe.reply(from, err, id);
            }

            return _context15.abrupt("break", 775);

          case 493:
            if (!(args.length != 1)) {
              _context15.next = 495;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ".concat(prefix, "translate <kode_bahasa>\ncontoh ").concat(prefix, "translate id"), id));

          case 495:
            if (quotedMsg) {
              _context15.next = 497;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ".concat(prefix, "translate <kode_bahasa>\ncontoh ").concat(prefix, "translate id"), id));

          case 497:
            quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : '';
            translate(quoteText, args[0]).then(function (result) {
              return cabe.sendText(from, result);
            })["catch"](function () {
              return cabe.sendText(from, 'Error, Kode bahasa salah.');
            });
            return _context15.abrupt("break", 775);

          case 500:
            if (!(args.length == 0)) {
              _context15.next = 502;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "ketik ".concat(prefix, "shortlink <url>"), message.id));

          case 502:
            if (isUrl(args[0])) {
              _context15.next = 504;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Maaf, url yang kamu kirim tidak valid.', message.id));

          case 504:
            _context15.next = 506;
            return regeneratorRuntime.awrap(urlShortener(args[0]));

          case 506:
            shortlink = _context15.sent;
            _context15.next = 509;
            return regeneratorRuntime.awrap(cabe.sendText(from, shortlink));

          case 509:
            return _context15.abrupt("break", 775);

          case 510:
            if (isGroupMsg) {
              _context15.next = 512;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo se puede usar dentro de grupos', id));

          case 512:
            if (isGroupAdmins) {
              _context15.next = 514;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo!', id));

          case 514:
            if (isBotGroupAdmins) {
              _context15.next = 516;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como admin del grupo!', id));

          case 516:
            if (!(args.length !== 1)) {
              _context15.next = 518;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Usar ".concat(prefix, "agregar\nUtilizar: ").concat(prefix, "agregar <numero>\nejemplo: ").concat(prefix, "agregar 54xxxxxx"), id));

          case 518:
            _context15.prev = 518;
            _context15.next = 521;
            return regeneratorRuntime.awrap(cabe.addParticipant(from, "".concat(args[0], "@c.us")).then(function () {
              return cabe.reply(from, 'Hola bienvenido', id);
            }));

          case 521:
            _context15.next = 526;
            break;

          case 523:
            _context15.prev = 523;
            _context15.t7 = _context15["catch"](518);
            cabe.reply(from, 'No se pudo agregar el objetivo', id);

          case 526:
            return _context15.abrupt("break", 775);

          case 527:
            if (isGroupMsg) {
              _context15.next = 529;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 529:
            if (isGroupAdmins) {
              _context15.next = 531;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 531:
            if (isBotGroupAdmins) {
              _context15.next = 533;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como admin del grupo.', id));

          case 533:
            if (!(mentionedJidList.length === 0)) {
              _context15.next = 535;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n etiquete a una o más personas para eliminar del grupo', id));

          case 535:
            if (!(mentionedJidList[0] === botNumber)) {
              _context15.next = 539;
              break;
            }

            _context15.next = 538;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n No puedo expulsar la cuenta del bot por mí mismo', id));

          case 538:
            return _context15.abrupt("return", _context15.sent);

          case 539:
            _context15.next = 541;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, "Solicitud recibida, problema:\n".concat(mentionedJidList.map(function (x) {
              return "@".concat(x.replace('@c.us', ''));
            }).join('\n'))));

          case 541:
            i = 0;

          case 542:
            if (!(i < mentionedJidList.length)) {
              _context15.next = 552;
              break;
            }

            if (!groupAdmins.includes(mentionedJidList[i])) {
              _context15.next = 547;
              break;
            }

            _context15.next = 546;
            return regeneratorRuntime.awrap(cabe.sendText(from, 'Error, no puede eliminar a el admin del grupo.'));

          case 546:
            return _context15.abrupt("return", _context15.sent);

          case 547:
            _context15.next = 549;
            return regeneratorRuntime.awrap(cabe.removeParticipant(groupId, mentionedJidList[i]));

          case 549:
            i++;
            _context15.next = 542;
            break;

          case 552:
            return _context15.abrupt("break", 775);

          case 553:
            if (isGroupMsg) {
              _context15.next = 555;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 555:
            if (isGroupAdmins) {
              _context15.next = 557;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 557:
            if (isBotGroupAdmins) {
              _context15.next = 559;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como administrador de grupo.', id));

          case 559:
            if (!(mentionedJidList.length !== 1)) {
              _context15.next = 561;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, solo puedo promover a 1 usuario', id));

          case 561:
            if (!groupAdmins.includes(mentionedJidList[0])) {
              _context15.next = 565;
              break;
            }

            _context15.next = 564;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo siento, el usuario ya es admin.', id));

          case 564:
            return _context15.abrupt("return", _context15.sent);

          case 565:
            if (!(mentionedJidList[0] === botNumber)) {
              _context15.next = 569;
              break;
            }

            _context15.next = 568;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n no se puede promover la cuenta del bot por sí solo', id));

          case 568:
            return _context15.abrupt("return", _context15.sent);

          case 569:
            _context15.next = 571;
            return regeneratorRuntime.awrap(cabe.promoteParticipant(groupId, mentionedJidList[0]));

          case 571:
            _context15.next = 573;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, "Solicitud aceptada, agregad@ @".concat(mentionedJidList[0].replace('@c.us', ''), " como admin.")));

          case 573:
            return _context15.abrupt("break", 775);

          case 574:
            if (isGroupMsg) {
              _context15.next = 576;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 576:
            if (isGroupAdmins) {
              _context15.next = 578;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por admins del grupo.', id));

          case 578:
            if (isBotGroupAdmins) {
              _context15.next = 580;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como administrador de grupo.', id));

          case 580:
            if (!(mentionedJidList.length !== 1)) {
              _context15.next = 582;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, solo se puede degradar a 1 usuario', id));

          case 582:
            if (groupAdmins.includes(mentionedJidList[0])) {
              _context15.next = 586;
              break;
            }

            _context15.next = 585;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el usuario aún no es administrador.', id));

          case 585:
            return _context15.abrupt("return", _context15.sent);

          case 586:
            if (!(mentionedJidList[0] === botNumber)) {
              _context15.next = 590;
              break;
            }

            _context15.next = 589;
            return regeneratorRuntime.awrap(cabe.reply(from, 'Lo sentimos, el formato del mensaje es incorrecto. \n No se puede eliminar la cuenta del bot.', id));

          case 589:
            return _context15.abrupt("return", _context15.sent);

          case 590:
            _context15.next = 592;
            return regeneratorRuntime.awrap(cabe.demoteParticipant(groupId, mentionedJidList[0]));

          case 592:
            _context15.next = 594;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, "Solicitud aceptada, eliminar posici\xF3n @".concat(mentionedJidList[0].replace('@c.us', ''), ".")));

          case 594:
            return _context15.abrupt("break", 775);

          case 595:
            if (isGroupMsg) {
              _context15.next = 597;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 597:
            if (isGroupAdmins) {
              _context15.next = 599;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo.', id));

          case 599:
            cabe.sendText(from, 'Adiós, ya no me quieren aqui...( ⇀‸↼‶ )').then(function () {
              return cabe.leaveGroup(groupId);
            });
            return _context15.abrupt("break", 775);

          case 601:
            if (isGroupAdmins) {
              _context15.next = 603;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo!', id));

          case 603:
            if (quotedMsg) {
              _context15.next = 605;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto, por favor. \n Responde enviar un mensaje al bot con un t\xEDtulo ".concat(prefix, "borrar"), id));

          case 605:
            if (quotedMsgObj.fromMe) {
              _context15.next = 607;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Lo sentimos, el formato del mensaje es incorrecto, por favor. \n Responde enviar un mensaje al bot con el t\xEDtulo ".concat(prefix, "borrar"), id));

          case 607:
            cabe.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
            return _context15.abrupt("break", 775);

          case 609:
            if (isGroupMsg) {
              _context15.next = 611;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 611:
            if (isGroupAdmins) {
              _context15.next = 613;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, este comando solo puede ser utilizado por administradores de grupo.', id));

          case 613:
            _context15.next = 615;
            return regeneratorRuntime.awrap(cabe.getGroupMembers(groupId));

          case 615:
            groupMem = _context15.sent;
            hehex = '╔══✪〘 Mencionar a todos 〙✪══\n';

            for (_i = 0; _i < groupMem.length; _i++) {
              hehex += '╠➥';
              hehex += " @".concat(groupMem[_i].id.replace(/@c.us/g, ''), "\n");
            }

            hehex += '╚═〘 *CABE  B O T* 〙';
            _context15.next = 621;
            return regeneratorRuntime.awrap(cabe.sendTextWithMentions(from, hehex));

          case 621:
            return _context15.abrupt("break", 775);

          case 622:
            _context15.next = 624;
            return regeneratorRuntime.awrap(cabe.getAmountOfLoadedMessages());

          case 624:
            loadedMsg = _context15.sent;
            _context15.next = 627;
            return regeneratorRuntime.awrap(cabe.getAllChatIds());

          case 627:
            chatIds = _context15.sent;
            _context15.next = 630;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 630:
            groups = _context15.sent;
            cabe.sendText(from, "Estado :\n- *".concat(loadedMsg, "* Mensajes cargados\n- *").concat(groups.length, "* Chats grupales\n- *").concat(chatIds.length - groups.length, "* Chats personales\n- *").concat(chatIds.length, "* Total de chats"));
            return _context15.abrupt("break", 775);

          case 633:
            if (isGroupMsg) {
              _context15.next = 635;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, ¡este comando solo se puede usar dentro de grupos!', id));

          case 635:
            isOwner = chat.groupMetadata.owner == sender.id;

            if (isOwner) {
              _context15.next = 638;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Lo sentimos, este comando solo puede ser utilizado por el propietario del grupo.', id));

          case 638:
            if (isBotGroupAdmins) {
              _context15.next = 640;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Falló, agregue el bot como admin del grupo.', id));

          case 640:
            _context15.next = 642;
            return regeneratorRuntime.awrap(cabe.getGroupMembers(groupId));

          case 642:
            allMem = _context15.sent;
            _i2 = 0;

          case 644:
            if (!(_i2 < allMem.length)) {
              _context15.next = 653;
              break;
            }

            if (!groupAdmins.includes(allMem[_i2].id)) {
              _context15.next = 648;
              break;
            }

            _context15.next = 650;
            break;

          case 648:
            _context15.next = 650;
            return regeneratorRuntime.awrap(cabe.removeParticipant(groupId, allMem[_i2].id));

          case 650:
            _i2++;
            _context15.next = 644;
            break;

          case 653:
            cabe.reply(from, 'Exito expulsar a todos los miembros', id);
            return _context15.abrupt("break", 775);

          case 655:
            if (isOwnerBot) {
              _context15.next = 657;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, '¡Este pedido es solo para el propietario del bot!', id));

          case 657:
            if (!(args.length == 0)) {
              _context15.next = 659;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Prohibir que alguien use comandos\n\nEscribir: \n".concat(prefix, "ban add 54xx --Activar\n").concat(prefix, "ban del 54xx --deshabilitar\n\nc\xF3mo prohibir r\xE1pidamente muchos tipos en grupos:\n").concat(prefix, "ban @tag @tag @tag"), id));

          case 659:
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

            return _context15.abrupt("break", 775);

          case 661:
            if (isOwnerBot) {
              _context15.next = 663;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, '¡Este pedido es solo para el propietario del bot!', id));

          case 663:
            if (!(args.length == 0)) {
              _context15.next = 665;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, "Para transmitir a todos los chats, escriba:\n".concat(prefix, "bc [rellenar el chat]")));

          case 665:
            msg = body.slice(4);
            _context15.next = 668;
            return regeneratorRuntime.awrap(cabe.getAllChatIds());

          case 668:
            chatz = _context15.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context15.prev = 672;
            _iterator = chatz[Symbol.iterator]();

          case 674:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context15.next = 684;
              break;
            }

            idk = _step.value;
            _context15.next = 678;
            return regeneratorRuntime.awrap(cabe.getChatById(idk));

          case 678:
            cvk = _context15.sent;
            if (!cvk.isReadOnly) cabe.sendText(idk, "\u3018 *C A B E  B C* \u3019\n\n".concat(msg));
            if (cvk.isReadOnly) cabe.sendText(idk, "\u3018 *C A B E  B C* \u3019\n\n".concat(msg));

          case 681:
            _iteratorNormalCompletion = true;
            _context15.next = 674;
            break;

          case 684:
            _context15.next = 690;
            break;

          case 686:
            _context15.prev = 686;
            _context15.t8 = _context15["catch"](672);
            _didIteratorError = true;
            _iteratorError = _context15.t8;

          case 690:
            _context15.prev = 690;
            _context15.prev = 691;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 693:
            _context15.prev = 693;

            if (!_didIteratorError) {
              _context15.next = 696;
              break;
            }

            throw _iteratorError;

          case 696:
            return _context15.finish(693);

          case 697:
            return _context15.finish(690);

          case 698:
            cabe.reply(from, 'Éxito de la transmisión!', id);
            return _context15.abrupt("break", 775);

          case 700:
            if (isOwnerBot) {
              _context15.next = 702;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Este comando es solo para el propietario del bot', id));

          case 702:
            _context15.next = 704;
            return regeneratorRuntime.awrap(cabe.getAllChatIds());

          case 704:
            allChatz = _context15.sent;
            _context15.next = 707;
            return regeneratorRuntime.awrap(cabe.getAllGroups());

          case 707:
            allGroupz = _context15.sent;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context15.prev = 711;
            _iterator2 = allGroupz[Symbol.iterator]();

          case 713:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context15.next = 724;
              break;
            }

            gclist = _step2.value;
            _context15.next = 717;
            return regeneratorRuntime.awrap(cabe.sendText(gclist.contact.id, "Lo siento, el bot est\xE1 limpiando, el chat total est\xE1 activo : ".concat(allChatz.length)));

          case 717:
            _context15.next = 719;
            return regeneratorRuntime.awrap(cabe.leaveGroup(gclist.contact.id));

          case 719:
            _context15.next = 721;
            return regeneratorRuntime.awrap(cabe.deleteChat(gclist.contact.id));

          case 721:
            _iteratorNormalCompletion2 = true;
            _context15.next = 713;
            break;

          case 724:
            _context15.next = 730;
            break;

          case 726:
            _context15.prev = 726;
            _context15.t9 = _context15["catch"](711);
            _didIteratorError2 = true;
            _iteratorError2 = _context15.t9;

          case 730:
            _context15.prev = 730;
            _context15.prev = 731;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 733:
            _context15.prev = 733;

            if (!_didIteratorError2) {
              _context15.next = 736;
              break;
            }

            throw _iteratorError2;

          case 736:
            return _context15.finish(733);

          case 737:
            return _context15.finish(730);

          case 738:
            cabe.reply(from, 'Exito dejar todo el grupo!', id);
            return _context15.abrupt("break", 775);

          case 740:
            if (isOwnerBot) {
              _context15.next = 742;
              break;
            }

            return _context15.abrupt("return", cabe.reply(from, 'Este comando es solo para el propietario del bot', id));

          case 742:
            _context15.next = 744;
            return regeneratorRuntime.awrap(cabe.getAllChats());

          case 744:
            allChatx = _context15.sent;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context15.prev = 748;
            _iterator3 = allChatx[Symbol.iterator]();

          case 750:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context15.next = 757;
              break;
            }

            dchat = _step3.value;
            _context15.next = 754;
            return regeneratorRuntime.awrap(cabe.deleteChat(dchat.id));

          case 754:
            _iteratorNormalCompletion3 = true;
            _context15.next = 750;
            break;

          case 757:
            _context15.next = 763;
            break;

          case 759:
            _context15.prev = 759;
            _context15.t10 = _context15["catch"](748);
            _didIteratorError3 = true;
            _iteratorError3 = _context15.t10;

          case 763:
            _context15.prev = 763;
            _context15.prev = 764;

            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }

          case 766:
            _context15.prev = 766;

            if (!_didIteratorError3) {
              _context15.next = 769;
              break;
            }

            throw _iteratorError3;

          case 769:
            return _context15.finish(766);

          case 770:
            return _context15.finish(763);

          case 771:
            cabe.reply(from, 'Tiene éxito borrar todo el chat!', id);
            return _context15.abrupt("break", 775);

          case 773:
            console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Comando no registrado de', color(pushname));
            return _context15.abrupt("break", 775);

          case 775:
            _context15.next = 780;
            break;

          case 777:
            _context15.prev = 777;
            _context15.t11 = _context15["catch"](1);
            console.log(color('[ERROR]', 'red'), _context15.t11);

          case 780:
          case "end":
            return _context15.stop();
        }
      }
    }, null, null, [[1, 777], [105, 121], [205, 212], [286, 303], [326, 339], [518, 523], [672, 686, 690, 698], [691,, 693, 697], [711, 726, 730, 738], [731,, 733, 737], [748, 759, 763, 771], [764,, 766, 770]]);
  });
};

create('cabe', options(true, start)).then(function (cabe) {
  return start(cabe);
})["catch"](function (err) {
  return new Error(err);
});