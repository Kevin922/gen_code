# coding=utf8
import collections
import shutil
import os
import codecs
import jinja2

__author__ = 'yanwenyuan'


class Framework(object):
    @classmethod
    def copy(cls, src_path, des_path):
        if os.path.exists(des_path):
            shutil.rmtree(des_path)
        shutil.copytree(src_path, des_path, False)

    @classmethod
    def rm(cls, path):
        if os.path.exists(path):
            shutil.rmtree(path)

    @classmethod
    def render(cls, datas, template_file='xxxMapper.xml', template_path='java_templates',
               output_path='', output_file=''):

        """
        :param datas: 页面所需数据
        :param template: 基础模板文件名
        :param template_path: 基础模板路径
        :return: 生成的文件路径（utf8编码）
        """

        env = jinja2.Environment(loader=jinja2.PackageLoader(__name__, template_path))
        conf_template = env.get_template(template_file)

        out = conf_template.render(**datas)

        if not os.path.exists(output_path):
            os.makedirs(output_path)

        with codecs.open(output_path + output_file, 'w', 'utf8') as f:
            f.write(out)

    @classmethod
    def web(cls, datas):
        web_base_path = datas['output_path'] + datas['artifactId'] + '/' + datas['artifactId'] + '-web/'
        web_res_path = web_base_path + '' + 'src/main/'
        web_java_path = web_base_path + '' + data['common_path'] + data['package_path'] + 'web/'

        print('web:' + web_java_path)
        print('BUILDING - web Controller')
        cls.render(datas=datas, template_file='xxxController.java',
                   template_path='java_templates/web/java/controller',
                   output_path=web_java_path + 'controller/',
                   output_file=datas['table_name_uppercase'] + 'Controller.java')
        cls.render(datas=datas, template_file='BaseController.java',
                   template_path='java_templates/web/java/controller',
                   output_path=web_java_path + 'controller/',
                   output_file='BaseController.java')
        print('OK - ' + datas['table_name_uppercase'] + 'Controller.java')

        print('BUILDING - web base classs')
        cls.render(datas=datas, template_file='CustomDateEditor.java',
                   template_path='java_templates/web/java/common',
                   output_path=web_java_path + 'common/',
                   output_file='CustomDateEditor.java')

        cls.render(datas=datas, template_file='BeanUtils.java',
                   template_path='java_templates/web/java/utils',
                   output_path=web_java_path + 'utils/',
                   output_file='BeanUtils.java')

        cls.render(datas=datas, template_file='WebUtils.java',
                   template_path='java_templates/web/java/utils',
                   output_path=web_java_path + 'utils/',
                   output_file='WebUtils.java')

        # cls.copy('java_templates/web/java/common', web_java_path+'common')
        # cls.copy('java_templates/web/java/utils', web_java_path+'utils')
        print('OK - web base classs')

        print('BUILDING - web resources')
        cls.copy('java_templates/web/resources/conf', web_res_path + 'resources/conf')
        shutil.copy('java_templates/web/resources/log4j.xml', web_res_path + 'resources/log4j.xml')
        cls.render(datas=datas, template_file='spring-config-dao.xml',
                   template_path='java_templates/web/resources',
                   output_path=web_res_path + 'resources/',
                   output_file='spring-config-dao.xml')
        cls.render(datas=datas, template_file='spring-config-servlet.xml',
                   template_path='java_templates/web/resources',
                   output_path=web_res_path + 'resources/',
                   output_file='spring-config-servlet.xml')
        cls.render(datas=datas, template_file='spring-config-service.xml',
                   template_path='java_templates/web/resources',
                   output_path=web_res_path + 'resources/',
                   output_file='spring-config-service.xml')
        cls.render(datas=datas, template_file='spring-config.xml',
                   template_path='java_templates/web/resources',
                   output_path=web_res_path + 'resources/',
                   output_file='spring-config.xml')
        print('OK - web resources')

        print('BUILDING - web webapp')
        cls.copy('java_templates/web/webapp', web_res_path + 'webapp')
        # CURD
        cls.rm(web_res_path + 'webapp/WEB-INF/views/baseOperator')
        cls.render(datas=datas, template_file='edit.vm',
                   template_path='java_templates/web/webapp/WEB-INF/views/baseOperator',
                   output_path=web_res_path + 'webapp/WEB-INF/views/' + datas["table_name_lowercase"] + '/',
                   output_file='edit.vm')
        cls.render(datas=datas, template_file='list.vm',
                   template_path='java_templates/web/webapp/WEB-INF/views/baseOperator',
                   output_path=web_res_path + 'webapp/WEB-INF/views/' + datas["table_name_lowercase"] + '/',
                   output_file='list.vm')
        cls.render(datas=datas, template_file='search.vm',
                   template_path='java_templates/web/webapp/WEB-INF/views/baseOperator',
                   output_path=web_res_path + 'webapp/WEB-INF/views/' + datas["table_name_lowercase"] + '/',
                   output_file='search.vm')
        cls.render(datas=datas, template_file='view.vm',
                   template_path='java_templates/web/webapp/WEB-INF/views/baseOperator',
                   output_path=web_res_path + 'webapp/WEB-INF/views/' + datas["table_name_lowercase"] + '/',
                   output_file='view.vm')
        print('OK - web webapp')

        print('BUILDING - web properties')
        shutil.copy('java_templates/web/local.properties', web_base_path + 'local.properties')
        print('OK - web properties')

        print('BUILDING - web pom')
        cls.render(datas=datas, template_file='pom.xml',
                   template_path='java_templates/web/',
                   output_path=web_base_path + '',
                   output_file='pom.xml')
        print('OK - web pom')

    @classmethod
    def service(cls, datas):
        service_base_path = datas['output_path'] + datas['artifactId'] + '/' + datas['artifactId'] + '-service' + '/'
        service_path = service_base_path + data['common_path'] + data['package_path'] + 'service/'

        print('service:' + service_path)
        # interface
        print('BUILDING - service java - interface')
        cls.render(datas=datas, template_file='xxxService.java',
                   template_path='java_templates/service',
                   output_path=service_path,
                   output_file=datas['table_name_uppercase'] + 'Service.java')
        print('OK - ' + datas['table_name_uppercase'] + 'Service.java')

        # impl
        print('BUILDING - service java - impl')
        cls.render(datas=datas, template_file='xxxServiceImpl.java',
                   template_path='java_templates/service/impl',
                   output_path=service_path + 'impl/',
                   output_file=datas['table_name_uppercase'] + 'ServiceImpl.java')
        print('OK - ' + datas['table_name_uppercase'] + 'ServiceImpl.java')

        # base
        print('BUILDING - service base class')
        cls.render(datas=datas, template_file='BaseService.java',
                   template_path='java_templates/service/base/',
                   output_path=service_path + 'base/',
                   output_file='BaseService.java')
        cls.render(datas=datas, template_file='BaseServiceImpl.java',
                   template_path='java_templates/service/base/',
                   output_path=service_path + 'base/',
                   output_file='BaseServiceImpl.java')

        # cls.copy('java_templates/service/base', service_path+'base')
        print('OK - service base class')

        # pom
        print('BUILDING - service pom')
        cls.render(datas=datas, template_file='pom.xml',
                   template_path='java_templates/service/',
                   output_path=service_base_path,
                   output_file='pom.xml')
        print('OK - service pom')

    @classmethod
    def dao(cls, datas):
        dao_base_path = datas['output_path'] + datas['artifactId'] + '/' + datas['artifactId'] + '-dao' + '/'
        dao_path = dao_base_path + data['common_path'] + data['package_path'] + 'dao/'

        dao_template_path = 'java_templates/dao/java/'

        print('dao:' + dao_path)
        # interface
        print('BUILDING - dao java - interface')
        cls.render(datas=datas, template_file='xxxDao.java',
                   template_path=dao_template_path,
                   output_path=dao_path,
                   output_file=datas['table_name_uppercase'] + 'Dao.java')
        print('OK - ' + datas['table_name_uppercase'] + 'Dao.java')

        # impl
        print('BUILDING - dao java - impl')
        cls.render(datas=datas, template_file='xxxDaoImpl.java',
                   template_path=dao_template_path + 'impl',
                   output_path=dao_path + 'impl/',
                   output_file=datas['table_name_uppercase'] + 'DaoImpl.java')
        print('OK - ' + datas['table_name_uppercase'] + 'DaoImpl.java')

        # base
        print('BUILDING - dao base class')
        cls.render(datas=datas, template_file='AppException.java',
                   template_path=dao_template_path + 'base',
                   output_path=dao_path + 'base/',
                   output_file='AppException.java')
        cls.render(datas=datas, template_file='BaseDao.java',
                   template_path=dao_template_path + 'base',
                   output_path=dao_path + 'base/',
                   output_file='BaseDao.java')
        cls.render(datas=datas, template_file='BaseDaoImpl.java',
                   template_path=dao_template_path + 'base',
                   output_path=dao_path + 'base/',
                   output_file='BaseDaoImpl.java')
        cls.render(datas=datas, template_file='MyBatisSupport.java',
                   template_path=dao_template_path + 'base',
                   output_path=dao_path + 'base/',
                   output_file='MyBatisSupport.java')

        # cls.copy(dao_template_path+'base', dao_path+'base')
        print('OK - doa base class')

        # resource
        print('BUILDING - dao resource - sqlmap')
        cls.render(datas=datas, template_file='xxxMapper.xml',
                   template_path=dao_template_path + 'resources/sqlmap',
                   output_path=dao_base_path + 'src/main/resources/sqlmap/',
                   output_file=datas['table_name_uppercase'] + '.xml')
        print('OK - ' + datas['table_name_uppercase'] + '.xml')

        print('BUILDING - dao resource - sqlconfig')
        cls.render(datas=datas, template_file='sqlmap-config.xml',
                   template_path=dao_template_path + 'resources',
                   output_path=dao_base_path + 'src/main/resources/',
                   output_file='sqlmap-config.xml')
        print('OK - sqlmap-config.xml')

        # pom
        print('BUILDING - dao pom')
        cls.render(datas=datas, template_file='pom.xml',
                   template_path='java_templates/dao/',
                   output_path=dao_base_path,
                   output_file='pom.xml')
        print('OK - dao pom')

    @classmethod
    def domain(cls, datas):
        domain_base_path = datas['output_path'] + datas['artifactId'] + '/' + datas['artifactId'] + '-domain' + '/'
        domain_path = domain_base_path + data['common_path'] + data['package_path'] + 'domain/'

        template_path = 'java_templates/domain/'

        print('domain:' + domain_path)
        print('BUILDING - base domain java - DB entity')
        cls.render(datas=datas, template_file='xxx.java',
                   template_path=template_path + 'java',
                   output_path=domain_path,
                   output_file=datas['table_name_uppercase'] + '.java')
        print('OK -' + datas['table_name_uppercase'] + '.java')

        print('BUILDING - request create domain - handle post request')
        cls.render(datas=datas, template_file='xxxForm.java',
                   template_path=template_path + 'java/requestForm',
                   output_path=domain_path + 'requestForm/',
                   output_file=datas['table_name_uppercase'] + 'Form.java')
        print('OK - ' + datas['table_name_uppercase'] + 'Form.java')

        print('BUILDING - request query domain - handle get request')
        cls.render(datas=datas, template_file='xxxQueryForm.java',
                   template_path=template_path + 'java/requestForm',
                   output_path=domain_path + 'requestForm/',
                   output_file=datas['table_name_uppercase'] + 'QueryForm.java')
        print('OK - ' + datas['table_name_uppercase'] + 'QueryForm.java')

        print('BUILDING - base domain classes')
        cls.render(datas=datas, template_file='BaseDomain.java',
                   template_path=template_path + 'java/base',
                   output_path=domain_path + 'base/',
                   output_file='BaseDomain.java')
        cls.render(datas=datas, template_file='BaseQuery.java',
                   template_path=template_path + 'java/base',
                   output_path=domain_path + 'base/',
                   output_file='BaseQuery.java')
        cls.render(datas=datas, template_file='Result.java',
                   template_path=template_path + 'java/base',
                   output_path=domain_path + 'base/',
                   output_file='Result.java')

        cls.render(datas=datas, template_file='Message.java',
                   template_path=template_path + 'java/common',
                   output_path=domain_path + 'common/',
                   output_file='Message.java')
        cls.render(datas=datas, template_file='Page.java',
                   template_path=template_path + 'java/common',
                   output_path=domain_path + 'common/',
                   output_file='Page.java')
        print('OK - base domain classes')

        # pom
        print('BUILDING - domain pom')
        cls.render(datas=datas, template_file='pom.xml',
                   template_path=template_path,
                   output_path=domain_base_path,
                   output_file='pom.xml')
        print('OK - domain pom')

    @classmethod
    def project(cls, datas):
        project_path = datas['output_path'] + datas['artifactId'] + '/'
        print('project: ' + project_path)
        print('BUILDING - project pom (include dependencies...)')
        cls.render(datas=datas, template_file='pom.xml',
                   template_path='java_templates',
                   output_path=project_path,
                   output_file='pom.xml')
        print('OK - pom.xml')


if __name__ == '__main__':
    # -------------------------------  NEW
    data = {}
    # 项目名称
    data['groupId'] = "com.dili"
    data['artifactId'] = "xm-product-b2b"

    # 包基础名称
    data['base_package'] = "com.diligrp.titan"
    data['table_name_lowercase'] = "product"
    data['table_name_uppercase'] = data['table_name_lowercase'].capitalize()
    data['domain'] = {'id': ('Long', u'ID', 'id'),
                      'pname': ('String', u'商品名称', 'pname'),
                      'weight': ('Long', u'商品重量', 'weight')}

    # 工程路径
    data['output_path'] = '/Users/yanwenyuan/Desktop/'
    data['common_path'] = 'src/main/java/'
    data['package_path'] = data['base_package'].replace('.', '/') + '/'

    Framework.project(data)
    Framework.web(data)
    Framework.service(data)
    Framework.domain(data)
    Framework.dao(data)
