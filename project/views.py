#coding=utf8
from new import Framework


class Project():

    @classmethod
    def gen(cls, datas):
        project_path = datas['output_path'] + datas['artifactId'] + '/'
        print('project: ' + project_path)
        Framework.render(datas=datas, template_file='pom.xml',
                   template_path='templates',
                   output_path=project_path,
                   output_file='pom.xml')
