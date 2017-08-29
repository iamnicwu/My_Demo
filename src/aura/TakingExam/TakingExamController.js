({
	doInit : function(component, event, helper) {
		helper.getRelatedData(component);
        document.querySelector('html').addEventListener("click", function(event) {
            var clickTarget = event.target;
            if(clickTarget.className.indexOf('slds-input') > -1) {
        		event.stopPropagation();
        		return;
      		}
            var userResults = document.querySelector('.user-input-results');
            userResults.style.display = 'none';
            var searchResults = document.querySelector('.account-input-results');
            searchResults.style.display = 'none';
        });
	},
    
    userInputSearch : function(component, event, helper) {
        var timer = component.get('v.userTimer');
        clearTimeout(timer);
        if(event.target.className.indexOf(' search') > -1) {
         	helper.switchInputSearchState(event.target);
        }
    	
        timer = setTimeout(
      		$A.getCallback(function() {
        	helper.initiateUserQuery(event.target, component);
      	}), 500);
    
        component.set('v.userTimer', timer);
	},
    
    userSelected : function(component, event, helper) {
        var target = event.target;
        
        if(target.className.indexOf('no-result') > -1) {
          return;
        }
        component.set('v.currentLead.Owner.Name', target.innerHTML);
        component.set('v.currentLead.OwnerId', target.id);
        var userSearchResult = document.querySelector('.user-input-results');
        userSearchResult.style.display = 'none';
  	},
    checkUseExistingAccount : function(component, event, helper) {
        var checked = event.target.checked;
        var searchAccount = document.querySelector('.account-assign input');
        if(checked){
            component.set('v.currentAccount.Name', '');
        }else{
            component.set('v.currentAccount.Name', 'Create New Account: ' + component.get('v.currentLead.Company'));
        }
    },
    
    accountInputSearch : function(component, event, helper) {
        var timer = component.get('v.userTimer');
        clearTimeout(timer);
        if(event.target.className.indexOf(' search') > -1) {
         	console.log('call switchInputSearchState');
         	helper.switchInputSearchState(event.target);
        }
    	
        timer = setTimeout(
      		$A.getCallback(function() {
        	helper.initiateAccountQuery(event.target, component);
      	}), 500);
    
        component.set('v.userTimer', timer);
    },
    
    accountSelected : function(component, event, helper) {
        var target = event.target;
        
        if(target.className.indexOf('no-result') > -1) {
          return;
        }
        component.set('v.currentAccount.Name', target.innerHTML);
        component.set('v.currentAccount.Id', target.id);
        var userSearchResult = document.querySelector('.account-input-results');
        userSearchResult.style.display = 'none';
  	},
    checkSendOwnerEmail : function(component, event, helper) {
        var target = event.target;
        component.set('v.convertParams.sendOwnerEmail', target.checked);
    },
    
    convertLead : function(component, event, helper) {
        helper.convertLead(component);
    },
    
    closeAccountModal : function(component, event, helper) {
        component.set('v.isOpenAccountModal',false);
    },
    
    openAccountModal : function(component, event, helper) {
        component.set('v.isOpenAccountModal',true);
    },
    
    closeLocationModal : function(component, event, helper) {
        component.set('v.isOpenLocationModal',false);
    },
    
    openLocationModal : function(component, event, helper) {
        component.set('v.isOpenLocationModal',true);
    },
    
    closeContactModal : function(component, event, helper) {
        component.set('v.isOpenContactModal',false);
    },
    
    openContactModal : function(component, event, helper) {
        component.set('v.isOpenContactModal',true);
    },
    
    
})