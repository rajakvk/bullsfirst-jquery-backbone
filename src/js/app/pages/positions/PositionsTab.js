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
 * app/pages/positions/PositionsTab
 *
 * @author Naresh Bhatia
 */
define(
    [
        'framework/BaseView',
        'app/domain/Repository',
        'app/widgets/position-table/PositionTableWidget',
        'text!app/pages/positions/PositionsTabTemplate.html'
    ],
    function(BaseView, Repository, PositionTableWidget, PositionsTabTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            className: 'positions-tab tab clearfix',

            template: {
                name: 'PositionsTabTemplate',
                source: PositionsTabTemplate
            },

            events: {
                'click .js-refresh-button': 'refreshAccounts'
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'PositionTableWidget',
                        viewClass: PositionTableWidget,
                        parentElement: this.$el
                    }
                ]);
            },

            refreshAccounts: function() {
                Repository.updateAccounts();
                return false;
            }
        });
    }
);