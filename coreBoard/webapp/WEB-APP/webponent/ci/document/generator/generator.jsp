<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.io.*,java.util.*,java.util.Scanner"%>

<%!void fileCopy(File inFile, String outFileName) {
		try {
		/* 	FileInputStream fis = new FileInputStream(inFile);
			FileOutputStream fos = new FileOutputStream(outFileName);
			int data = 0;
			while ((data = fis.read()) != -1) {
				//#1E90FF
				//#bbb;
				System.out.println(data);
				fos.write(data);
			}
			fis.close();
			fos.close(); */
			
			BufferedReader br = new BufferedReader( new InputStreamReader(new FileInputStream(inFile)));
			BufferedWriter bw = new BufferedWriter (new OutputStreamWriter(new FileOutputStream(outFileName)));
			
			String line = null;

			while((line=br.readLine())!=null){ 
				
				line = line.replaceAll("#bbb", "#1E90FF").replaceAll("font-style: italic;", "");
				
			    bw.write (line,0,line.length());
			    bw.newLine();
			}
			bw.close();
		    br.close();
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}%>
<%
	String PATH = request.getRealPath("/WEB-APP/webponent/ci/");
	String path = PATH;
	String name = request.getParameter("fileName");
	String jsdocPath = path + "/document/jsdoc-toolkit/";
	String targetName = "";

	boolean needAlert = false;
	boolean isSuccess = false;

	if (name != null && !"".equals(name)) {
		isSuccess = false;
		path = path + "/" + name;
		File tf = new File(path);
		String ta[] = name.split("[.]");
		
		if (tf.exists() && ta[ta.length-1].equals("js")) {
			needAlert = false;

			String[] cmd = { "cmd", "/c", "java.exe", "-jar", jsdocPath + "jsrun.jar", jsdocPath + "app/run.js", path, "-t=" + jsdocPath + "templates/jsdoc", "-d=" + jsdocPath + "/out/" };

			Process process = null;

			try {
				process = new ProcessBuilder(cmd).start();

				Scanner s = new Scanner(process.getInputStream());
				while (s.hasNextLine() == true) {
					System.out.println(s.nextLine());
				}

				File dir = new File(jsdocPath + "out/symbols/src");
				File targetFile = null;
				if (dir.isDirectory()) {
					File fs[] = dir.listFiles();
					for (File f : fs) {
						String arr[] = f.getName().split("_");
						String afn = arr[arr.length - 1];
						if (afn.contains(name)) {
							targetFile = f;
							targetName = afn;
							break;
						}
					}
				}

				if (targetFile != null) {
					fileCopy(targetFile, PATH + "/document/" + targetName);
					isSuccess = true;
				}

			} catch (Exception e) {

			}
		} else {
			needAlert = true;
		}
	}
%>
<div>
	<h2>jsDOC 생성</h2>
	<form id="form" name="form" action="generator.jsp" method="post">
		<input type="file" name="fileName" />
		<br />
		<input type="submit" value="시작" />
    <script type="text/javascript">
        if(<%=needAlert%>) {
        	alert('/WEB-APP/webponent/ci/ 경로에있는 js파일만 가능합니다.');
        }
        
        if(<%=isSuccess%>) {
        	alert('생성하였습니다\n<%=PATH.replaceAll("\\\\", "/") + "/document/" + targetName%>');
        	window.open('/WEB-APP/webponent/ci/document/<%=targetName%>');
        }
    </script>
	</form>
</div>