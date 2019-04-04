package member;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import coreframe.data.DataSet;
import coreframe.data.InteractionBean;
import coreframe.data.ResourceException;

public class join {
    public static boolean checkId(DataSet input) throws ResourceException, IOException {
        if(input.getText("id") == ""){
            return false;
        }

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
}
