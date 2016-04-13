#coding=utf8

class Service():
    @classmethod
    def gen(cls, datas):
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