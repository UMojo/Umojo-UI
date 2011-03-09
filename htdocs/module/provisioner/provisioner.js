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
         item        : 'tmpl/item.html',
         groups      : 'tmpl/groups.html',
         group       : 'tmpl/group.html'
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
               sub.find('.body').append(this._renderForm(subs[i].groups));
               sub.appendTo(target);
            }
            else {
               var empty = this._window({title: "Empty", expand: false, collapse: false, close: false});
               empty.addClass('hidden');
               empty.appendTo(target);
            }
         }
      },


/*****************************************************************************
 *  Render form  ***
 *****************************************************************************/
      _renderForm: function (groups) {
         console.log(groups);
         var form = this.templates.groups.tmpl({groupList: groups, render: groups.length > 1});
         for (var i in groups) this.templates.group.tmpl({group: groups[i]}).appendTo(form);
         return form;
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
               if (!ccat.subcategory[sub.name]) ccat.subcategory[sub.name] = { name: sub.name, groups: new Array() };

               if ($.isArray(sub.item)) sub.item = { data: sub.item };
               ccat.subcategory[sub.name].groups = this._parseItem(sub.item);
            }
         }
      },

/*****************************************************************************
 *  Parse json item into configuration item  ***
 *****************************************************************************/
      _parseItem: function (item) {
         var groupList = [];
         if (item.type === 'loop_line_options' || item.type === 'loop') {
            var current = this.current,
                lines = this.brandList[current.brand].modelList[current.model.name].lines,
                start = item.type === 'loop' ? item.loop_start : 1,
                end = item.type === 'loop' ? item.loop_end : lines;

            for (var i = start; i <= end; i++) {
               var group = {
                  item: item.data.item,
                  description: item.type === 'loop_line_options' ? 'Line '+i : item.description+': '+i
               }
               groupList.push(group);
            }
         }
         else {
            var group = {
               item: item.data,
               description: ""
            }
            groupList.push(group);
         }
         return groupList;
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
