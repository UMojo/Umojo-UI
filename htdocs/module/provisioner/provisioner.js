winkstart.module('provisioner', {
      css: [
         //'css/style.css',
         'css/jquery-ui-1.8.7.custom.css',
         'css/niceforms-default.css',
         'css/jquery.multiSelect.css',
         'css/layout.css',
         'css/selector.css'
      ],

      templates: {
         provisioner: 'tmpl/provisioner.html',
         selector: 'tmpl/selector.html',
         manager: 'tmpl/manager.html',
         sub: 'tmpl/subcategory.html',
         item: 'tmpl/item.html'
      },

      elements: {
         selector: '#ws_prov_selector',
         endpoint: '#ws_prov_endpoint',
         catList:  '#ws_prov_ep_cats',
         config:   '#ws_prov_ep_config'
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
      elements: {
         catList: 'catList',
         settings: 'config'
      },


/*****************************************************************************
 *  DATA  ***
 *****************************************************************************/

   /**************************************************************************
    *    ***
    **************************************************************************/
      jsonDir: 'endpoint/',

      brandList: { },

      current: { brand: '', model: {} },

      defConfig: { },
      curConfig: { },


      activate: function (args) {
         args.target.empty();

         var THIS = this;
         this.templates.provisioner.tmpl({}).appendTo( args.target );
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
         this._loadDefaultConfig(brand, model, function () {
            if (uri) THIS.loadConfig(uri);
            else THIS.loadDefault();
         });
      },


      showCategory: function (name) {
         this._selectCategory(name);
      },

/*****************************************************************************
 *  Load previously stored config into configuration manager  ***
 *  uri - uri of the stored configuration
 *****************************************************************************/
      loadConfig: function (uri) {
         // TODO: settings via getJSON
         var THIS = this;
         THIS._render();
      },

/*****************************************************************************
 *  Load default config into configuration manager  ***
 *****************************************************************************/
      loadDefault: function () {
         this.curConfig = this.defConfig;
         this._render();
      },

/*****************************************************************************
 *  Save current configuration manager state  ***
 *****************************************************************************/
      saveConfig: function (uri) {
         // TODO: post settings property
      },




/*****************************************************************************
 *  INTERNAL API  ***
 *****************************************************************************/


/*****************************************************************************
 *  Render selection control  ***
 *****************************************************************************/
      _renderSelector: function () {
         var THIS = this;

         var selector = this.templates.selector.tmpl({ brandList: THIS.brandList });
         selector.find('.models').hide();
         selector.find('.brand').hover(function () { $(this).find('.models').toggle(); });
         selector.find('.model').click(function () {
            THIS.render($(this).attr('brand'), $(this).attr('model'));
         });

         selector.appendTo( $(this.config.elements.selector).empty() );
      },



/*****************************************************************************
 *  Render current configuration state  ***
 *****************************************************************************/
      _render: function () {
         var target = $(this.config.elements.endpoint).empty(),
             config = this.curConfig;
             catList = new Array();

         for (var i in config) catList.push({ name: config[i].name });
         this._renderManager(catList).appendTo(target);
         this._selectCategory(catList[0].name);
      },

/*****************************************************************************
 *  Render configuration manager  ***
 *****************************************************************************/
      _renderManager: function (catList) {
          var THIS = this,
              data = {
                 categories: catList,
                 model: this.current.model
              },
              manager = this.templates.manager.tmpl(data);

          manager.find('li.category').click(function () { THIS._selectCategory($(this).attr('name')); });

          return manager;
      },

/*****************************************************************************
 *  Select category  ***
 *****************************************************************************/
      _selectCategory: function (name) {
         var THIS = this,
             endpoint = $(this.config.elements.endpoint),
             menu = endpoint.find(this.config.elements.catList),
             config = endpoint.find(this.config.elements.config);

         if (name !== menu.find('li.current').attr('name')) {
            menu.find('li.category').removeClass('current');
            menu.find('li.category[name="'+name+'"]').addClass('current');

            config.find('.subcategory').empty();
            config.find('#temp').remove();

            for (var subName in this.curConfig[name].subcategory) {
               /**************************************************************
                *  NOTE: bad mechanism for finding subcategory windows!!!
                **************************************************************/
               var window = config.find('#'+subName.replace(/\W/gi, "_"));

               if (window.length == 0) {
                  window = $('<div id="temp" class="subcategory"></div>');
                  window.appendTo(config);
                  console.log(subName);
               }
               window.append(this._renderSub(name, subName));
            }
         }

         config.find('.subcategory').each(function () {
            var sub = $(this),
                offset = $(this).offset();

            sub.find('h1').unbind().click(function () {
               sub.toggleClass('expand');
               if (sub.hasClass('expand')) sub.offset(config.offset());
               else sub.position(offset);
            });
         });
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
            var tabs = { type: 'tabs', data: new Array() }
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
      _loadDefaultConfig: function (brand, model, callback) {
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
