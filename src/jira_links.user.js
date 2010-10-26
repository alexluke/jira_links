// ==UserScript==
// @name		Jira Links
// @namespace	http://www.github.com/banduin/jira_links
// @description	Adds links to jira issues
// @include		*
// ==/UserScript==

GM_log('initializing');

var jiraRegex = /\bCOR-\d+\b/ig;
var baseJiraLink = 'http://jira/browse/';

var expression = "//text()[not(ancestor::a) and not(ancestor::script) and not(ancestor::style) and contains(., 'COR')]";

var textElements = document.evaluate(expression, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

GM_log(textElements.snapshotLength);

for (var i = textElements.snapshotLength - 1; i >= 0; i--) {
	var elm = textElements.snapshotItem(i);
	var elmText = elm.nodeValue;
	GM_log(elmText);
	if (jiraRegex.test(elmText)) {
		GM_log('matched');
		jiraRegex.lastIndex = 0;
		var nodes = []
		for (var match = null, lastLastIndex = 0; match = jiraRegex.exec(elmText);) {
			nodes.push(document.createTextNode(elmText.substring(lastLastIndex, match.index)));
			var link = document.createElement('a');
			link.setAttribute("href", baseJiraLink + match[0]);
			link.appendChild(document.createTextNode(match[0]));
			GM_log(link);
			nodes.push(link);
			lastLastIndex = jiraRegex.lastIndex;
		}
		nodes.push(document.createTextNode(elmText.substring(lastLastIndex)));

		/* Currently Broken
		var parentNode = elm.parentNode;
		GM_log(parentNode);
		var lastElm = parentNode.replaceChild(nodes.pop(), elm);
		GM_log(lastElm);
		while (e = nodes.pop()) {
			GM_log(e);
			parentNode.insertBefore(e, lastElm);
			lastElm = e;
		}
		*/
	}
}
