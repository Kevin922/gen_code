package {{ base_package }}.web.controller;

import java.util.Date;
import java.util.Map;

import javax.annotation.Resource;

import {{ base_package }}.domain.requestForm.{{ table_name_uppercase }}Form;
import {{ base_package }}.domain.requestForm.{{ table_name_uppercase }}QueryForm;
import {{ base_package }}.web.utils.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;

import {{ base_package }}.domain.{{ table_name_uppercase }};
import {{ base_package }}.domain.common.Message;
import {{ base_package }}.domain.common.Page;
import {{ base_package }}.service.{{ table_name_uppercase }}Service;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by root on 10/2/15.
 */
@Controller
@RequestMapping(value = "/{{ table_name_lowercase }}")
public class {{ table_name_uppercase }}Controller extends BaseController {
    private static final Logger LOGGER = LoggerFactory.getLogger({{ table_name_uppercase }}Controller.class);
    
    @Resource
    private {{ table_name_uppercase }}Service {{ table_name_lowercase }}Service;

    public void initBinder(WebDataBinder binder, WebRequest request) {
        // binder.registerCustomEditor(Date.class, new CustomDateEditor(true));
    }

    /**
     * 列表展示
     * @param {{ table_name_lowercase }} 实体对象
     * @param page 分页对象
     */
    @RequestMapping(method = {RequestMethod.GET,RequestMethod.POST})
    public ModelAndView list({{ table_name_uppercase }}QueryForm {{ table_name_lowercase }}QueryForm,Page<{{ table_name_uppercase }}> page,Model view) throws Exception{
        view.addAttribute("query", {{ table_name_lowercase }}QueryForm);

        try {
            view.addAttribute("page", {{ table_name_lowercase }}Service.selectPage({{ table_name_lowercase }}QueryForm, page));
        } catch (Exception e) {
            LOGGER.error("失败:"+e.getMessage(),e);
            throw e;
        }finally{
        }

        return toVM("{{ table_name_lowercase }}/list", view);
    }

    /**
     * 通过编号查看对象
     * @param  {{ table_name_lowercase }} 对象编号
     * @return
     */
    @RequestMapping(value="/view",method=RequestMethod.GET)
    public String view({{ table_name_uppercase }} {{ table_name_lowercase }},Model view) throws Exception{
        try {
            {{ table_name_lowercase }} = {{ table_name_lowercase }}Service.selectEntry({{ table_name_lowercase }});
            if({{ table_name_lowercase }} == null) {
                return null;
            }
            view.addAttribute("{{ table_name_lowercase }}",{{ table_name_lowercase }});
        } catch (Exception e) {
            LOGGER.error("失败:"+e.getMessage(),e);
            throw e;
        }finally{
        }

        return "{{ table_name_lowercase }}/view";
    }

    /**
     * 通过编号 保存\修改
     * @param {{ table_name_lowercase }} 对象编号
     * @return
     */
    @RequestMapping(value="/saveOrUpdate",method=RequestMethod.GET)
    public String saveOrUpdate({{ table_name_uppercase }} {{ table_name_lowercase }},Model view) throws Exception{
        try {
            {{ table_name_lowercase }} = {{ table_name_lowercase }}Service.selectEntry({{ table_name_lowercase }});
            view.addAttribute("{{ table_name_lowercase }}Form",{{ table_name_lowercase }});
        } catch (Exception e) {
            LOGGER.error("失败:"+e.getMessage(),e);
            throw e;
        }finally{
        }

        return "{{ table_name_lowercase }}/edit";
    }

    /**
     * 通过编号 保存\修改
     * @param {{ table_name_lowercase }}Form 对象
     * @return
     */
    @RequestMapping(value="/saveOrUpdate",method=RequestMethod.POST)
    public String saveOrUpdate({{ table_name_uppercase }}Form {{ table_name_lowercase }}Form,Model view) throws Exception{
        view.addAttribute("{{ table_name_lowercase }}Form", {{ table_name_lowercase }}Form);

        try {
            {{ table_name_lowercase }}Service.saveOrUpdate({{ table_name_lowercase }}Form);
            view.addAttribute("error", "保存更新成功");
        } catch (Exception e) {
            LOGGER.error("失败:"+e.getMessage(),e);
            view.addAttribute("error", "保存更新失败");
        }finally{
        }

        return "{{ table_name_lowercase }}/edit";
    }


    /**
     * 通过编号 删除
     * @param pid 对象编号
     */
    @RequestMapping(value="/del",method={RequestMethod.GET,RequestMethod.POST})
    public @ResponseBody Message del(Long pid,Model view) throws Exception{
        Message msg = null;
        try {
            int res = {{ table_name_lowercase }}Service.deleteByKey(pid);
            msg  = res > 0 ? Message.success() : Message.failure();
        } catch (Exception e) {
            LOGGER.error("失败:"+e.getMessage(),e);
            msg = Message.failure();
        }finally{
        }

        return msg;
    }
}
