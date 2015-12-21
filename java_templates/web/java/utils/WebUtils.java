package {{ base_package }}.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.util.StringUtils;
import javax.servlet.http.HttpServletRequest;

public class WebUtils {

    private String assetsPath;

    /**
     * 获取到资源文件地址
     *
     * @param file
     * @return
     */
    public String getAssetsPath(String file) {
        return assetsPath + file;
    }

    public List<String[]> getCrumbsByString(String crumbs) {
        if (StringUtils.isEmpty(crumbs)) {
            return null;
        }
        String[] sp = crumbs.split(",");
        List<String[]> list = new ArrayList<String[]>();
        for (String val : sp) {
            String[] url = val.split(":");
            list.add(url);
        }
        return list;
    }

    public void setAssetsPath(String assetsPath) {
        this.assetsPath = assetsPath;
    }

    public int[] pageSplit(int curr, int total, int count) {
        int start = Math.max(1, curr - count / 2);
        int end = Math.min(total, start + count - 1);
        start = Math.max(1, end - count + 1);
        return createSplit(start, end);
    }

    private int[] createSplit(int start, int end) {
        int size = end + 1 - start;
        int[] pages = new int[size];
        for (int i = 0, j = start; i < size; i++, j++) {
            pages[i] = j;
        }
        return pages;
    }


    /**
    * 获取上一页地址
    * @param req
    * @return
    */
    public static String fetchReferer(HttpServletRequest req) {
        String url = req.getHeader("referer");
        if (url == null) {
            url = "/";
        }
        StringBuffer sb = new StringBuffer();
        String msg = "(?<=[&?]{1})msg=(.*?[&?$])";
        String success = "(?<=[&?]{1})success=(.*?[&?$])";
        url = url.replaceAll(msg,"");
        url = url.replaceAll(success,"");
        sb.append(url);
        return sb.toString();
    }
}