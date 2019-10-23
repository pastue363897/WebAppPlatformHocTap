$(document).ready(function() {
	var max_fields      = 10; //maximum input boxes allowed
	var wrapper   		= $(".input_fields_wrap"); //Fields wrapper
	var add_button      = $(".add_field_button"); //Add button ID
	
	var x = 1; //initlal text box count
	$(add_button).click(function(e){ //on add input button click
		e.preventDefault();
		if(x < max_fields){ //max input box allowed
            x++; //text box increment

            //Nếu load gì load trên này .
            $(wrapper).append
            ('<div style="margin-bottom:15px;"> <input style="border: 1px solid black;" type="text" name="tenbaihoc" placeholder="Tên bài giảng."/> <a href="#" class="remove_field">Remove</a> <input type="file" class="form-control" id="" placeholder="Chọn file."></div>'); //add input box
		}
	});
	
	$(wrapper).on("click",".remove_field", function(e){ //user click on remove text
		e.preventDefault(); $(this).parent('div').remove(); x--;
	})
});