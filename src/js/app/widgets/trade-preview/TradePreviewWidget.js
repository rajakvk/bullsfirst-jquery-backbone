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
 * app/widgets/trade/TradeSummaryWidget
 *
 * This is the trade widget for the user page.
 *
 * @author Alasdair Swan
 */
define(
    [
        'app/domain/Repository',
        'app/framework/ErrorUtil',
        'app/framework/Message',
        'app/framework/ModalView',
        'app/services/OrderService',
        'keel/MessageBus',
        'text!app/widgets/trade-preview/TradePreviewTemplate.html',
        'underscore'
    ],
    function(Repository, ErrorUtil, Message, ModalView, OrderService, MessageBus, TradePreviewTemplate, _) {
        'use strict';

        return ModalView.extend({
            id: 'trade-summary',
            className: 'modal theme-b',

            template: {
                name: 'TradePreviewTemplate',
                source: TradePreviewTemplate
            },

            events: {
                'click .close-button': 'close',
                'click .trade-edit-order': 'close',
                'click .trade-submit-order': 'submitOrder'
            },

            initialize: function() {

                this.model.set('brokerageAccountName', Repository.getBrokerageAccount(this.model.get('brokerageAccountId')).get('name'));

                this.settings = {
                    overlayVisible: true,
                    centerInWindow: true
                };

                return this;

            },

            submitOrder: function(){

                var attr = this.model.attributes,
                    orderRequest = {
                        brokerageAccountId: attr.brokerageAccountId,
                        orderParams: attr.orderParams
                    };

                // Create brokerage account
                OrderService.createOrder( orderRequest, _.bind(this.orderComplete, this), ErrorUtil.showError);
            },

            orderComplete: function() {
                // Show the order
                MessageBus.trigger('UpdateOrders');
                MessageBus.trigger('UserTabSelectionRequest', 'orders');

                this.close();
            }

        });
    }
);