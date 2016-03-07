const fs = require('fs');
const xmlManipulation = require('../xmlManipulation');
console.log("START");

startTest();

var initial
var fileXML;

function beginCheck(tempfileXML) {
	fileXML = tempfileXML;
	initial = fs.readFileSync(fileXML, {
		encoding: 'utf8'
	});
}

function endCheck() {
	var final = fs.readFileSync(fileXML, {
		encoding: 'utf8'
	});
	if (initial != final) {
		throw new Error("An error occured : \nINITIAL\n" + JSON.stringify(initial) + "\n\nFINAL\n" + JSON.stringify(final))
	}
}

function startTest() {
	console.log("TEST 1");

	var newObject = {
		test: "val"
	};
	var nodePath = "node";
	beginCheck(xmlManipulation.init('test1.xml', 'test/', 1));
	xmlManipulation.updateFromRequest(nodePath, newObject, (result) => {
		endCheck();
		console.log("FINISHED WITH SUCCESS");
		startTest2();
	});
}

function startTest2() {
	console.log("TEST 2");
	var newObject = {
		test: ["val", "val2"]
	};
	var nodePath = "node";
	beginCheck(xmlManipulation.init('test2.xml', null, 1));
	xmlManipulation.updateFromRequest(nodePath, newObject, (result) => {
		endCheck()
		console.log("FINISHED WITH SUCCESS");
		startTest3();
	});
}

function startTest3() {
	console.log("TEST 3");
	var newObject = {
		test: "val"
	};
	var nodePath = "node.subnode[0].subsub[2]";
	beginCheck(xmlManipulation.init('test3.xml', null, 1));
	xmlManipulation.updateFromRequest(nodePath, newObject, (result) => {
		endCheck()
		console.log("FINISHED WITH SUCCESS");
		startTest4();
	});
}

function startTest4() {
	console.log("TEST 4");
	var newObject = {
		_: "bonjour",
		tag: ['out.action.device="1";out.action._attributes.tts="bonjour aussi"']
	};
	var nodePath = "grammar.rule[0].one-of[0].item[1]";
	beginCheck(xmlManipulation.init('test4.xml', null, 1));
	xmlManipulation.updateFromRequest(nodePath, newObject, (result) => {
		endCheck()
		console.log("FINISHED WITH SUCCESS");
		startTest5();
	});
}

function startTest5() {
	console.log("TEST 5");
	var newObject = {
		$: {
			id: "element1"
		},
		test: "val"
	};
	var nodePath = "node.subnode[id=element1]";
	beginCheck(xmlManipulation.init('test5.xml', null, 1));
	xmlManipulation.updateFromRequest(nodePath, newObject, (result) => {
		endCheck()
		console.log("FINISHED WITH SUCCESS");
	});
}