package {{ base_package }}.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import java.util.Date;
import java.util.Map;


public class BaseController {
    private static final Logger LOGGER = LoggerFactory.getLogger(BaseController.class);

    @Resource(name = "velocityTools")
    private Map<String, Object> velocityTools;

    /**
     * velocity 工具函数
     * @param view
     */
    private void setVelocityTools(Model view) {
        if (velocityTools == null) {
            LOGGER.info("spring bean中没有注入 `velocityTools` ");
        }
        for (Map.Entry entry : velocityTools.entrySet()) {
            view.addAttribute(entry.getKey().toString(), entry.getValue());
        }
    }

    protected ModelAndView toVM(String template, Model view) {
        setVelocityTools(view);
        return new ModelAndView(template);
    }
}
