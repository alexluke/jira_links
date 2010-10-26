// ==UserScript==
// @name		Jira Links
// @namespace	http://www.github.com/banduin/jira_links
// @description	Adds links to jira issues
// @include		*
// ==/UserScript==

var jiraRegex = /\b(COR-\d+)\b/ig;
var baseJiraLink = 'http://jira/browse/';

var textElements = document.evaluate("//text()[not ancestor::a) " +
	"and not(ancestor::script) " +
	"and not(ancestor::style) " +
	"and contains('COR')]",
	document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = textElements.snapshotLength - 1; i >= 0; i--) {
	var elm = textElements.snapshotItem(i);
	var elmText = elm.nodeValue;
	if (jiraRegex.test(elmText.nodeValue)) {
		jiraRegex.lastIndex = 0;
		var nodes = []
		for (var match = null, lastLastIndex = 0; match = jiraRegex.exec(elmText);) {
			nodes.append(document.createTextNode(elmText.substring(lastLastIndex, match.index)));
			var link = document.createElement('a');
			link.setAttribute("href", baseJiraLink + match[0]);
			link.appendChild(document.createTextNode(match[0]));
			nodes.append(link);
			lastLastIndex = jiraRegex.lastIndex;
		}
		nodes.append(document.createTextNode(elmText.substring(lastLastIndex)));

		nodes.reverse()
		var lastElm = elm.parentNode.replaceChild(nodes.pop(), elm);
		for (var e in nodes()) {
			elm.parentNode.insertBefore(e, lastElm);
		}
	}
}
