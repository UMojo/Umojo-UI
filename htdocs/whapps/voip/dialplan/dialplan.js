winkstart.module('dialplan',
   {
      css: [
      ],

      templates: {
      },

      subscribe: {
         'dialplan.popup' : 'popup'
      }
   },
   function (args) {
      // initialization is here...
   },
   {
      popup: function (args) {
         alert('this is the popup');
         var action = args.actionName,
             data = {
                module: "dialplan",
                data: {
                   action: action,
                   data: { }
                }
             };
         if (this.action) this[action](data);
         args.data = data;
         console.log('dialplan populated: '+action);
      },

      tone: function (data) {
         data.data.Tones = [
            {
               Frequencies: [533, 633],
               'Duration-ON': 500,
               'Duration-OFF': 200,
               Volume: 50,
               Repeat: 3
            }
         ]
      }
   }
);
