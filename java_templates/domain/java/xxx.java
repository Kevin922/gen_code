package {{ base_package }}.domain;

import {{ base_package }}.domain.base.BaseDomain;

import java.util.Date;
import java.util.List;

public class {{ table_name_uppercase }} extends BaseDomain {
	private static final long serialVersionUID = 1L;

	{% for k,v in domain.items() -%}
    private {{ v[0] }} {{ k }}; // {{ v[1] }}
	{% endfor %}


	{% for k,v in domain.items() -%}
	public {{ v[0] }} get{{ k|capitalize() }}() {
        return {{ k }};
    }

    public void set{{ k|capitalize() }}({{ v[0] }}  {{ k }}) {
        this.{{ k }} = {{ k }};
    }
	{% endfor -%}
}