winkstart.module('provisioner', {
      css: [
         'css/window.css',
         'css/visual.css'
      ],

      templates: {
         window      : 'tmpl/window.html',
         provisioner : 'tmpl/provisioner.html',
         selector    : 'tmpl/selector.html',
         categories  : 'tmpl/categories.html',
         item        : 'tmpl/item.html'
      },

      elements: {
         content    : '#ws_prov',
         selector   : '#selector',
         categories : '#categories',
         endpoint   : '#endpoint',
         catList    : '#cats',
         config     : '#config'
      },

      requests: {
         'provisioner.get' : { url : 'serverside script that spits json' }
      },

      subscribe: {
         'provisioner.activate' : 'activate'
      }
   },
   function (args) {
      winkstart.publish('nav.add', {module: this.__module, label: 'PROVISIONER'});
   },
   {
/*****************************************************************************
 *  DATA  ***
 *****************************************************************************/

   /**************************************************************************
    *    ***
    **************************************************************************/
      target: $('body'),
      jsonDir: 'endpoint/',

      brandList: { },

      current: { brand: '', model: {} },

      defConfig: { },
      curConfig: { },


      activate: function (args) {
         var THIS = this;
         this.templates.provisioner.tmpl({}).appendTo( args.target.empty() );
         this.target = $(this.config.elements.content);
         this._loadBrands(function () { THIS._renderSelector(); });
         winkstart.publish('layout.updateLoadedModule', {label: 'Provisioner', module: this.__module});
      },


/*****************************************************************************
 *  PUBLIC API  ***
 *****************************************************************************/


/*****************************************************************************
 *  Render configuration manager using given brand model and config  ***
 *  uri - uri of the stored configuration
 *****************************************************************************/
      render: function (brand, model, uri) {
         var THIS = this;
         this.loadModel(brand, model, function () {
            if (uri) { /*TODO:load config*/THIS._render(); }
            else { THIS.curConfig = THIS.defConfig; THIS._render(); }
         });
      },



/*****************************************************************************
 *  INTERNAL API  ***
 *****************************************************************************/


/*****************************************************************************
 *  Render selection control  ***
 *****************************************************************************/
      _renderSelector: function () {
         var THIS = this,
             selector = this.templates.selector.tmpl({ brandList: THIS.brandList });
         selector.find('.model').click(function () { THIS.render($(this).attr('brand'), $(this).attr('model')); });
         selector.appendTo( this.target.find(this.config.elements.selector).empty() );
      },



/*****************************************************************************
 *  Render current configuration state  ***
 *****************************************************************************/
      _render: function () {
         var THIS = this,
             target = this.target.find(this.config.elements.categories).empty(),
             catList = new Array();
         for (var i in this.curConfig) catList.push({ name: this.curConfig[i].name });
         this.templates.categories.tmpl({categories: catList}).appendTo(target);
         target.find('.category').click(function ( ) { THIS._selectCategory($(this).attr('name')); });
         this._selectCategory(catList[0].name);
      },


/*****************************************************************************
 *  Select category  ***
 *****************************************************************************/
      _selectCategory: function (name) {
         var THIS = this,
             categories = this.target.find(this.config.elements.categories),
             target = this.target.find(this.config.elements.endpoint).empty();

         categories.find('.category').each(function () {
            if ($(this).attr('name') != name) $(this).removeClass('current');
            else $(this).addClass('current');
         });

         // this is way better than it was before but still it needs a better way for mapping subcategories
         var subs = new Array();
         for (var sub in this.curConfig[name].subcategory) subs.push(this.curConfig[name].subcategory[sub]);

         for (var i = 0; i < (subs.length > 8 ? subs.length : 8); i++) {
            if ( i == 4 ) {
                  var sub = this._window({title: this.current.model.name, expand: false, collapse: false, close: false});
                  sub.addClass('phone');
                  sub.appendTo(target);
            }
            if (i in subs) {
               var sub = this._window({title: subs[i].name, expand: true, collapse: false, close: false});
               sub.find('.body').append(this._renderForm(subs[i].item));
               sub.appendTo(target);
            }
            else {
               this._window({title: "Empty", expand: false, collapse: false, close: false}).appendTo(target);
            }
         }
      },


/*****************************************************************************
 *  Render form  ***
 *****************************************************************************/
      _renderForm: function (item) {
         console.log("==========");
         console.log(item);console.log(item.length);
         var group = item.length > 1 ? [{data: item, description: ' ', type: "group"}] : item[0];
         console.log(group);
         return this.templates.item.tmpl({item: group});
         console.log("==========");
      },


/*****************************************************************************
 *  Render subcategory  ***
 *****************************************************************************/
      _renderSub: function (cat, sub) {
         console.log('rendering '+cat+'.'+sub);
         $.template('item', this.templates.item);//{{tmpl({"item" : el}) "item"}}<br>
         var data = this.curConfig[cat].subcategory[sub],
             subcat = this.templates.sub.tmpl(data),
             form = subcat.find('fieldset');
         for (var i in data.item) form.append(this.templates.item.tmpl({ item: data.item[i] }));
         console.log(subcat);
         console.log(data);

/*         // convertion to tabs view
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
         });*/

         return subcat;
      },


/*****************************************************************************
 *  Render window  ***
 *****************************************************************************/
      _window: function (params) {
         var w = this.templates.window.tmpl(params);
         w.find(".button.expand").click(function ( ) {
            w.toggleClass("maximized");
         });
         return w;
      },












/*****************************************************************************
 *  DATA MANIPULATION  ***
 *****************************************************************************/


/*****************************************************************************
 *  Merging JSON into default configuration  ***
 *****************************************************************************/
      _mergeJSON: function (json) {
         var config = this.defConfig;
         if (!$.isArray(json.category)) json.category = [json.category];
         for (var i in json.category) {
            var cat = json.category[i];
            if (!config[cat.name]) config[cat.name] = { name: cat.name, subcategory: [] };

            var ccat = config[cat.name];
            if (!$.isArray(cat.subcategory)) cat.subcategory = [cat.subcategory];
            for (var j in cat.subcategory) {
               var sub = cat.subcategory[j];
               if (!ccat.subcategory[sub.name]) ccat.subcategory[sub.name] = { name: sub.name, item: new Array() };

               if (!$.isArray(sub.item)) sub.item = [sub.item];
               for (var k in sub.item) {
                  var item = sub.item[k];
                  ccat.subcategory[sub.name].item.push(this._parseItem(item));
               }
            }
         }
      },

/*****************************************************************************
 *  Parse json item into configuration item  ***
 *****************************************************************************/
      _parseItem: function (item) {
         if (item.type === 'loop_line_options' || item.type === 'loop') {
            var tabs = { type: 'group', data: new Array() }
            tabs.description = item.description;

            var current = this.current;
                lines = this.brandList[current.brand].modelList[current.model.name].lines;

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


/*****************************************************************************
 *  FILE MANIPULATION  ***
 *****************************************************************************/


/*****************************************************************************
 *  Extract brand list  ***
 *****************************************************************************/
      _loadBrands: function (callback) {
         var THIS = this;
         this.brandList = {};
         $.getJSON(this.jsonDir + 'master.json', function (json) {
            for (var i in json.brands) {
               var brand = { name: json.brands[i].name, directory: json.brands[i].directory, modelList: {} }
               THIS.brandList[brand.name] = brand;
               THIS._loadBrandData(brand, callback);
            }
            callback();
         });
      },

/*****************************************************************************
 *  Extract brand data  ***
 *  brand - { name, directory }
 *****************************************************************************/
      _loadBrandData: function (brand, callback) {
         var THIS = this;
         $.getJSON(this.jsonDir+brand.directory+'/brand_data.json', function (json) {
            var families = json.brands.family_list.family;
            if (!$.isArray(families)) families = [families];

            for (var i in families) {
               var family = families[i];
               $.getJSON(THIS.jsonDir+brand.directory+'/'+family.directory+'/family_data.json',
                         function (json) {
                            var models = json.model_list;
                            if (!$.isArray(models)) models = [models];
                            for (var j in models) {
                               var model = models[j];
                               brand.modelList[model.model] = {
                                  lines: model.lines,
                                  name: model.model,
                                  files: model.template_data.files,
                                  directory: THIS.jsonDir+brand.directory+'/'+family.directory+'/'
                               };
                            }
                            callback();
                         }
               );
            }
         });
      },



/*****************************************************************************
 *  Extract default configuration  ***
 *****************************************************************************/
      loadModel: function (brand, model, callback) {
         var model = this.brandList[brand].modelList[model],
             files = new Array();

         this.current = { brand: brand, model: model };
         this.defConfig = { };

         for (var i in model.files) files.push(model.directory+model.files[i]);

         console.log('loading files');
         this._loadFiles(files, callback);
      },

/*****************************************************************************
 *  Extract and merge files into default configuration  ***
 *  files - [ path ]
 *****************************************************************************/
      _loadFiles: function (files, callback) {
         var THIS = this;

         for (var i in files) {
            (function (i) {
               $.getJSON(files[i], function (json) {
                  delete files[i]; files.length--;
                  THIS._mergeJSON(json);
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
