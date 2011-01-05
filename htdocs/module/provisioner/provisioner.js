winkstart.module('provisioner', {
      css: [
         'css/style.css',
         'css/jquery-ui-1.8.7.custom.css',
         'css/niceforms-default.css',
         'css/jquery.multiSelect.css',
         'css/layout.css',
         'css/selector.css'
      ],

      templates: {
         provisioner: 'provisioner.html',
         selector: 'selector.html',
         categories: 'categories.html',
         sub: 'subcategory.html',
         item: 'item.html'
      },

      elements: {
         selector: '#ws_prov_selector',
         endpoint: '#ws_prov_endpoint'
      },

      requests: {
         'provisioner.get' : { url : 'serverside script that spits json' }
      },

      subscribe: {
         'provisioner.activate' : 'activate'
      }
   },
   function (args) {
      winkstart.publish('nav.add', { module: this.__module, label: 'Provisioner' });
   },
   {
      elements: {
         catList: 'catList',
         settings: 'settings'
      },

      brands: {},

      defSettings: [],
      settings: [],

      curModel: { brand: '', model: '' },

      activate: function (args) {
         args.target.empty();

         var THIS = this;
         this.templates.provisioner.tmpl({}).appendTo( args.target );
         this._loadBrands(function () { THIS._renderSelector(); });
      },


// PUBLIC API
      render: function (css, brand, model) {
         var THIS = this;
         this._loadDefaultSettings(brand, model, function () { THIS._render(); });
      },

      showCategory: function (name) {
         this._selectCategory(name);
      },

      loadSettings: function (uri) {
         // TODO: settings via getJSON
      },

      saveSettings: function (uri) {
         // TODO: post settings property
      },


// INTERNAL API
      // some internal work...

      _renderSelector: function () {
         var THIS = this;

         var select = this.templates.selector.tmpl({ brands: THIS.brands });
         select.find('.brand').hover(
               function () { $(this).find('.models').show(); },
               function () { $(this).find('.models').hide(); }
         );
         select.find('.model').click(function () {
            THIS.render('', $(this).attr('brand'), $(this).attr('model'));
         });
         select.find('.models').hide();

         select.appendTo( $(this.config.elements.selector).empty() );
      },

      _render: function () {
         var target = $(this.config.elements.endpoint).empty();

         var catList = [];
         for (var i in this.settings) catList.push({ name: this.settings[i].name });
         this._renderCategories(catList).appendTo(target);

         this._renderSubLayout().appendTo(target);

         this._selectCategory(catList[0].name);
      },

      _renderSubLayout: function () {
         var subs = $('<div id="content"><div id="'+this.elements.settings+'"></div></div>');

         return subs;
      },

      _selectCategory: function (name) {
         var THIS = this,
             endpoint = $(this.config.elements.endpoint),
             menu = endpoint.find('#'+this.elements.catList),
             settings = endpoint.find('#'+this.elements.settings);

         if (name !== menu.find('li.current').attr('name')) {
            menu.find('li.category').removeClass('current');
            menu.find('li.category[name="'+name+'"]').addClass('current');

            // destroying existing subcategories
            settings.find('.subcategory').each(function () {
               THIS._saveSubcategory();
               $(this).hide(1000);
               $(this).empty().remove();
            });
            // building new ones
            for (var i in this.settings[name].subcategory) this._renderSub(name, i).appendTo(settings);
         }
      },

      _renderSub: function (cat, sub) {
         console.log('rendering '+cat+'.'+sub);
         $.template('item', this.templates.item);
         var subcat = this.templates.sub.tmpl(this.settings[cat].subcategory[sub]);

         //$('#customselector').customSelect();
         // Homegrown convertion to tabs view
         subcat.find(".col_box_tabs").each(function () {
            var tabs = $(this);
            tabs.find('li').click(function () {
               if (!$(this).hasClass('active')) {
                  $(this).addClass('active');
                  tabs.find('li').removeClass('active');
                  tabs.find('div.tab_content').hide();
                  tabs.find($(this).find('a').attr('href')).show();
               }
               return false;
            });
            tabs.find('li').first().click();
         });

         return subcat;
      },

      _renderCategories: function (catList) {
         var THIS = this, 
             cats = $('<div id="'+this.elements.catList+'"></div>').append(this.templates.categories.tmpl({categories: catList}));

         cats.find('li.category').click(function () { THIS._selectCategory($(this).attr('name')); });
         return cats;
      },


      // Data layer work...

      // adding settings to current settings configuration (parsing json)
      _settingsMergeIn: function (json) {
         // xml category hack
         if (!$.isArray(json.category)) json.category = [json.category];
         for (var i in json.category) {
            var cat = json.category[i];
            if (!this.settings[cat.name]) this.settings[cat.name] = { name: cat.name, subcategory: [] };

            // xml subcategory hack
            if (!$.isArray(cat.subcategory)) cat.subcategory = [cat.subcategory];
            for (var j in cat.subcategory) {
               var sub = cat.subcategory[j];
               if (!this.settings[cat.name].subcategory[sub.name]) this.settings[cat.name].subcategory[sub.name] = { name: sub.name, item: new Array() };

               // xml item hack
               if (!$.isArray(sub.item)) sub.item = [sub.item];
               for (var k in sub.item) {
                  var item = sub.item[k];
                  this.settings[cat.name].subcategory[sub.name].item.push(this._parseItem(item));
               }
            }
         }
      },

      _parseItem: function (item) {
//         $('body').append($('<pre>'+display(item)+'</pre>'));
         if (item.type === 'loop_line_options' ||
             item.type === 'loop') {
            var tabs = { type: 'tabs', data: new Array() }
            tabs.description = item.description;

            var lines = this.brands[this.curModel.brand].models[this.curModel.model].lines;

            var start = item.type === 'loop' ? item.loop_start : 1;
            var end = item.type === 'loop' ? item.loop_end : lines;
            for (var i = start; i <= end; i++) {
               var tab = { item: new Array() }
               tab.description = item.type === 'loop_line_options' ? 'Line '+i : item.description+': '+i;
               for (var j in item.data.item) {
                  tab.item.push(item.data.item[j]);
               }
               tabs.data.push(tab);
            }
            tabs.data[end-1].last = 'last';
            return tabs;
         }
         return item;
      },









// FILE MANIPULATION

      _loadBrands: function (callback) {
         var THIS = this;
         this.brands = {};
         $.getJSON('endpoint/master.json', function (json) {
            for (var i in json.brands) {
               var brand = { name: json.brands[i].name, directory: json.brands[i].directory, models: {} }
               THIS.brands[brand.name] = brand;
               THIS._loadBrandData(brand, callback);
            }
            callback();
         });
      },

      _loadBrandData: function (brand, callback) {
         $.getJSON('endpoint/'+brand.directory+'/brand_data.json', function (json) {
            var families = json.brands.family_list.family;
            if (!$.isArray(families)) families = [families];
            for (var i in families) {
               var family = families[i];
               $.getJSON('endpoint/'+brand.directory+'/'+family.directory+'/family_data.json',
                        function (json) {
                           var models = json.model_list;
                           if (!$.isArray(models)) models = [models];
                           for (var j in models) {
                              var model = models[j];
                              brand.models[model.model] = {
                                 lines: model.lines,
                                 name: model.model,
                                 files: model.template_data.files,
                                 directory: 'endpoint/'+brand.directory+'/'+family.directory+'/'
                              };
                           }
                           callback();
                        }
               );
            }
         });
      },

      _loadDefaultSettings: function (brand, model, callback) {
         this.curModel = { brand: brand, model: model };
         this.settings = [];

         var model = this.brands[brand].models[model];
         var files = new Array();
         for (var i in model.files) files.push(model.directory+model.files[i]);

         console.log('loading files');
         this._loadFiles(files, callback);
      },

      _loadFiles: function (files, callback) {
         var THIS = this;
         for (var i in files) {
            (function (i) {
               $.getJSON(files[i], function (json) {
                  delete files[i]; files.length--;
                  THIS._settingsMergeIn(json);
                  if (files.length === 0) callback();
               });
            }) (i);
         }
      },

      _saveSubcategory: function () {
         // TODO: actually post the data
         console.log('saving subcategory');
      }
});











function display(obj, level) {
   var out = '';
   if (!level) level = 0;
   var pref = '';
   for (var i = 0; i < level; i++) pref += '     ';
   if ($.isArray(obj)||obj.toString() === '[object Object]') {
      for (var i in obj) {
         //console.log(pref+i+':');
         out += pref+i+':\n';
         if ($.isArray(obj)) {
            //console.log(pref+'['); 
            out += pref+'[\n';
         }
         else {
            //console.log(pref+'{');
            out += pref+'{\n';
         }
         out += display(obj[i], level+1);
         if ($.isArray(obj)) {
            //console.log(pref+']'); 
            out += pref+']\n';
         }
         else {
           //console.log(pref+'}');
           out += pref+'}\n';
         }
      }
   }
   else {
      //console.log(pref+obj.toString());
      out += pref+obj.toString()+'\n';
   }
   return out;
}
