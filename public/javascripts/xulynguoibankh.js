//import { wrap } from "module";

$(document).ready(function() {
	var max_fields      = 100; //maximum input boxes allowed
	var wrapper   		= $(".input_fields_wrap"); //Fields wrapper
	var add_button      = $(".add_field_button"); //Add button ID
	var remove_button	= $(".remove_field");
	
	var x = $('div[name*="baiHocDiv"]').length + 1; //initlal text box count
	$(add_button).click(function(e){ //on add input button click
		e.preventDefault();
		if(x < max_fields){ //max input box allowed
            x++; //text box increment

            //Nếu load gì load trên này .
			$(wrapper).append('<div name="baiHocDiv" style="margin-bottom:15px;"> <input style="border: 1px solid black;" type="text"  required="true" name="tenbaihoc'+(x-1).toString(10)+'" placeholder="Tên bài giảng."/> <input style="border: 1px solid black;" type="text" name="tomtat'+(x-1).toString(10)+'" placeholder="Tóm tắt bài giảng."/> <input type="file" class="form-control" required="true" name="file'+(x-1).toString(10)+'" placeholder="Chọn file."></div>'); //add input box
		}
	});

	$(remove_button).click(function(e){ //on add input button click
		if(x >= 2) {
			e.preventDefault();
			$(wrapper).children().last().remove(); x--;
		}
	});
});