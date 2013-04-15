/**
 * Copyright 2013 Archfirst
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
 * app/pages/accounts/AccountsTab
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/domain/Repository',
        'app/widgets/account-chart/AccountChartWidget',
        'app/widgets/account-table/AccountTableWidget',
        'app/widgets/add-account/AddAccountDialog',
        'keel/BaseView',
        'text!app/pages/accounts/AccountsTabTemplate.html'
    ],
    function(Repository, AccountChartWidget, AccountTableWidget, AddAccountDialog, BaseView, AccountsTabTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            className: 'accounts-tab tab clearfix',

            template: {
                name: 'AccountsTabTemplate',
                source: AccountsTabTemplate
            },

            events: {
                'click .js-addAccountButton': 'addAccount',
                'click .js-refreshButton': 'refreshAccounts'
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'AccountTableWidget',
                        viewClass: AccountTableWidget,
                        parentElement: this.$el
                    },
                    {
                        id: 'AccountChartWidget',
                        viewClass: AccountChartWidget,
                        parentElement: this.$el,
                        options: {
                            collection: Repository.getBrokerageAccounts()
                        }
                    }
                ]);
            },

            addAccount: function() {
                this.addChild({
                    id: 'AddAccountDialog',
                    viewClass: AddAccountDialog,
                    parentElement: this.$el
                });

                return false;
            },

            refreshAccounts: function() {
                Repository.updateAccounts();
                return false;
            }
        });
    }
);