package {{ base_package }}.domain.common;

import java.io.PrintWriter;
import java.io.StringWriter;


public class Message {
    private String code;// 编码
    private String result;// 结果
    private Object data;// 数据

    public Message() {
        // 默认构造方法
    }
    public Message(String code, String result) {
        this.code = code;
        this.result = result;
    }
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public String getResult() {
        return result;
    }
    public void setResult(String result) {
        this.result = result;
    }

    @SuppressWarnings("unchecked")
    public <E> E getData() {
        return (E) data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public static Message create(String code,String result) {
        return new Message(code, result);
    }

    public static Message success() {
        return success("操作成功!");
    }

    public static Message success(String msg) {
        return create("success", msg);
    }
    public static Message failure() {
        return failure("操作失败!");
    }

    public static Message failure(String msg) {
        return create("failure", msg);
    }

    public static Message failure(Exception ex) {
        return failure("系统异常:"+ex.getMessage(),ex);
    }

    public static Message failure(String message, Exception ex) {
        if(ex == null) {
            return failure();
        }
        Message msg = failure(message);
        try {
            StringWriter sw = new StringWriter();
            ex.printStackTrace(new PrintWriter(sw));
            msg.setData(sw.toString());
        } catch (Exception e) {
        }
        return msg;
    }
}