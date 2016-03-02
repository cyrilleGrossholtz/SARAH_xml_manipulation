const grammarManipulation = require('./grammarManipulation');

var shouldLog = 1;

var log = (text, level) => {
	if (shouldLog >= level)
		console.log(text);
}

module.exports = {
	init: (file, base, log) => {
		if (log !== undefined)
			shouldLog = log;
		return grammarManipulation.init(file, base, log);
	},
	/**
	@result is a JS object 
	@node is the node to replace with the content of result JSON object
	exemple : rule[2]
	*/
	updateFromRequest: (node, result, callback) => {
		grammarManipulation.getGrammar(function(gramar) {
			if (gramar !== false) {
				var elements = node.split(".");
				log("elements = " + elements, 2);


				recursive(gramar, elements, 0, result);

				log("OBJECT BEFORE END", 2);
				log(JSON.stringify(gramar), 2);
				grammarManipulation.overrideGrammar(gramar, callback);

			} else {
				callback(false);
			}
		});
	}
}

function recursive(gramarElement, elements, i, result) {
	log("\nrecursive[i = " + i + "][length = " + elements.length + "][elements[i] = \"" + elements[i] + "\"]", 2);
	// elements[i] should be something like : node[idf1, idf2]
	// where idf* should be :
	// either a identifier
	// or an field definition (fieldName=fieldValue)
	var tab = elements[i].split(/\[|\]/);
	var identifiers;
	var identifier;
	log("[tab = " + tab + "]", 2);
	log(JSON.stringify(gramarElement), 2);
	log("look for recursive elements", 2);
	if (!gramarElement.hasOwnProperty(tab[0])) {
		//if current gramar element does not have subelement create it
		if (tab.length > 1) {
			gramarElement[tab[0]] = [];
		} else {
			gramarElement[tab[0]] = {};
		}
	}
	var nextElementList = [];
	var tempElementList = [];

	if (tab.length > 1) {
		identifiers = tab[1].split(",");
		for (var j = 0; j < identifiers.length; j++) {
			identifier = identifiers[j].split("=");
			if (identifier.length > 1) {
				// case found id=val
				tempElementList = findMatchingElements(gramarElement[tab[0]], identifier);
				if (tempElementList.length > 0) {
					// add all matching elements
					Array.prototype.push.apply(nextElementList, tempElementList);
				} else {
					// if none was found, create one
					gramarElement[tab[0]] = [{
						"$": {}
					}];
					gramarElement[tab[0]][0]["$"][identifier[0]] = identifier[1];
					nextElementList.push(0);
				}
			} else {
				// case id only
				if (!gramarElement[tab[0]].hasOwnProperty(identifiers[0])) {
					// if id not found
					gramarElement[tab[0]][identifiers[0]] = {};
				}
				nextElementList.push(identifiers[0]);
			}
		}
	}
	log("nextElementList", 2);
	log(nextElementList, 2);
	if (i < elements.length - 1) {
		if (nextElementList.length === 0) {
			log("follow node only : " + tab[0], 2);
			recursive(gramarElement[tab[0]], elements, i + 1, result);
		} else {
			for (var nextElement in nextElementList) {
				log("follow next level : [nodename=" + tab[0] + "][nb=" + nextElementList[nextElement] + "]", 2);
				recursive(gramarElement[tab[0]][nextElementList[nextElement]], elements, i + 1, result);
			}
		}
	} else {
		log("replace element", 2);
		// replace last element with expected node
		if (nextElementList.length === 0) {
			log("do replacement node only : " + tab[0], 2);
			gramarElement[tab[0]] = result;
		} else {
			for (var nextElement in nextElementList) {
				log("do replacement : [nodename=" + tab[0] + "][nb=" + nextElementList[nextElement] + "]", 2);
				gramarElement[tab[0]][nextElementList[nextElement]] = result;
			}
		}

	}
}

function findMatchingElements(gramarElement, identifier) {
	var res = [];
	for (var i = 0; i < gramarElement.length; i++) {
		if (gramarElement[i].hasOwnProperty("$") && gramarElement[i]["$"].hasOwnProperty(identifier[0]) && gramarElement[i]["$"][identifier[0]] == identifier[1])
			res.push(i);
	}
	if (res.length === 0)
		throw new Error("impossible to find idenfier[" + identifier + "] in object \n" + JSON.stringify(gramarElement) + "");
	return res;
}