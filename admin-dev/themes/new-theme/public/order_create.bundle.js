window.order_create=function(e){function t(s){if(r[s])return r[s].exports;var a=r[s]={i:s,l:!1,exports:{}};return e[s].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,s){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:s})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=345)}({264:function(e,t,r){"use strict";function s(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var s=t[r];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,r,s){return r&&e(t.prototype,r),s&&e(t,s),t}}(),n=r(67),d=s(n),u=r(346),c=s(u),i=r(349),l=s(i),m=window.$,f=function(){function e(){var t=this;return a(this,e),this.data={},this.$container=m(d.default.orderCreationContainer),this.customerSearcher=new c.default,this.shippingRenderer=new l.default,{listenForCustomerSearch:function(){return t._handleCustomerSearch()},listenForCustomerChooseForOrderCreation:function(){return t._handleCustomerChooseForOrderCreation()}}}return o(e,[{key:"_handleCustomerSearch",value:function(){var e=this;this.$container.on("input",d.default.customerSearchInput,function(){e.customerSearcher.onCustomerSearch()})}},{key:"_handleCustomerChooseForOrderCreation",value:function(){var e=this;this.$container.on("click",d.default.chooseCustomerBtn,function(t){e.data.customer_id=e.customerSearcher.onCustomerChooseForOrderCreation(t),e._loadCartSummaryAfterChoosingCustomer()}),this.$container.on("click",d.default.changeCustomerBtn,function(){return e.customerSearcher.onCustomerChange()}),this.$container.on("change",d.default.addressSelect,function(){return e._changeCartAddresses()}),this.$container.on("click",".js-use-cart-btn",function(){var t=m(event.target).data("cart-id");e._choosePreviousCart(t)})}},{key:"_loadCartSummaryAfterChoosingCustomer",value:function(){var e=this;m.ajax(this.$container.data("last-empty-cart-url"),{method:"POST",data:{id_customer:this.data.customer_id},dataType:"json"}).then(function(t){e.data.cart_id=t.cart.id_cart;var r={carts:void 0!==t.carts?t.carts:[],orders:void 0!==t.orders?t.orders:[]};e._renderCheckoutHistory(r),e._renderCartSummary(t)})}},{key:"_renderCheckoutHistory",value:function(e){this._renderCustomerCarts(e.carts),this._renderCustomerOrders(e.orders),m(d.default.customerCheckoutHistory).removeClass("d-none")}},{key:"_renderCustomerCarts",value:function(e){var t=m(d.default.customerCartsTable),r=m(m(d.default.customerCartsTableRowTemplate).html());if(t.find("tbody").empty(),e){for(var s in e)if(e.hasOwnProperty(s)){var a=e[s],o=r.clone();o.find(".js-cart-id").text(a.id_cart),o.find(".js-cart-date").text(a.date_add),o.find(".js-cart-total").text(a.total_price),o.find(".js-use-cart-btn").data("cart-id",a.id_cart),t.find("tbody").append(o)}m(d.default.customerCheckoutHistory).removeClass("d-none")}}},{key:"_renderCartSummary",value:function(e){this._renderAddressesSelect(e),this._showCartSummary()}},{key:"_renderCustomerOrders",value:function(e){var t=m(d.default.customerOrdersTable),r=m(m(d.default.customerOrdersTableRowTemplate).html());if(t.find("tbody").empty(),e)for(var s in Object.keys(e))if(e.hasOwnProperty(s)){var a=e[s],o=r.clone();o.find(".js-order-id").text(a.id_order),o.find(".js-order-date").text(a.date_add),o.find(".js-order-products").text(a.nb_products),o.find(".js-order-total-paid").text(a.total_paid_real),o.find(".js-order-status").text(a.order_state),t.find("tbody").append(o)}}},{key:"_showCartSummary",value:function(){m(d.default.cartBlock).removeClass("d-none"),m(d.default.vouchersBlock).removeClass("d-none"),m(d.default.addressesBlock).removeClass("d-none")}},{key:"_renderAddressesSelect",value:function(e){var t="",r="",s=m(d.default.deliveryAddressDetails),a=m(d.default.invoiceAddressDetails),o=m(d.default.deliveryAddressSelect),n=m(d.default.invoiceAddressSelect),u=m(d.default.addressesContent),c=m(d.default.addressesWarning);if(s.empty(),a.empty(),o.empty(),n.empty(),0===e.addresses.length)return c.removeClass("d-none"),void u.addClass("d-none");u.removeClass("d-none"),c.addClass("d-none");for(var i in Object.keys(e.addresses))if(e.addresses.hasOwnProperty(i)){var l=e.addresses[i],f={value:l.id_address,text:l.alias},h={value:l.id_address,text:l.alias};parseInt(e.cart.id_address_delivery)===parseInt(l.id_address)&&(t=l.formated_address,f.selected="selected"),parseInt(e.cart.id_address_invoice)===parseInt(l.id_address)&&(r=l.formated_address,h.selected="selected"),o.append(m("<option>",f)),n.append(m("<option>",h))}t&&m(d.default.deliveryAddressDetails).html(t),r&&m(d.default.invoiceAddressDetails).html(r)}},{key:"_changeCartAddresses",value:function(){var e=this;m.ajax(this.$container.data("cart-addresses-url"),{data:{id_customer:this.data.customer_id,id_cart:this.data.cart_id,id_address_delivery:m(d.default.deliveryAddressSelect).val(),id_address_invoice:m(d.default.invoiceAddressSelect).val()},dataType:"json"}).then(function(t){e._persistCartSummaryData(t),e._renderAddressesSelect(t)})}},{key:"_persistCartSummaryData",value:function(e){this.data.cart_id=e.cart.id,this.data.delivery_address_id=e.cart.id_address_delivery,this.data.invoice_address_id=e.cart.id_address_invoice}},{key:"_choosePreviousCart",value:function(e){var t=this;m.ajax(this.$container.data("cart-summary-url"),{method:"POST",data:{id_cart:e,id_customer:this.data.customer_id},dataType:"json"}).then(function(e){t._persistCartSummaryData(e),t._renderCartSummary(e)})}}]),e}();t.default=f},345:function(e,t,r){"use strict";var s=r(264),a=function(e){return e&&e.__esModule?e:{default:e}}(s);/**
                   * 2007-2019 PrestaShop and Contributors
                   *
                   * NOTICE OF LICENSE
                   *
                   * This source file is subject to the Open Software License (OSL 3.0)
                   * that is bundled with this package in the file LICENSE.txt.
                   * It is also available through the world-wide-web at this URL:
                   * https://opensource.org/licenses/OSL-3.0
                   * If you did not receive a copy of the license and are unable to
                   * obtain it through the world-wide-web, please send an email
                   * to license@prestashop.com so we can send you a copy immediately.
                   *
                   * DISCLAIMER
                   *
                   * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
                   * versions in the future. If you wish to customize PrestaShop for your
                   * needs please refer to https://www.prestashop.com for more information.
                   *
                   * @author    PrestaShop SA <contact@prestashop.com>
                   * @copyright 2007-2019 PrestaShop SA and Contributors
                   * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
                   * International Registered Trademark & Property of PrestaShop SA
                   */
(0,window.$)(document).ready(function(){var e=new a.default;e.listenForCustomerSearch(),e.listenForCustomerChooseForOrderCreation()})},346:function(e,t,r){"use strict";function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var s=t[r];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,r,s){return r&&e(t.prototype,r),s&&e(t,s),t}}(),o=r(67),n=function(e){return e&&e.__esModule?e:{default:e}}(o),d=window.$,u=function(){function e(){var t=this;return s(this,e),this.$container=d(n.default.customerSearchBlock),this.$searchInput=d(n.default.customerSearchInput),this.$customerSearchResultBlock=d(n.default.customerSearchResultsBlock),{onCustomerSearch:function(){t._doSearch()},onCustomerChooseForOrderCreation:function(e){return t._chooseCustomerForOrderCreation(e)},onCustomerChange:function(){t._showCustomerSearch()}}}return a(e,[{key:"_chooseCustomerForOrderCreation",value:function(e){var t=d(e.currentTarget),r=t.closest(".card");return t.addClass("d-none"),r.addClass("border-success"),r.find(n.default.changeCustomerBtn).removeClass("d-none"),this.$container.find(n.default.customerSearchRow).addClass("d-none"),this.$container.find(n.default.notSelectedCustomerSearchResults).closest(n.default.customerSearchResultColumn).remove(),t.data("customer-id")}},{key:"_doSearch",value:function(){var e=this,t=this.$searchInput.val();t.length<4||d.ajax(this.$searchInput.data("url"),{method:"GET",data:{customer_search:t}}).then(function(t){if(e._clearShownCustomers(),!t.found)return void e._showNotFoundCustomers();for(var r in t.customers){var s=t.customers[r],a={id:r,first_name:s.firstname,last_name:s.lastname,email:s.email,birthday:"0000-00-00"!==s.birthday?s.birthday:" "};e._showCustomer(a)}})}},{key:"_showCustomer",value:function(e){var t=d(d(n.default.customerSearchResultTemplate).html()),r=t.clone();return r.find(n.default.customerSearchResultName).text(e.first_name+" "+e.last_name),r.find(n.default.customerSearchResultEmail).text(e.email),r.find(n.default.customerSearchResultId).text(e.id),r.find(n.default.customerSearchResultBirthday).text(e.birthday),r.find(n.default.customerDetailsBtn).data("customer-id",e.id),r.find(n.default.chooseCustomerBtn).data("customer-id",e.id),this.$customerSearchResultBlock.append(r)}},{key:"_showNotFoundCustomers",value:function(){var e=d(d("#customerSearchEmptyResultTemplate").html());this.$customerSearchResultBlock.append(e)}},{key:"_clearShownCustomers",value:function(){this.$customerSearchResultBlock.empty()}},{key:"_showCustomerSearch",value:function(){this.$container.find(n.default.customerSearchRow).removeClass("d-none")}}]),e}();t.default=u},349:function(e,t,r){"use strict";function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var s=t[r];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,r,s){return r&&e(t.prototype,r),s&&e(t,s),t}}(),o=r(67),n=function(e){return e&&e.__esModule?e:{default:e}}(o),d=window.$,u=function(){function e(){s(this,e),this.$container=d(n.default.shippingBlock)}return a(e,[{key:"show",value:function(){this.$container.removeClass("d-none")}},{key:"hide",value:function(){this.$container.addClass("d-none")}}]),e}();t.default=u},67:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),/**
 * 2007-2019 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://www.prestashop.com for more information.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2019 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */
t.default={orderCreationContainer:"#orderCreationContainer",customerSearchInput:"#customerSearchInput",customerSearchResultsBlock:".js-customer-search-results",customerSearchResultTemplate:"#customerSearchResultTemplate",changeCustomerBtn:".js-change-customer-btn",customerSearchRow:".js-search-customer-row",chooseCustomerBtn:".js-choose-customer-btn",notSelectedCustomerSearchResults:".js-customer-search-result:not(.border-success)",customerSearchResultName:".js-customer-name",customerSearchResultEmail:".js-customer-email",customerSearchResultId:".js-customer-id",customerSearchResultBirthday:".js-customer-birthday",customerDetailsBtn:".js-details-customer-btn",customerSearchResultColumn:".js-customer-search-result-col",customerSearchBlock:"#customerSearchBlock",customerCartsTable:"#customerCartsTable",customerCartsTableRowTemplate:"#customerCartsTableRowTemplate",customerCheckoutHistory:"#customerCheckoutHistory",customerOrdersTable:"#customerOrdersTable",customerOrdersTableRowTemplate:"#customerOrdersTableRowTemplate",cartBlock:"#cartBlock",vouchersBlock:"#vouchersBlock",addressesBlock:"#addressesBlock",deliveryAddressDetails:"#deliveryAddressDetails",invoiceAddressDetails:"#invoiceAddressDetails",deliveryAddressSelect:"#deliveryAddressSelect",invoiceAddressSelect:"#invoiceAddressSelect",addressSelect:".js-address-select",addressesContent:"#addressesContent",addressesWarning:"#addressesWarning",summaryBlock:"#summaryBlock",shippingBlock:"#shippingBlock"}}});