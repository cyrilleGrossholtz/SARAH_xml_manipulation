# SARAH_xml_manipulation
is a plugin created in order to simplify XML manipulation for grammar update with NodeJS javascript object.
It is based on the version 0.4.4 of [xml2js](https://www.npmjs.com/package/xml2js).

## SARAH ?
You should definitely have a look here : [SARAH official website](http://blog.encausse.net/sarah/)
S.A.R.A.H. is an amazing home automation solution, that will make your HOME reply to your voice. SARAH can be made OFFLINE ! Meaning the speach recognission is local, nothing is send to a third party [in order to avoid this.](http://www.geek.com/apps/samsung-reminds-smart-tv-owners-their-personal-conversations-may-be-recorded-1647353/)

## Use case
Let's see, you have a webservice returning a list of items that SARAH has to be able to recognize in a sentence but you don't feel like writing a REGEX polluting your plugin XML with items like 
```
///////// AUTOMATICALLY GENERATED CONTENT FROM HERE
...
///////// TO THERE
```

## Usage
For more exemple please see test folder.

```javascript
const xmlManipulation = require('SARAH_xml_manipulation');
...
xmlManipulation.init('test1.xml', 'test/', 1)
var newObject = {
	$: {
		id: "element1"
	},
	test: "val"
};
var nodePath = "node.subnode[id=element1]";
xmlManipulation.updateFromRequest(nodePath, newObject, (result) => {
	if(result === false) {
		// something bad happened, see log for more information
	} else {
		// FINISHED WITH SUCCESS
	}
});
```

This code will read the file : test/test1.xml
It will then look for all nodes matching the path : "node.subnode" with attribute "id" having the value "element1"
and replace the content of this node with :
```xml
<subnode id="element1">
	<test>val</test>
</subnode>
```