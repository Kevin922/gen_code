package  {{ base_package }}.service;

import  {{ base_package }}.domain.{{ table_name_uppercase }};
import  {{ base_package }}.domain.common.Page;
import  {{ base_package }}.domain.requestForm.{{ table_name_uppercase }}Form;
import  {{ base_package }}.service.base.BaseService;

/**
 * Created by root on 10/2/15.
 */
public interface {{ table_name_uppercase }}ForSaleService extends BaseService<{{ table_name_uppercase }},Long> {
}