/*! jquery.pagevisibility v0.1.0 | (c) 2013 Daniel Herman | opensource.org/licenses/MIT */
(function( $ ) {
    "use strict";
    
    var prefix, prefixes, polyfillHidden, visibilityState, supportsVisibilityApi, hiddenProperty, defineProp, document;
    
    document = window.document;
    defineProp = Object.defineProperty || $.noop;
    supportsVisibilityApi = false;
    prefixes = [ "", "moz", "ms", "webkit" ];
        
    while( prefixes.length ) {
        prefix = prefixes.pop();
        hiddenProperty = prefix ? prefix + "Hidden" : "hidden";
        
        if ( hiddenProperty in document ) {
            supportsVisibilityApi = true;
            break;
        }
    }
    
    if ( !supportsVisibilityApi ) {
        // Add a good enough unprefixed polyfill for browsers that don't support the visibility API
        polyfillHidden = false;
        visibilityState = "visible";

        defineProp( document, "hidden", {
            get: function() {
                return polyfillHidden;
            }
        });
        
        defineProp( document, "visibilityState", {
            get: function() {
                return visibilityState;
            }
        });
        
        // Set the property for browsers that don't support Object.defineProperty
        document.visibilityState = "visible";
        document.hidden = polyfillHidden;
        
        $( window ).bind( "focus blur", function( e ) {
            var shouldBeHidden = e.type === "blur";
            
            if ( polyfillHidden !== shouldBeHidden ) {
                
                // In browsers that support Object.defineProperty,
                // setting the two properties on document is essentially a no-op.
                // In other older browsers, this is how we'll keep the properties in sync,
                // although it's more prone to tampering than with Object.defineProperty.
                document.hidden = polyfillHidden = shouldBeHidden;
                document.visibilityState = visibilityState = shouldBeHidden ? "hidden" : "visible";
                
                $( document ).trigger( "visibilitychange" );
            }
        });
    }
    else if ( prefix ) {
        // If we're dealing with a prefixed version of the API, then
        // normalize it so that we can use the same API across browsers.
        $.event.special.visibilitychange = {
            bindType: prefix + "visibilitychange"
        };
        
        defineProp( document, "hidden", {
            get: function() {
                return document[ hiddenProperty ];
            }
        });
        
        defineProp( document, "visibilityState", {
            get: function() {
                return document[ prefix + "VisibilityState" ];
            }
        });
    }
}( jQuery ));