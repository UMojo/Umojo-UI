        /*input_css:function(){
            $('input[type="text"]').addClass("idleField");
            $('input[type="text"]').focus(function() {
                $(this).removeClass("idleField").addClass("focusField");
                if (this.value == this.defaultValue){
                    this.value = '';
                }
                if(this.value != this.defaultValue){
                    this.select();
                }
            });
            $('input[type="text"]').blur(function() {
                $(this).removeClass("focusField").addClass("idleField");
                if ($.trim(this.value) == ''){
                    this.value = (this.defaultValue ? this.defaultValue : '');
                }
            });

        },*/

        /* WHAT IS THIS? */

        /*
    // for the filter
    (function ($) {
        // custom css expression for a case-insensitive contains()
        jQuery.expr[':'].Contains = function(a,i,m){
            return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
        };




    }(jQuery));

     */

        /*    loadAccount: function(account_id, callback) {
        winkstart.getJSON('sipservice.get', {account_id : account_id}, function(data) {
            winkstart.log(data.data);
            callback(data.data);
        });

        return true;
    },

    update_account: function() {
        var THIS = this;

        winkstart.postJSON('sipservice.update', {account_id : THIS.account.id, data : THIS.account}, function(data) {
            winkstart.log(data);
            THIS.account = data.data;
            THIS.refresh_screen();
        });
    },*/


