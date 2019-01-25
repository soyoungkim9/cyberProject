<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>coreFRAME Previewer</title>
		<script type="text/javascript">
		 var reloadURL = '${reloadURL}';
			function reload(url) {
				var f=document.getElementById('t');
				if(url.indexOf('?')>0) {
					url=url+'&';
				}else {
					url=url+'?';
				}
				url=url+'_m_='+Math.random();
				f.src=url;
			}
		</script>
	</head>

	<frameset id="fs" rows="40,*" border="0">
		<frame src="./autoReloadTop"/>
		<frame name="main" id="t" src=""/>
	</frameset>

</html>