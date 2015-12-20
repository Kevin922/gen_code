package {{ base_package }}.dao.impl;

import {{ base_package }}.dao.{{ table_name_uppercase }}Dao;

import java.util.List;

import org.springframework.stereotype.Repository;
import {{ base_package }}.domain.{{ table_name_uppercase }};
import {{ base_package }}.dao.base.BaseDaoImpl;


@Repository("{{ table_name_lowercase }}Dao")
public class {{ table_name_uppercase }}DaoImpl extends BaseDaoImpl<{{ table_name_uppercase }},Long> implements {{ table_name_uppercase }}Dao {
	private final static String NAMESPACE = "{{ base_package }}.dao.{{ table_name_uppercase }}Dao.";
	
	//返回本DAO命名空间,并添加statement
	public String getNameSpace(String statement) {
		return NAMESPACE + statement;
	}
}