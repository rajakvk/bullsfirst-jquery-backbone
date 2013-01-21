/**
 * Copyright 2012 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * bullsfirst/views/OpenAccount
 *
 * @author Kanakaraj Venkataswamy
 */
define(['bullsfirst/services/AccountService',
		'bullsfirst/services/BrokerageAccountService',
		'bullsfirst/domain/Credentials',
        'bullsfirst/domain/ExternalAccount',
        'bullsfirst/domain/ExternalAccounts',
        'bullsfirst/framework/MessageBus',
        'bullsfirst/framework/Page',
		'bullsfirst/framework/ErrorUtil',
		'bullsfirst/domain/User',
		'bullsfirst/domain/UserContext',
        'bullsfirst/services/UserService'],
       function(AccountService, BrokerageAccountService, Credentials, ExternalAccount, ExternalAccounts, MessageBus, Page, ErrorUtil, User, UserContext, UserService) {
    return Page.extend({
		
		brokerageAccountId: 0,
		 
        externalAccountId : 0,
        
		el: '#open-account-page',

        events: {
			'click #open-account-button': 'handleOpenAccountButton',
			'click #oa-cancel-button': 'handleCloseButton'
        },

        initialize: function() {
			$('#open-account-form').validationEngine();
        },

        handleOpenAccountButton: function(event) {
			if ($('#open-account-form').validationEngine('validate')) {
				this.createUser();
            }
            return false;
        },
		
		createUserDone: function(data, textStatus, jqXHR){
			// Add user to UserContext
			UserContext.initUser(this.form2User());
			UserContext.initCredentials(this.form2Credentials());
			
			// Create brokerage account
			BrokerageAccountService.createBrokerageAccount(
				'Brokerage Account 1', _.bind(this.createBrokerageAccountDone, this), ErrorUtil.showError);
		},
		
		createBrokerageAccountDone: function(data, textStatus, jqXHR){
			this.brokerageAccountId = data.id;
			
			// Create external account
			var externalAccount = new ExternalAccount({
				name: 'External Account 1', routingNumber: '022000248', accountNumber: '12345678'
			});
			UserContext.getExternalAccounts().add(externalAccount);
			externalAccount.save(null, {
				success: _.bind(this.createExternalAccountDone, this),
				error: ErrorUtil.showBackboneError
			});
		},
		
		createExternalAccountDone: function(model, jqXHR){
			this.externalAccountId = model.id;
			
			// Transfer cash
			AccountService.transferCash(
				this.externalAccountId,
				{ amount: {amount: 100000, currency: 'USD'}, toAccountId: this.brokerageAccountId },
				_.bind(this.transferCashDone, this),
				ErrorUtil.showError
			);
		},
		
		transferCashDone: function(data, textStatus, jqXHR){
			// TODO: Erase the form
			MessageBus.trigger('UserLoggedInEvent');
		},
		
		handleCloseButton: function(){
			$('#open-account-form').validationEngine('hide');
		},
		
		createUser: function(){
			UserService.createUser(
					this.form2CreateUserRequest(), _.bind(this.createUserDone, this), ErrorUtil.showError);
		},
		
		// ------------------------------------------------------------
        // Helper functions
        // ------------------------------------------------------------
        // Creates a CreateUserRequest from the Open Account form
		form2CreateUserRequest: function(){
			var formObject = $('#open-account-form').toObject();
            delete formObject['confirmPassword']; // property not expected by REST service
            return formObject;
		},
		
		// Creates a User from the Open Account form
		form2User: function(){
			var formObject = $('#open-account-form').toObject();
			delete formObject.password;
			delete formObject['confirmPassword'];
			return formObject;
		},
		
		// Creates Credentials from the Open Account form
		form2Credentials: function(){
			return new Credentials(
				$('#oa-username').val(),
				$('#oa-password').val()
			);
		}
		
    });
});