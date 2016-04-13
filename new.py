# coding=utf8
import shutil
import os
import codecs
import jinja2

from dao.views import Dao
from domain.views import Domain
from project.views import Project
from service.views import Service
from web.views import Web

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
        Web.gen(datas)

    @classmethod
    def service(cls, datas):
        Service.gen(datas)

    @classmethod
    def dao(cls, datas):
        Dao.gen(datas)

    @classmethod
    def domain(cls, datas):
        Domain.gen(datas)


    @classmethod
    def project(cls, datas):
        print('BUILDING - project pom (include dependencies...)')
        Project.views(datas)
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
