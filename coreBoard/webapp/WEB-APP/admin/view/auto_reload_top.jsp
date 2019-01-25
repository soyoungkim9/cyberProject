<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
		<title>Insert title here</title>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
		<style type="text/css">
			body {

				background-color: #202021;
				color: #fff;
				overflow: hidden;
			}
			* {
				font-size: 13px;
			}

		</style>

		<script type="text/javascript">
			var lastChkTime = 0;
			var isRun = true;
			var isFirst=true;
			function reload() {

				if (!isRun) {
					$('#b').attr('value', 'START');
					return;
				}

				var u = $('#u').val();

				//alert('t');
				$.ajax({
					type : "POST",
					url : "/coreframe5/apps/admin/checkTime?x=" + Math.random(),
					data : $('#f').serialize(),
				}).done(function(msg) {
					if (lastChkTime != msg) {

						parent.reload(u);
						lastChkTime = msg;
					}

					window.setTimeout(function() {
						reload(u);
					}, 500);

				});
			}
			
			


			$(document).ready(function() {
				$('#u').attr('value', parent.reloadURL);
				parent.reload(parent.reloadURL);
				//reload();

				$('#b').click(function() {
					var k = $(this).attr('value');
					if (k == 'STOP') {
						isRun = false;
					} else {
						isRun = true;
						if(isFirst) {
							check();
							isFirst=false;
						}
						
						reload();
						$(this).attr('value', 'STOP');
					}

				});
				$('#cfg').click(function(){
					var k = $(this).attr('value');
					if (k == 'Show resources') {
						var count=check();
						$(this).attr('value','Hide resources')
						$(parent.fs).attr('rows',(count*28+40)+',*');
					}else {
						$(this).attr('value','Show resources')
						$(parent.fs).attr('rows','40,*');
					}
				});
				$('#closeBtn').click(function(){
					parent.location.href=parent.reloadURL;
				});
			});
			
			function check() {
				
				var count=0;
				var e=$('#ext');
				e.children().remove();
				var input=$('<input type="text" name="href"/>').attr('value', parent.reloadURL);
				e.append(input);
				count++;
				$(parent.main.document).find('link').each(function(i){
					var link=$(this).attr('href');
					if(link && link.length>0) {
						var input=$('<input type="text" name="href"/>').attr('value', link);
						e.append(input);
						count++;
					}
				});
				$(parent.main.document).find('script').each(function(i){
					var link=$(this).attr('src');
					if(link && link.length>0) {
					 var input=$('<input type="text" name="href"/>').attr('value', link);
					 e.append(input);
					 count++;
					}
				});
				return count;
			}
			
			

		</script>
  
  
  
    <style type="text/css">
    	div#ext {
    		width:500px;
        padding:6px;
        margin-left:160px;
    	}
     div#ext input {
     	width:500px;
     }
     
     form#f label {
     	width:160px;
      display:inline-block;
      
     }
     #closeBtn {
     	background-color:#555;
      border:1px solid #ccc;
      color:#eee;
      display:inline-block;
     }
     
    </style>
    
	</head>
	<body>
		<form id="f" action="">

			<label>AUTO Refresh
			<input id="b" type="button" value="START" data-key="stop" />
      </label>
			<input id="u" type="text" name="url" value="" size="100">
			
      <input id="cfg" type="button" value="Show resources" />
      <input id="closeBtn" type="button" value="X" />
			
      <div id="ext"></div>

		</form>

	</body>
</html>