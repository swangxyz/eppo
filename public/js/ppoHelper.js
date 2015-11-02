/**
 * Script by Steven W. @ SMH
 * Prescription form interaction javascript
 */
var ppoHelper = (function($){
	/**
	 * initilization
	 */
	var init = function() {
		
		setupPreloadStates();	
		
		setupDatePicker();
		
		setupBSACalculator();
		
		setupIntegerInputFilter();
		
		setupDecimalInputFilter();
		
		setupMutualExclusiveBehavior();
		
		setupIoTListener();
		
		setupAllergiesListener();
			
		setupSubmissionValidator();
	},
	
	/**
	 * Toggle
	 * 
	 * If allergies radio button toggle, then show allergies textarea
	 * 
	 */
	toggleAllergiesInput = function () {
		if ($('#PrescriptionAllergiesToggle1').is(":checked"))
			$(".allergies").removeClass('hidden');
		else if ($('#PrescriptionAllergiesToggle0').is(":checked"))
			$(".allergies").addClass('hidden');
	},

	/**
	 * Validation Toggle
	 * 
	 * if IOT selection is P, then add class mandatary-field
	 * 
	 */
	toggleCCOLotMandatary = function () {
		if ($('#PrescriptionInternalNoteIotP').is(":checked")) {
			// alert($("#PrescriptionInternalNoteCcolot").val())
			$("#PrescriptionInternalNoteCcolot").addClass("mandatary-field");
			if(	$("#PrescriptionInternalNoteCcolot").val() == 'N/A')
				$("#PrescriptionInternalNoteCcolot").val('')
		}
		else
		{
			$("#PrescriptionInternalNoteCcolot").removeClass("mandatary-field").removeClass("mandatary-field-error").val('N/A');
			$('#PrescriptionInternalNoteCcolot-error').remove();
		}	
	},


	/**
	 *  Validation Toggle
	 *  @Description: 
	 *  
	 *  1. get the id of the checkbox
	 * 	2. string processing to get the class(area) of this whole drug item. set the class as drug-is-selected
	 *  3. if this drug is checked, then remove disabled prop, add class mandatary-field for validation
	 *  4. if this drug is unchecked, then do reverse stuff.
	 *  
	 *  @param: get the check box for drug
	 */ 

	toggleDrugFieldsMandatary = function (box) {
		var itemID = $(box).attr("id");
		var itemClass = itemID.substring(0, itemID.length - 10);
		var divID = itemClass+'Div';
		if ($(box).is(':checked')) {
			$('#'+divID).addClass("drug-is-selected");
			$('.' + itemClass + '>:input').addClass("mandatary-field").prop('disabled', false);

		} else {
			$('#'+divID).removeClass("drug-is-selected");
			$('.' + itemClass + '>:input').removeClass("mandatary-field").removeClass("mandatary-field-error").prop('disabled', true);
			$('.' + itemClass + '>.error-message').remove();
		}
	},

	/**
	 * Check prescription pre-load data and make related events happen
	 */
	setupPreloadStates = function(){
		//If allergies toggled 'yes', then show allergies textarea
		toggleAllergiesInput();
		
		//If IOT radio button toggled to P, then add CCOLot to Mandatary
		toggleCCOLotMandatary();
		
		//If drug-select-checkbox is checked, then toggle its fields as mandatary
		$('.drug-select-checkbox').each(function() {
			toggleDrugFieldsMandatary(this);
		});		
	},
	
	/**
	 * Setup bootstrap datetime picker with only date option 
	 */
	setupDatePicker = function(){
		
		$('.datetimepicker').datetimepicker({
			minView : 2,
			startView : 2,
			autoclose : true,
			todayBtn : true,
			//startDate : new Date(),
			format : 'MM d, yyyy',
		})
	},
	
	/**
	 * Listener: calculate bsa based on height and weight
	 */
	setupBSACalculator = function() {
		
		$('.get_bsa_btn').click(function() {
			if($('#PrescriptionWeight').val() && $('#PrescriptionHeight').val())
			{
				var bsaValue = Math.round(Math.sqrt($('#PrescriptionWeight').val() * $('#PrescriptionHeight').val() / 3600) * 100) / 100;
				if(bsaValue < 0.5 || bsaValue >3.0){
					alert("BSA value should be in the range of 0.5 to 3.0.");
				}				
				
				$('#PrescriptionBsa').val(bsaValue);
				$('#PrescriptionBsaText').text(bsaValue);
				$('.bsa_dose_result').val('');
			}
		});
		$('#PrescriptionHeight').change(function(e) {
			$('.get_bsa_btn').click();
		});
		$('#PrescriptionWeight').change(function(e) {
			$('.get_bsa_btn').click();
		});
	},
	
	/**
	 * Listener: make sure some fields are 0-9 and dot only, INPUT CONTROL
	 */
	setupIntegerInputFilter = function(){
		
		$('.integer-field').keydown(function (e) {
		    // Allow: backspace, delete, tab, escape, enter
		    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
		         // Allow: Ctrl+A
		        (e.keyCode == 65 && e.ctrlKey === true) ||
		         // Allow: Ctrl+C
		        (e.keyCode == 67 && e.ctrlKey === true) ||
		         // Allow: Ctrl+X
		        (e.keyCode == 88 && e.ctrlKey === true) ||
		         // Allow: home, end, left, right
		        (e.keyCode >= 35 && e.keyCode <= 39)) {
		             // let it happen, don't do anything
		             return;
		    }
		    // Ensure that it is a number and replace not allow value with 0-9
		    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		    	
		    	e.preventDefault();
		    	
		    	alert("Only integers are allowed.")
		    	
		    	this.value = this.value.replace(/[^0-9]/g, '');
		    }
		})
	},
	
	/**
	 * Listener: make sure some fields decimal only
	 */
	setupDecimalInputFilter = function(){
		
		$('.decimal-field').keydown(function(e) {
		    // Allow: backspace, delete, tab, escape, enter and .(110 & 190)
		    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
		         // Allow: Ctrl+A
		        (e.keyCode == 65 && e.ctrlKey === true) ||
		         // Allow: Ctrl+C
		        (e.keyCode == 67 && e.ctrlKey === true) ||
		         // Allow: Ctrl+X
		        (e.keyCode == 88 && e.ctrlKey === true) ||
		         // Allow: home, end, left, right
		        (e.keyCode >= 35 && e.keyCode <= 39)) {
		             // let it happen, don't do anything
		             return;
		    }
		    // Ensure that it is a number and replace not allow value with 0-9.
		    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		    	
		        e.preventDefault();
		        
		        alert("Only numeric input please.")
		        
		        this.value = this.value.replace(/[^0-9.]/g, '');
		    }
		})
	},
	/** 
	 * Listener: if checkbox clicked, simulate radio button behavior for each drug block
	 * and call toggleDrugFieldsMandatary() function
	 * 
	 */
	setupMutualExclusiveBehavior = function(){
		
		$('.drug-select-checkbox').change(function() {
			
			var block = $(this).attr("class").split(' ')[0];
			
			//a block of durgs with same id that should be mutual exclusive
			if ($(this).is(":checked") && block != 'block-unique') {
					
				// toggle all durgs off with same drug id(same block)
				$('.' + block).prop("checked", false).each(function() {			
					// toggle inputs fields belongs to diabled to this block of drugs
					toggleDrugFieldsMandatary(this)
				});	
		
				// toggle this one on, this would not trigger change event, so would not be a dead loop
				$(this).prop("checked", true);
		
			}
			// toggle other inputs fields diable/enable belongs to this drug not this block
			toggleDrugFieldsMandatary(this);	
		})
	},

	/**
	 * Listener: If allergies radio button toggle, then show allergies textarea
	 * 
	 */
	// 
	setupAllergiesListener = function(){
		
		$("input[name='data[Prescription][allergies_toggle]']").change(function() {
			toggleAllergiesInput()
		})
	},
	/**
	 * Listener: If IOT radio button toggle to P, then add CCOLot to Mandatary
	 * 
	 */
	setupIoTListener = function(){
		
		$("input[name='data[Prescription][internal_note_iot]']").change(function() {
			toggleCCOLotMandatary()
		})
	},
	/**
	 * Listener: form submit javascript valiadation
	 * 
	 */
	setupSubmissionValidator = function(){
		
		$('form').on('submit', function() {
			return checkMandataryFields() && checkIntegerFields();
		})
		/**
		 * all input with "mandatary-field" should not be empty.
		 * 
		 * empty space will be add mandatary-field-error class and focused
		 */
		var checkMandataryFields = function () {
			var result = true;
			
			//before check new errors, check the error is corrected
			$('.mandatary-field-error').each(function() {
				if ($(this).val()) {
					$(this).removeClass("mandatary-field-error");
					var errorID = $(this).attr('id')+'-error';
					$( '#'+errorID ).remove();
				}
			});
			//check errors
			$('.mandatary-field').each(function() {
				if (!$(this).val() && !$(this).is(':disabled')) {
					//  keep focus on new error and no distraction
					$(this).focus();
					// check this has no class .mandatary-field-error so we only attach error message once
					if(!$(this).hasClass("mandatary-field-error"))
					{
						// add error message
						$(this).addClass("mandatary-field-error").after( "<span id = '"+$(this).attr('id')+"-error' class='error-message'>This cannot be empty. </span>" );				
					}
					// set result false to prevent form submit
					result = false;
				}
			});
			return result;
		};
		/**
		 * we have already make sure no charaters input.
		 * all input with "integer-field" and not empty should not be empty.
		 * 
		 * empty space will be add mandatary-field-error class and focused
		 */
		var checkIntegerFields = function () {
			var result = true;
			
			// before check new errors, check the error is corrected
			$('.integer-field-error').each(function() {
				var value = $(this).val() - 0;
			    if($.isNumeric(value) && value % 1 === 0){
			       // yes it's an integer.	    
					$(this).removeClass("integer-field-error");
					var errorID = $(this).attr('id')+'-error';
					$( '#'+errorID ).remove();
			    }
				
			});
			// check errors
			$('.integer-field').each(function(){
				if(!$(this).is(':disabled'))
				{
					var value = $(this).val() - 0;
				
				    if($.isNumeric(value) && value % 1 === 0){
				       // yes it's an integer.	    	
				    }
				    else
				    {		  
				    	$(this).focus();
				    	result = false;
				    	if(!$(this).hasClass("integer-field-error"))
				    		$(this).addClass("integer-field-error").after( "<span id = '"+$(this).attr('id')+"-error' class='error-message'>This shoubld be an integer. </span>" );				
				    }		    				
				}

			});
			return result;
		};
	};
	return {
		init: init
	};
}( jQuery ));

$(document).ready(function() {
  ppoHelper.init();
});