
<html>
<head>
<title> AJAX Grid example</title>
<link rel='StyleSheet' type='text/css'
	href='/coreframe/coreframe/webponent/css/cjux.css' />
<script type='text/javascript'
	src='/coreframe/coreframe/webponent/jslib/prototype.js'></script>
<script type='text/javascript'
	src='/coreframe/coreframe/webponent/jslib/cjux.js'></script>

</head>
<body>
<form id='excform'
	action='/coreframe/corelogic/process//samples/database/listCities.xhtml?data-only=true'
	method='post' onSubmit='return send()'>
<table border='1'>
	<tr>
		<th>name</th>
		<td><input type='text' name='name' value='' /></td>
	</tr>
</table>
<input type='submit' value='execute' /></form>

<div>
<table id='tbl1'>
	<colgroup>
		<col width="100" />
		<col align="center" width="100" />
		<col width="100" />
		<col width="100" />
		<col width="100" />
		<col width="" />
	</colgroup>

	<thead>
		<tr>
			<th scope="col">id</th>
			<th scope="col" class="stringType">name</th>
			<th scope="col">country</th>
			<th scope="col">airport</th>
			<th scope="col">language</th>
			<th scope="col">countryIsoCode</th>
		</tr>
	</thead>
	<tbody><!-- data area --></tbody>
</table>
</div>



<script type="text/javascript">
	//<![CDATA[
	Event.observe(window, 'load', init.bind(this));
	var grid;
	function init() {
		grid = new webponent.HtmlGrid('tbl1', '100%', '300px');
	}
	function send() {
		var f = $('excform');
		grid.updateBody(f.action, {
			parameters : f.serialize(),
			asynchronous : true
		});
		return false;
	}
	//]]>
</script>

</body>
</html>


