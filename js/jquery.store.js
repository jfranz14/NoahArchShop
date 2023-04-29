$.noConflict();
(function( jQuery ) {
	jQuery.Shop = function( element ) {
		this.jQueryelement = jQuery ( element );
		this.init();
	};
	
	jQuery.Shop.prototype = {
		init: function() {
		
		
			this.cartPrefix = "Furniture-"; 
			this.cartName = this.cartPrefix + "cart"; 
			this.shippingRates = this.cartPrefix + "shipping-rates"; 
			this.total = this.cartPrefix + "total"; 
			this.storage = sessionStorage; 
			
			
			this.jQueryformAddToCart = this.jQueryelement.find( "form.add-to-cart" ); 
			this.jQueryformCart = this.jQueryelement.find( "#shopping-cart" );
			this.jQuerycheckoutCart = this.jQueryelement.find( "#checkout-cart" ); 
			this.jQuerycheckoutOrderForm = this.jQueryelement.find( "#checkout-order-form" ); 
			this.jQueryshipping = this.jQueryelement.find( "#sshipping" );
			this.jQuerysubTotal = this.jQueryelement.find( "#stotal" ); 
			this.jQueryshoppingCartActions = this.jQueryelement.find( "#shopping-cart-actions" ); 
			this.jQueryupdateCartBtn = this.jQueryshoppingCartActions.find( "#update-cart" );
			this.jQueryemptyCartBtn = this.jQueryshoppingCartActions.find( "#empty-cart" ); 
			this.jQueryuserDetails = this.jQueryelement.find( "#user-details-content" ); 
			this.jQuerygcashForm = this.jQueryelement.find( "#gcash-form" ); 
			
			
			this.currency = "&#8369;"; 
			this.currencyString = "&#	8369;"; 
			this.gcashCurrency = "PHP"; 
			this.gcashBusinessEmail = "joelfranza@ymail.com"; 
			this.gcashURL = "https://i.imgur.com/pecuHhA.jpg"; 

			this.requiredFields = {
				expression: {
					value: /^([\w-\.]+)@((?:[\w]+\.)+)([a-z]){2,4}jQuery/
				},
				
				str: {
					value: ""
				}
				
			};
			
			
			
			this.createCart();
			this.handleAddToCartForm();
			this.handleCheckoutOrderForm();
			this.emptyCart();
			this.updateCart();
			this.displayCart();
			this.deleteProduct();
			this.displayUserDetails();
			this.populatePayPalForm();
			
			
		},
		
	
		
		createCart: function() {
			if( this.storage.getItem( this.cartName ) == null ) {
			
				var cart = {};
				cart.items = [];
			
				this.storage.setItem( this.cartName, this._toJSONString( cart ) );
				this.storage.setItem( this.shippingRates, "0" );
				this.storage.setItem( this.total, "0" );
			}
		},
		
		
		populatePayPalForm: function() {
			var self = this;
			if( self.jQuerygcashForm.length ) {
				var jQueryform = self.jQuerygcashForm;
				var cart = self._toJSONObject( self.storage.getItem( self.cartName ) );
				var shipping = self.storage.getItem( self.shippingRates );
				var numShipping = self._convertString( shipping );
				var cartItems = cart.items; 
				var singShipping = Math.floor( numShipping / cartItems.length );
				
				jQueryform.attr( "action", self.gcashURL );
				jQueryform.find( "input[name='business']" ).val( self.gcashBusinessEmail );
				jQueryform.find( "input[name='currency_code']" ).val( self.gcashCurrency );
				
				for( var i = 0; i < cartItems.length; ++i ) {
					var cartItem = cartItems[i];
					var n = i + 1;
					var name = cartItem.product;
					var price = cartItem.price;
					var qty = cartItem.qty;
					
					jQuery( "<div/>" ).html( "<input type='hidden' name='quantity_" + n + "' value='" + qty + "'/>" ).
					insertBefore( "#gcash-btn" );
					jQuery( "<div/>" ).html( "<input type='hidden' name='item_name_" + n + "' value='" + name + "'/>" ).
					insertBefore( "#gcash-btn" );
					jQuery( "<div/>" ).html( "<input type='hidden' name='item_number_" + n + "' value='SKU " + name + "'/>" ).
					insertBefore( "#gcash-btn" );
					jQuery( "<div/>" ).html( "<input type='hidden' name='amount_" + n + "' value='" + self._formatNumber( price, 2 ) + "'/>" ).
					insertBefore( "#gcash-btn" );
					jQuery( "<div/>" ).html( "<input type='hidden' name='shipping_" + n + "' value='" + self._formatNumber( singShipping, 2 ) + "'/>" ).
					insertBefore( "#gcash-btn" );
					
				}
				
				
				
			}
		},
		
		
		displayUserDetails: function() {
			if( this.jQueryuserDetails.length ) {
				if( this.storage.getItem( "shipping-name" ) == null ) {
					var name = this.storage.getItem( "billing-name" );
					var email = this.storage.getItem( "billing-email" );
					var city = this.storage.getItem( "billing-city" );
					var address = this.storage.getItem( "billing-address" );
					var zip = this.storage.getItem( "billing-zip" );
					
					var html = "<div class='detail'>";
						html += "<ul>";
						html += "<li>" + name + "</li>";
						html += "<li>" + email + "</li>";
						html += "<li>" + city + "</li>";
						html += "<li>" + address + "</li>";
						html += "<li>" + zip + "</li>";
						
					this.jQueryuserDetails[0].innerHTML = html;
				} else {
					var name = this.storage.getItem( "billing-name" );
					var email = this.storage.getItem( "billing-email" );
					var city = this.storage.getItem( "billing-city" );
					var address = this.storage.getItem( "billing-address" );
					var zip = this.storage.getItem( "billing-zip" );
					
					var sName = this.storage.getItem( "shipping-name" );
					var sEmail = this.storage.getItem( "shipping-email" );
					var sCity = this.storage.getItem( "shipping-city" );
					var sAddress = this.storage.getItem( "shipping-address" );
					var sZip = this.storage.getItem( "shipping-zip" );
					
					var html = "<div class='detail'>";
						html += "<h2>Billing</h2>";
						html += "<ul>";
						html += "<li>" + name + "</li>";
						html += "<li>" + email + "</li>";
						html += "<li>" + city + "</li>";
						html += "<li>" + address + "</li>";
						html += "<li>" + zip + "</li>";
						html += "</ul></div>";
						
						html += "<div class='detail right'>";
						html += "<h2>Shipping</h2>";
						html += "<ul>";
						html += "<li>" + sName + "</li>";
						html += "<li>" + sEmail + "</li>";
						html += "<li>" + sCity + "</li>";
						html += "<li>" + sAddress + "</li>";
						html += "<li>" + sZip + "</li>";
						html += "</ul></div>";
						
					this.jQueryuserDetails[0].innerHTML = html;	
				
				}
			}
		},



		deleteProduct: function() {
			var self = this;
			if( self.jQueryformCart.length ) {
				var cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
				var items = cart.items;

				jQuery( document ).on( "click", ".pdelete a", function( e ) {
					e.preventDefault();
					var productName = jQuery( this ).data( "product" );
					var newItems = [];
					for( var i = 0; i < items.length; ++i ) {
						var item = items[i];
						var product = item.product;	
						if( product == productName ) {
							items.splice( i, 1 );
						}
					}
					newItems = items;
					var updatedCart = {};
					updatedCart.items = newItems;

					var updatedTotal = 0;
					var totalQty = 0;
					if( newItems.length == 0 ) {
						updatedTotal = 0;
						totalQty = 0;
					} else {
						for( var j = 0; j < newItems.length; ++j ) {
							var prod = newItems[j];
							var sub = prod.price * prod.qty;
							updatedTotal += sub;
							totalQty += prod.qty;
						}
					}

					self.storage.setItem( self.total, self._convertNumber( updatedTotal ) );
					self.storage.setItem( self.shippingRates, self._convertNumber( self._calculateShipping( totalQty ) ) );

					self.storage.setItem( self.cartName, self._toJSONString( updatedCart ) );
					jQuery( this ).parents( "tr" ).remove();
					self.jQuerysubTotal[0].innerHTML = self.currency + " " + self.storage.getItem( self.total );
				});
			}
		},
		
		
		displayCart: function() {
			if( this.jQueryformCart.length ) {
				var cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
				var items = cart.items;
				var jQuerytableCart = this.jQueryformCart.find( ".shopping-cart" );
				var jQuerytableCartBody = jQuerytableCart.find( "tbody" );

				if( items.length == 0 ) {
					jQuerytableCartBody.html( "" );	
				} else {
				
				
					for( var i = 0; i < items.length; ++i ) {
						var item = items[i];
						var product = item.product;
						var price = this.currency + " " + item.price;
						var qty = item.qty;
						var html = "<tr><td class='pname'>" + product + "</td>" + "<td class='pqty'><input type='text' value='" + qty + "' class='qty'/></td>";
					    	html += "<td class='pprice'>" + price + "</td><td class='pdelete'><a href='' data-product='" + product + "'>&times;</a></td></tr>";
					
							jQuerytableCartBody.html( jQuerytableCartBody.html() + html );
					}

				}

				if( items.length == 0 ) {
					this.jQuerysubTotal[0].innerHTML = this.currency + " " + 0.00;
				} else {	
				
					var total = this.storage.getItem( this.total );
					this.jQuerysubTotal[0].innerHTML = this.currency + " " + total;
				}
			} else if( this.jQuerycheckoutCart.length ) {
				var checkoutCart = this._toJSONObject( this.storage.getItem( this.cartName ) );
				var cartItems = checkoutCart.items;
				var jQuerycartBody = this.jQuerycheckoutCart.find( "tbody" );

				if( cartItems.length > 0 ) {
				
					for( var j = 0; j < cartItems.length; ++j ) {
						var cartItem = cartItems[j];
						var cartProduct = cartItem.product;
						var cartPrice = this.currency + " " + cartItem.price;
						var cartQty = cartItem.qty;
						var cartHTML = "<tr><td class='pname'>" + cartProduct + "</td>" + "<td class='pqty'>" + cartQty + "</td>" + "<td class='pprice'>" + cartPrice + "</td></tr>";
					
						jQuerycartBody.html( jQuerycartBody.html() + cartHTML );
					}
				} else {
					jQuerycartBody.html( "" );	
				}

				if( cartItems.length > 0 ) {
				
					var cartTotal = this.storage.getItem( this.total );
					var cartShipping = this.storage.getItem( this.shippingRates );
					var subTot = this._convertString( cartTotal ) + this._convertString( cartShipping );
				
					this.jQuerysubTotal[0].innerHTML = this.currency + " " + this._convertNumber( subTot );
					this.jQueryshipping[0].innerHTML = this.currency + " " + cartShipping;
				} else {
					this.jQuerysubTotal[0].innerHTML = this.currency + " " + 0.00;
					this.jQueryshipping[0].innerHTML = this.currency + " " + 0.00;	
				}
			
			}
		},
		

		
		emptyCart: function() {
			var self = this;
			if( self.jQueryemptyCartBtn.length ) {
				self.jQueryemptyCartBtn.on( "click", function() {
					self._emptyCart();
				});
			}
		},
		
		
		updateCart: function() {
			var self = this;
		  if( self.jQueryupdateCartBtn.length ) {
			self.jQueryupdateCartBtn.on( "click", function() {
				var jQueryrows = self.jQueryformCart.find( "tbody tr" );
				var cart = self.storage.getItem( self.cartName );
				var shippingRates = self.storage.getItem( self.shippingRates );
				var total = self.storage.getItem( self.total );
				
				var updatedTotal = 0;
				var totalQty = 0;
				var updatedCart = {};
				updatedCart.items = [];
				
				jQueryrows.each(function() {
					var jQueryrow = jQuery( this );
					var pname = jQuery.trim( jQueryrow.find( ".pname" ).text() );
					var pqty = self._convertString( jQueryrow.find( ".pqty > .qty" ).val() );
					var pprice = self._convertString( self._extractPrice( jQueryrow.find( ".pprice" ) ) );
					
					var cartObj = {
						product: pname,
						price: pprice,
						qty: pqty
					};
					
					updatedCart.items.push( cartObj );
					
					var subTotal = pqty * pprice;
					updatedTotal += subTotal;
					totalQty += pqty;
				});
				
				self.storage.setItem( self.total, self._convertNumber( updatedTotal ) );
				self.storage.setItem( self.shippingRates, self._convertNumber( self._calculateShipping( totalQty ) ) );
				self.storage.setItem( self.cartName, self._toJSONString( updatedCart ) );
				
			});
		  }
		},
		
		
		handleAddToCartForm: function() {
			var self = this;
			self.jQueryformAddToCart.each(function() {
				var jQueryform = jQuery( this );
				var jQueryproduct = jQueryform.parent();
				var price = self._convertString( jQueryproduct.data( "price" ) );
				var name =  jQueryproduct.data( "name" );
				
				jQueryform.on( "submit", function() {
					var qty = self._convertString( jQueryform.find( ".qty" ).val() );
					var subTotal = qty * price;
					var total = self._convertString( self.storage.getItem( self.total ) );
					var sTotal = total + subTotal;
					self.storage.setItem( self.total, sTotal );
					self._addToCart({
						product: name,
						price: price,
						qty: qty
					});
					var shipping = self._convertString( self.storage.getItem( self.shippingRates ) );
					var shippingRates = self._calculateShipping( qty );
					var totalShipping = shipping + shippingRates;
					
					self.storage.setItem( self.shippingRates, totalShipping );
				});
			});
		},
		
		
		handleCheckoutOrderForm: function() {
			var self = this;
			if( self.jQuerycheckoutOrderForm.length ) {
				var jQuerysameAsBilling = jQuery( "#same-as-billing" );
				jQuerysameAsBilling.on( "change", function() {
					var jQuerycheck = jQuery( this );
					if( jQuerycheck.prop( "checked" ) ) {
						jQuery( "#fieldset-shipping" ).slideUp( "normal" );
					} else {
						jQuery( "#fieldset-shipping" ).slideDown( "normal" );
					}
				});
				
				self.jQuerycheckoutOrderForm.on( "submit", function() {
					var jQueryform = jQuery( this );
					var valid = self._validateForm( jQueryform );
					
					if( !valid ) {
						return valid;
					} else {
						self._saveFormData( jQueryform );
					}
				});
			}
		},

		_emptyCart: function() {
			this.storage.clear();
		},

		 
		
		_formatNumber: function( num, places ) {
			var n = num.toFixed( places );
			return n;
		},
		
	
		
		_extractPrice: function( element ) {
			var self = this;
			var text = element.text();
			var price = text.replace( self.currencyString, "" ).replace( " ", "" );
			return price;
		},
		
	
		
		_convertString: function( numStr ) {
			var num;
			if( /^[-+]?[0-9]+\.[0-9]+jQuery/.test( numStr ) ) {
				num = parseFloat( numStr );
			} else if( /^\d+jQuery/.test( numStr ) ) {
				num = parseInt( numStr, 10 );
			} else {
				num = Number( numStr );
			}
			
			if( !isNaN( num ) ) {
				return num;
			} else {
				console.warn( numStr + " cannot be converted into a number" );
				return false;
			}
		},
		
		
		
		_convertNumber: function( n ) {
			var str = n.toString();
			return str;
		},
		
	
		
		_toJSONObject: function( str ) {
			var obj = JSON.parse( str );
			return obj;
		},
		
	
		
		
		_toJSONString: function( obj ) {
			var str = JSON.stringify( obj );
			return str;
		},
		
	
	
		_addToCart: function( values ) {
			var cart = this.storage.getItem( this.cartName );
			
			var cartObject = this._toJSONObject( cart );
			var cartCopy = cartObject;
			var items = cartCopy.items;
			items.push( values );
			
			this.storage.setItem( this.cartName, this._toJSONString( cartCopy ) );
		},

		
		_calculateShipping: function( qty ) {
			var shipping = 0;
			if( qty >= 6 ) {
				shipping = 10;
			}
			if( qty >= 12 && qty <= 30 ) {
				shipping = 20;	
			}
			
			if( qty >= 30 && qty <= 60 ) {
				shipping = 30;	
			}
			
			if( qty > 60 ) {
				shipping = 0;
			}
			
			return shipping;
		
		},
		
	
		 
		
		_validateForm: function( form ) {
			var self = this;
			var fields = self.requiredFields;
			var jQueryvisibleSet = form.find( "fieldset:visible" );
			var valid = true;
			
			form.find( ".message" ).remove();
			
		  jQueryvisibleSet.each(function() {
			
			jQuery( this ).find( ":input" ).each(function() {
				var jQueryinput = jQuery( this );
				var type = jQueryinput.data( "type" );
				var msg = jQueryinput.data( "message" );
				
				if( type == "string" ) {
					if( jQueryinput.val() == fields.str.value ) {
						jQuery( "<span class='message'/>" ).text( msg ).
						insertBefore( jQueryinput );
						
						valid = false;
					}
				} else {
					if( !fields.expression.value.test( jQueryinput.val() ) ) {
						jQuery( "<span class='message'/>" ).text( msg ).
						insertBefore( jQueryinput );
						
						valid = false;
					}
				}
				
			});
		  });
			
			return valid;
		
		},
		
	
		
		_saveFormData: function( form ) {
			var self = this;
			var jQueryvisibleSet = form.find( "fieldset:visible" );
			
			jQueryvisibleSet.each(function() {
				var jQueryset = jQuery( this );
				if( jQueryset.is( "#fieldset-billing" ) ) {
					var name = jQuery( "#name", jQueryset ).val();
					var email = jQuery( "#email", jQueryset ).val();
					var city = jQuery( "#city", jQueryset ).val();
					var address = jQuery( "#address", jQueryset ).val();
					var zip = jQuery( "#zip", jQueryset ).val();
					var country = jQuery( "#country", jQueryset ).val();
					
					self.storage.setItem( "billing-name", name );
					self.storage.setItem( "billing-email", email );
					self.storage.setItem( "billing-city", city );
					self.storage.setItem( "billing-address", address );
					self.storage.setItem( "billing-zip", zip );
					self.storage.setItem( "billing-country", country );
				} else {
					var sName = jQuery( "#sname", jQueryset ).val();
					var sEmail = jQuery( "#semail", jQueryset ).val();
					var sCity = jQuery( "#scity", jQueryset ).val();
					var sAddress = jQuery( "#saddress", jQueryset ).val();
					var sZip = jQuery( "#szip", jQueryset ).val();
					var sCountry = jQuery( "#scountry", jQueryset ).val();
					
					self.storage.setItem( "shipping-name", sName );
					self.storage.setItem( "shipping-email", sEmail );
					self.storage.setItem( "shipping-city", sCity );
					self.storage.setItem( "shipping-address", sAddress );
					self.storage.setItem( "shipping-zip", sZip );
					self.storage.setItem( "shipping-country", sCountry );
				
				}
			});
		}
	};
	
	jQuery(function() {
		var shop = new jQuery.Shop( "#site" );
	});

})( jQuery );


