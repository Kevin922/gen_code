package {{ base_package }}.dao;

import java.util.List;

import {{ base_package }}.dao.base.BaseDao;
import {{ base_package }}.domain.{{ table_name_uppercase }};

public interface {{ table_name_uppercase }}Dao extends BaseDao<{{ table_name_uppercase }},Long>{
	//自定义扩展
		
}