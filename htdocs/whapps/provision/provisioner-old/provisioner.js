winkstart.module('provision', 'provisioner', {
      css: [
         'css/window.css',
         'css/visual.css'
      ],

      templates: {
         window      : 'tmpl/window.html',
         provisioner : 'tmpl/provisioner.html',
         selector    : 'tmpl/selector.html',
         save_load   : 'tmpl/save_load.html',
         categories  : 'tmpl/categories.html',
         groups      : 'tmpl/groups.html',
         group       : 'tmpl/group.html',
         input       : 'tmpl/input.html',
         list        : 'tmpl/list.html',
         radio       : 'tmpl/radio.html',
/*For temporary select hack*/
         select      : 'tmpl/select.html',
/**/
         //default     : 'tmpl/default.html'
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

      configForm: { },


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
         this._loadModel(brand, model, function () {
            THIS.curConfig = THIS._clone(THIS.defConfig);
            if (uri) { THIS._load(uri, function ( ) { THIS._render(); }); }
            else { THIS._render(); }
         });
      },

/*****************************************************************************
 *  Save current endpoint configuration  ***
 *****************************************************************************/
      save: function ( uri ) {
         var THIS = this, target = this.target, map = { }, json = '';

         for (var i in this.curConfig) map[this._idEncode(i)] = i;

         target.find('.variable').each(function ( ) {
            var item = $(this), id = item.attr('id');
            switch (item.attr('type')) {
               case 'radio': if (item.attr('checked') && map[id]) THIS.curConfig[map[id]] = item.attr('value');
               default: if (map[id]) THIS.curConfig[map[id]] = item.attr('value');
            }
         });
// CONVERSION TO PROPER JSON IS NEEDED
         for (var i in this.curConfig) json += i + ': ' + this.curConfig[i] + '\n';
         alert('Saving:\n'+json);
      },

/*****************************************************************************
 *  Load endpoint configuration  ***
 *****************************************************************************/
      _load: function ( uri, callback ) {
         if (!uri) return;
         var THIS = this;
         $.getJSON(uri, function (data) {
            THIS.curConfig = data;
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

         this.templates.save_load.tmpl({}).appendTo(target);
         target.find('.load').find('a').click(function ( ) { THIS._load(); });
         target.find('.save').find('a').click(function ( ) { THIS.save(); });

         for (var i in this.configForm) catList.push({ name: this.configForm[i].name });
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
         for (var sub in this.configForm[name].subcategory) subs.push(this.configForm[name].subcategory[sub]);

         for (var i = 0; i < (subs.length > 8 ? subs.length : 8); i++) {
            if ( i == 4 ) {
                  var sub = this._window({title: this.current.model.name, expand: false, collapse: false, close: false});
                  sub.addClass('phone');
                  sub.appendTo(target);
            }
            if (i in subs) {
               var sub = this._window({title: subs[i].name, expand: true, collapse: false, close: false}),
                   id = name + '.' + subs[i].name;
               sub.find('.body').append(this._renderForm(subs[i].groups, id));
               sub.appendTo(target);
            }
            else {
               var empty = this._window({title: "Empty", expand: false, collapse: false, close: false});
               empty.addClass('hidden');
               empty.appendTo(target);
            }
         }

         this._populate(this.curConfig);
      },


/*****************************************************************************
 *  Render form  ***
 *****************************************************************************/
      _renderForm: function (groups, base_id) {
         var form = this.templates.groups.tmpl({groupList: groups, render: groups.length > 1});
         for (var i in groups) {
            var group = groups[i],
                id = base_id + '.' + group.count;
            this._renderGroup(groups[i], id).appendTo(form);
         }
         return form;
      },

      _renderGroup: function (group, base_id) {
         var g = this.templates.group.tmpl({group: group});
         for (var i in group.item) {
            var item = group.item[i],
                id = this._idEncode(base_id + '.' + item.variable);
            /*this is a temporary hack for the select bug...*/
            if (item.type == "list") {
               var select = this.templates.select.tmpl({item: item, id: id});
               var opt = select.find('select');
               for (var j in item.data) {
                  var option = item.data[j];
                  opt.append('<option value="'+option.value+'">'+option.text+'</option>');
               }
               g.append(select);
            }
            else /**/ if (item.type in this.templates)
               this.templates[item.type].tmpl({item: item, id: id}).appendTo(g);
            else
               this.templates.default.tmpl({item: item, id: id}).appendTo(g);
         }
         return g;
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
         var config = this.configForm;
         if (!$.isArray(json.category)) json.category = [json.category];
         for (var i in json.category) {
            var cat = json.category[i];
            if (!config[cat.name]) config[cat.name] = { name: cat.name, subcategory: {} };

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
               var items = this._clone(item.data.item);
               for (var j in items) {
                  var el = items[j];
                  if (el.description) el.description = el.description.replace("{$count}", i);
               }
               var group = {
                  item: items,
                  description: item.type === 'loop_line_options' ? 'Line '+i : item.description+': '+i,
                  count: i
               };
               groupList.push(group);
            }
         }
         else {
            var items = this._clone(item.data);
            var group = {
               item: items,
               description: "",
               count: 1
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
      _loadModel: function (brand, model, callback) {
         var THIS = this,
             model = this.brandList[brand].modelList[model],
             files = new Array();

         this.current = { brand: brand, model: model };
         this.configForm = { };

         for (var i in model.files) files.push(model.directory+model.files[i]);

         console.log('loading files');
         this._loadFiles(files, function ( ) { THIS._parseDefault(); callback(); });
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


/*****************************************************************************
 *  Parse default model configuration  ***
 *****************************************************************************/
      _parseDefault: function ( ) {
         this.defConfig = { };
         for (var i in this.configForm) {
            var cat = this.configForm[i];
            for (var j in cat.subcategory) {
               var sub = cat.subcategory[j];
               for (var k in sub.groups) {
                  var group = sub.groups[k];
                  for (var l in group.item) {
                     var item = group.item[l];
                     if (item.default_value && typeof (item.default_value) != 'object') {
                        var id = cat.name+'.'+sub.name+'.'+group.count+'.'+item.variable;
                        this.defConfig[id] = item.default_value;
                     }
                  }
               }
            }
         }
      },

      _populate: function ( config ) {
         var target = this.target;
         for (var i in config) {
            target.find('#'+this._idEncode(i)).each(function ( ) {
               item = $(this);
               switch(item.attr('type')) {
                  case 'text': item.attr('value', config[i]); break;
                  case 'select-one': item.attr('value', config[i]); break;
                  case 'radio': if (item.attr('value') == config[i]) item.attr('checked', true); else item.attr('checked', false); break;
               }
            });
         }
      },


/*****************************************************************************
 *  HELPERS  ***
 *****************************************************************************/

/*****************************************************************************
 *  ID encoding  ***
 *****************************************************************************/
   _idEncode: function ( id ) {
      var enc = id.replace(/\$/gi, ":");
      enc = enc.replace(/\W/gi, "_");
      return enc;
   },

/*****************************************************************************
 *  Deep object cloning  ***
 *****************************************************************************/
   _clone: function (obj) {
      if (obj == null || typeof(obj) != 'object') return obj;
      var o = new obj.constructor(); 
      for (var key in obj) o[key] = this._clone(obj[key]);
      return o;
   }
});
