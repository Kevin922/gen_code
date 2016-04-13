#coding=utf8

class Dao():
    @classmethod
    def gen(cls, datas):
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