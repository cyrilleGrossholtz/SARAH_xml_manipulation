var baseUrl = 'plugins/<plugin>/';
var fileName = '<plugin>.xml';
var fileXML = baseUrl + fileName;
var shouldLog = 1;

const fs = require('fs');
const xml2js = require('xml2js');

var log = function(text, level) {
	if (shouldLog >= level)
		console.log(text);
};

module.exports = {
	init: function(file, base, log) {
		if (base !== undefined && base !== null)
			baseUrl = base;
		if (file !== undefined && file !== null)
			fileName = file;
		fileXML = baseUrl + fileName;
		if(log !== undefined)
			shouldLog = log;
		return fileXML;
	},
	getGrammar: function(callback) {
		fs.readFile(fileXML, {
			encoding: 'utf8'
		}, function(err, fileContent) {
			log("###########DEBUT###############", 2);
			log(fileContent, 2);
			log("##########/DEBUT################", 2);
			fileContent = fileContent.replace(/(\n\s*){1,}/mg, '');// delete 
			if (err) {
				log("ERROR when getting file : \n" + err, 1);
				return callback(new Error("ERROR when getting file"));
			}
			xml2js.parseString(fileContent, function(err, result) {
				if (err || result == null || result == undefined) {
					log("ERROR when parsing file : \n" + err, 1);
					return callback(new Error("ERROR when parsing file"));
				}
				log("STRING PARSED", 2);
				log(JSON.stringify(result), 2);
				return callback(result);
			});
		});
	},
	overrideGrammar: function(data, callback) {
		var builder = new xml2js.Builder({
			headless: true,
			//pretty: true
		});
		var fileContent = builder.buildObject(data);
		
		//data = data.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n', '');
		log("###########FIN###############", 2);
		log(fileContent, 2);
		log("############/FIN##############", 2);


		fs.writeFile(fileXML, fileContent, function(err) {
			if (err) {
				log("ERROR when writing file : \n" + err, 1);
				return callback(new Error(err));
			}
			callback(null);
		});
	},
	log: log
};