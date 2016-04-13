#coding=utf8

class Domain():
    @classmethod
    def gen(cls, datas):
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