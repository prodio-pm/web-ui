var controllers = require('../../lib/controllers.js');
var support = require('../../lib/support');
var Loader = require('../../lib/loader');
var el = support.el;
var els = support.els;
var val = support.val;
var socket = require('../../lib/socket');
helpers = require('../../lib/handlebarsHelpers')

var ReportSelectorController = function(container, data){
  var self = this;
  var target = container.dataset.target;
  var message = container.dataset.message;
  var handleSubmit = self.handleSubmit = function(e){
    if(e.target && (e.target.nodeName === 'FORM') || (e.target.nodeName === 'BUTTON')){
      var form = el(container, 'form')||container;
      var elems = form.elements, i=0, l=elems.length, elem;
      var data = {};
      e.preventDefault();
      for(; i<l; i++){
        elem = elems[i];
        if(elem.name){
          data[elem.name] = val(elem);
        }
      }
      var uri = data.report.replace(/{(.+)}/g, function(match, token){
        return data[token];
      });
      window.location.href=uri;
    }
  };
  container.addEventListener('submit', handleSubmit);
  container.addEventListener('click', handleSubmit);
};

ReportSelectorController.prototype.teardown = function(container){
  var self = this;
  container.removeEventListener('submit', self.handleSubmit);
  container.removeEventListener('click', self.handleSubmit);
};

controllers.register('ReportSelector', ReportSelectorController);
