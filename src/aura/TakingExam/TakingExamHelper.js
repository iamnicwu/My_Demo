({
	getRelatedData : function(cmp) {
		// Get lead Id from component
		console.log('get related data start');
		var leadId = cmp.get('v.leadId');
        var action = cmp.get('c.getRelatedData');
        // Add parameters to action handler that are being sent to server controller
		action.setParams({
			'leadId' : leadId
		});
        // Setup callback function for action handler
		action.setCallback(this, function(response) {
            var returnValue = response.getReturnValue();
			var state = response.getState();

			// If the response is not successful do not try to execute setup code
			if(state !== 'SUCCESS' || returnValue === null) {
                console.log('get related data failed!');
				return;
			}
            console.log('get related data');
            // Set component attributes based upon response return values
			cmp.set('v.currentLead', returnValue.currentLead);
            cmp.set('v.convertParams.newOppName', cmp.get('v.currentLead.Company') +'-');
            cmp.set('v.currentAccount.Name', 'Create New Account: ' + cmp.get('v.currentLead.Company'));
        });
        
        // Enqueue action to run
		$A.enqueueAction(action);
	},
    
    queryInputData : function(element, component, resultAreaQuery, objectSelected, checkUserActive) {
        var inputValue = element.value;
        // Get DOM result area to append new child results
        var resultArea = document.querySelector(resultAreaQuery);
        console.log('inputValue:' + inputValue);
        if(inputValue === '' || inputValue === null) {
          this.switchInputSearchState(element);
    
          // Remove all current search results
          this.removeChildNodes(resultArea);
          resultArea.style.display = 'none';
          return;
        }
    
        var action = component.get('c.getInputQueryData');
    
        action.setParams({
          'objectName': objectSelected,
          'queryData': inputValue,
          'checkUserActive' : checkUserActive
        });
    
        action.setCallback(this, function(response) {
            console.log('action.setCallback start');
          this.switchInputSearchState(element);
    		
          var returnValue = response.getReturnValue();
          var state = response.getState();
            console.log('returnValue:' + returnValue);
            console.log('state:' + state);
          // If the response is not successful do not continue
          if(state !== 'SUCCESS' || returnValue === null) {
    		console.log('state: failed');
            this.displayError(response.error, component);
            return;
          }
    	
          // Show the result area
          resultArea.style.display = '';
    
          // Remove all current search results
          this.removeChildNodes(resultArea);
    
          var resultLength = returnValue.length;
          
          console.log('resultLength:' + resultLength);
          if(resultLength < 1) {
            var noResults = document.createElement('div');
            noResults.className = 'no-result animated fadeInDown';
            noResults.innerHTML = 'No results found.';
            noResults.id = 'invalid';
    
            resultArea.appendChild(noResults);
            return;
          }
    
          for(var i = 0; i < resultLength; i++) {
            var currentResult = returnValue[i];
    
    
            var newResult = document.createElement('div');
            newResult.className = 'result animated fadeInDown';
            newResult.innerHTML = currentResult.Name;
            newResult.id = currentResult.Id;
    
            resultArea.appendChild(newResult);
          }
        });
    
        // Enqueue action to run
        $A.enqueueAction(action);
	},
    
    switchInputSearchState : function(element) {
        if(element.className.indexOf(' search') > -1) {
          element.className = this.removeClassName(element.className, ' search');
          element.className += ' input-loading';
          return;
        }
        element.className = this.removeClassName(element.className, ' input-loading');
        element.className += ' search';
    },
    
    initiateUserQuery : function(element, component) {
        console.log('initiateUserQuery start');
    	this.queryInputData(element, component, '.user-input-results', 'User', true);
	},
    
    initiateAccountQuery : function(element, component) {
        console.log('initiateAccountQuery start');
    	this.queryInputData(element, component, '.account-input-results', 'Account', true);
	},
    removeClassName : function(className, classToRemove) {
    	if(className.indexOf(classToRemove) < 0) {
      		return className;
    	}
    	return className.replace(classToRemove, '');
  	},
    
    removeChildNodes : function(parentNode) {
    	while(parentNode.firstChild) {
      		parentNode.removeChild(parentNode.firstChild);
    	}
  	},
    
    convertLead : function(component){
        var convertInExistingAcc = document.querySelector('#useExistingAccount').checked;
        console.log('convertInExistingAcc:' +convertInExistingAcc);
        var leadId = component.get('v.currentLead.Id');
        var currentLead = component.get('v.currentLead');
        var action;
        console.log('leadId:' + leadId);
        if(convertInExistingAcc){
            var accountId = document.querySelector('.account-assign input').id;
            console.log('accountId:' + accountId);
            action = component.get('c.convertLeadWithExistingAcc');
        }else{
            action = component.get('c.convertLeadWithNewAcc');
            action.setParams({
          		'currentLead': currentLead,
                'convertParams': JSON.stringify(component.get('v.convertParams'))
        	});
            console.log('action start');
            action.setCallback(this, function(response) {
                var returnValue = response.getReturnValue();
                console.log('returnValue:' + returnValue);
            });
        }
        console.log('action end');
        // Enqueue action to run
		$A.enqueueAction(action);
    },
})