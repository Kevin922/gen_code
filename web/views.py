#coding=utf8

class Web():
    @classmethod
    def gen(cls, datas):
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