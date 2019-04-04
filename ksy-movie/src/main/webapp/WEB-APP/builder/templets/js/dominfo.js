var classDef = {
	'ci-ia' : {
		'ia-vertical' : {

		},
		'ia-liketable' : {

		}
	},

	'ci-cg' : {
		'cg-checkbox' : {

		},
		'cg-radio' : {

		},
		'cg-button' : {

		},
		'cg-fromToDate' : {

		},
		'cg-pc-25' : {

		},
		'cg-pc-33' : {

		},
		'cg-pc-100' : {

		},
		'cg-inline' : {

		},
		'cg-tar' : {

		},
		'cg-tac' : {

		},
		'cg-m-oo' : {

		},
		'cg-m-xoo' : {

		},
		'cg-m-ooo' : {

		}
	},

	'inputs' : {
		'pos-m-up' : {

		},
		'pos-m-down' : {

		},
		'value' : {

		}
	}

};

var markupDef = {
	'ci-ia' : {
		'form' : {
			'name' : 'form',
			'parent' : null,
			'children' : ['ci-cg'],
			'markup' : '<form action="?">\n'+
							'<fieldset class="ci-ia">\n'+
								'<legend>인풋영역</legend>\n'+
								'<ul>\n'+
									'<li class="ci-cg">\n'+
										'<label for="">LABEL</label>\n'+
										'<input type="text" name="" id="" value=""/>\n'+
									'</li>\n'+
								'</ul>\n'+
							'</fieldset>\n'+
						'</form>'
		}
	},
	'ci-cg' : {
		'name' : 'control group',
		'parent' : 'ci-ia',
		'children' : ['inputs'],
		'markup' : '<li class="ci-cg">' +
					'</li>'
	},
	'inputs' : {
		'text' : {
			'name' : 'TEXT',
			'parent' : 'ci-cg',
			'markup' : '<label for="">TEXT</label>\n'+
						'<input type="text" name="" id="" value=""/>'
		},
		'password' : {
			'name' : 'PASSWORD',
			'parent' : 'ci-cg',
			'markup' : '<label for="">PASSWORD</label>\n'+
						'<input type="password" name="" id=""/>'
		},
		'select' : {
			'name' : 'SELECT',
			'parent' : 'ci-cg',
			'markup' : '<label for="">SELECT</label>\n' +
						'<select name="" id="">\n' +
							'<option value="">option1</option>\n' +
							'<option value="">option2</option>\n' +
							'<option value="">option3</option>\n' +
						'</select>\n'
		},
		'radio' : {
			'name' : 'RADIO',
			'parent' : 'ci-cg',
			'parent-require-class' : 'cg-radio',
			'markup' : '<fieldset>\n' +
							'<legend>RADIO</legend>\n' +
							'<input type="radio" name="" id="" checked="checked">\n' +
							'<label class="radio" for="">option1</label>\n' +
							'<input type="radio" name="" id="">\n' +
							'<label class="radio" for="">option2</label>\n' +
						'</fieldset>\n'
		},
		'checkbox' : {
			'name' : 'CHECK BOX',
			'parent' : 'ci-cg',
			'parent-require-class' : 'cg-checkbox',
			'markup' : '<fieldset>\n' +
							'<legend>CHECK</legend>\n' +
							'<input type="checkbox" name="" id="" checked="checked">\n' +
							'<label class="checkbox" for="">option1</label>\n' +
							'<input type="checkbox" name="" id="">\n' +
							'<label class="checkbox" for="">option2</label>\n' +
						'</fieldset>'
		},
		'datepicker' : {
			'name' : 'DATE PICKER',
			'parent' : 'ci-cg',
			'markup' : '<label for="">DATE</label>\n' +
						'<input type="text" class="datepicker" name="" id="" value=""/>',
			'afterAppend' : function (markup) {
				ci.datepicker(markup);
			}
		},
		'datepicker-long' : {
			'name' : 'DATE PICKER LONG',
			'parent' : 'ci-cg',
			'parent-require-class' : 'cg-fromToDate',
			'markup' : '<label for="date3">DATEPICKER</label>\n' +
						'<input type="text" class="datepicker" name="" id="" value=""/>\n' +
						'<span>~</span>\n' +
						'<input type="text" class="datepicker" name="" id="" value=""/>\n' +
						'<input type="button" class="mediumBtn ci-datepicker-1week" value="1주일" />\n' +
						'<input type="button" class="mediumBtn ci-datepicker-1month" value="1개월" />\n' +
						'<input type="button" class="mediumBtn ci-datepicker-3month" value="3개월" />\n' +
						'<input type="button" class="mediumBtn ci-datepicker-6month" value="6개월" />\n' +
						'<input type="button" class="mediumBtn ci-datepicker-1year" value="1년" />\n',
			'afterAppend' : function (markup) {
				markup.filter('.datepicker').each(function(){
					ci.datepicker($(this));
				});
			}
		}
	},
	'additional' : {
		'span' : {
			'name' : 'SPAN',
			'markup' : '<span>SPAN</span>'
		},
		'codeSearchBtn' : {
			'name' : 'BTN CODE SEARCER',
			'markup' : '<input type="button" class="codeSearchBtn" value="검색"/>'
		},
		'checkbox' : {
			'name' : 'INNER CHECKBOX',
			'markup' : '<input type="checkbox" class="pos-m-down" name="" id="">' +
						'<label class="checkbox" for="">CHECKBOX</label>'
		}
	}
};
