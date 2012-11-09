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
 * bullsfirst/views/HomePage
 *
 * @author Kanakaraj Venkataswamy
 */
define(['bullsfirst/domain/Credentials',
        'bullsfirst/framework/Page',
        'bullsfirst/services/UserService'],
       function(Credentials, Page, UserService) {
    return Page.extend({
        el: '#open-account-page',

        events: {
			'click #open-account-button': 'openAccount'
        },

        initialize: function() {

        },

        openAccount: function(event) {
			if ($('#open-account-form').validationEngine('validate')) {
				alert('valid');
            }
            return false;
        }
    });
});