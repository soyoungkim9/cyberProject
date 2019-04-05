package member;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import coreframe.data.DataSet;
import coreframe.data.InteractionBean;

public class Join {
    public static boolean checkId(DataSet input) throws IOException {
        if(input.getText("id") == "")
            return false;

        Pattern p = Pattern.compile("^[a-z0-9][a-z0-9_\\-]{4,14}$");
        Matcher m = p.matcher(input.getText("id"));
        if(m.find() == false)
            return false;

        InteractionBean interact = new InteractionBean();
        if(interact.execute("member/list", input).toList().size() > 0){
            throw new DuplicatedException();
        }

        return true;
    }

    public static boolean checkPswd1(DataSet input) {
        if(input.getText("password") == "")
            return false;

        if(isValidPassword(input.getText("password")) == false)
            return false;

        return true;
    }

    public static boolean checkPswd2(DataSet input) {
        if(input.getText("confirmPassword") == "")
            return false;

        if(!input.getText("password").equals(input.getText("confirmPassword")))
            return false;

        return true;
    }

    public static boolean checkName(DataSet input) {
        if(input.getText("name") == "")
            return false;

        Pattern p = Pattern.compile("^[a-z\\uac00-\\ud7a3][a-z\\uac00-\\ud7a3]{0,9}$");
        Matcher m = p.matcher(input.getText("name"));
        if(m.find() == false)
            return false;

        return true;
    }

    public static boolean checkGender(DataSet input) {
        if(input.getText("gender") == "")
            return false;

        return true;
    }

    public static boolean checkBirth(DataSet input) {
        if(input.getText("birth") == "")
            return false;

        return true;
    }

    private static boolean isValidPassword(String pwd) {
        if (pwd.equals(""))
            return false;

        if(pwd.contains(" "))
            return false;

        if(pwd.length() < 8)
            return false;

        int cnt = 0;
        for(int i = 0; i < pwd.length(); i++) {
            if (Character.toString(pwd.charAt(0)).equals(pwd.substring(i, i+1)))
                ++cnt;
        }
        if(cnt == pwd.length())
            return false;

        Pattern p = Pattern.compile("^[A-Za-z0-9`\\-=\\\\\\[\\];',\\./~!@#\\$%\\^&\\*\\(\\)_\\+|\\{\\}:\"<>\\?]{8,16}$");
        Matcher m = p.matcher(pwd);
        if(m.find() == false)
            return false;

        return true;
    }
}
