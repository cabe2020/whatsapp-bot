var unirest = require("unirest");

var req = unirest("POST", "https://nsfw1.p.rapidapi.com/nsfw");

req.headers({
	"x-rapidapi-key": "8ab648cbe9msh24b7300a5daa5bcp1c463ajsn72e108955cc4",
	"x-rapidapi-host": "nsfw1.p.rapidapi.com",
	"useQueryString": true
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});