<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/menu" prefix="m"%>
<%@ taglib uri="http://www.cyber-i.com/coreview/layout" prefix="layout"%>

<!doctype html>
<html lang="ko">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>

	<script type="text/javascript">
	    less = {
	        env: "development", // or "production"
	        async: false,       // load imports async
	        fileAsync: false,   // load imports async when in a page under
	                            // a file protocol
	        poll: 1000,         // when in watch mode, time in ms between polls
	        functions: {},      // user functions, keyed by name
	        dumpLineNumbers: "comments", // or "mediaQuery" or "all"
	        relativeUrls: false// whether to adjust url's to be relative
	                            // if false, url's are already relative to the
	                            // entry less file
	    };
	</script>

	<layout:elementGroup sequencialTypeNames="css,less,js" >
		<layout:element name="unitTest" autoDevicePostfix="true"/>
	</layout:elementGroup>
	
	<layout:head></layout:head>

	<link rel="stylesheet" type="text/css" href="/WEB-APP/builder/templets/css/worker.css">
</head>

<body class="mobile-frame">
	
	<layout:body></layout:body>

	<script>
		var builderOption = {
			mode : 'mobile'
		}
	</script>

	<script src="/WEB-APP/builder/templets/js/dominfo.js"></script>
	<script src="/WEB-APP/builder/templets/js/worker.js"></script>
	
</body>
</html>