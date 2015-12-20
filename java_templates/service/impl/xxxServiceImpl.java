package {{ base_package }}.service.impl;

import {{ base_package }}.dao.{{ table_name_uppercase }}Dao;
import {{ base_package }}.dao.base.BaseDao;
import {{ base_package }}.domain.{{ table_name_uppercase }};
import {{ base_package }}.domain.common.Page;
import {{ base_package }}.domain.requestForm.{{ table_name_uppercase }}Form;
import {{ base_package }}.service.{{ table_name_uppercase }}Service;
import {{ base_package }}.service.base.BaseServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;

@Service("{{ table_name_lowercase }}Service")
public class {{ table_name_uppercase }}ServiceImpl extends BaseServiceImpl<{{ table_name_uppercase }},Long> implements {{ table_name_uppercase }}Service {

    @Resource private {{ table_name_uppercase }}Dao {{ table_name_lowercase }}Dao;

    @Override
    public BaseDao<{{ table_name_uppercase }}, Long> getDao() {
        return {{ table_name_lowercase }}Dao;
    }


}