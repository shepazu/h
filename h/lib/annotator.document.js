// Generated by CoffeeScript 1.6.3
/*
** Annotator 1.2.6-dev-5352913
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-12-16 13:46:45Z
*/



/*
//
*/

// Generated by CoffeeScript 1.6.3
(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Annotator.Plugin.Document = (function(_super) {
    var $;

    __extends(Document, _super);

    function Document() {
      this._getFavicon = __bind(this._getFavicon, this);
      this._getLinks = __bind(this._getLinks, this);
      this._getTitle = __bind(this._getTitle, this);
      this._getMetaTags = __bind(this._getMetaTags, this);
      this._getEprints = __bind(this._getEprints, this);
      this._getPrism = __bind(this._getPrism, this);
      this._getDublinCore = __bind(this._getDublinCore, this);
      this._getTwitter = __bind(this._getTwitter, this);
      this._getFacebook = __bind(this._getFacebook, this);
      this._getHighwire = __bind(this._getHighwire, this);
      this.getDocumentMetadata = __bind(this.getDocumentMetadata, this);
      this.beforeAnnotationCreated = __bind(this.beforeAnnotationCreated, this);
      this.uris = __bind(this.uris, this);
      this.uri = __bind(this.uri, this);
      _ref = Document.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    $ = Annotator.$;

    Document.prototype.events = {
      'beforeAnnotationCreated': 'beforeAnnotationCreated'
    };

    Document.prototype.pluginInit = function() {
      return this.getDocumentMetadata();
    };

    Document.prototype.uri = function() {
      var link, uri, _i, _len, _ref1;
      uri = decodeURIComponent(document.location.href);
      _ref1 = this.metadata;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        link = _ref1[_i];
        if (link.rel === "canonical") {
          uri = link.href;
        }
      }
      return uri;
    };

    Document.prototype.uris = function() {
      var href, link, uniqueUrls, _i, _len, _ref1;
      uniqueUrls = {};
      _ref1 = this.metadata.link;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        link = _ref1[_i];
        if (link.href) {
          uniqueUrls[link.href] = true;
        }
      }
      return (function() {
        var _results;
        _results = [];
        for (href in uniqueUrls) {
          _results.push(href);
        }
        return _results;
      })();
    };

    Document.prototype.beforeAnnotationCreated = function(annotation) {
      return annotation.document = this.metadata;
    };

    Document.prototype.getDocumentMetadata = function() {
      this.metadata = {};
      this._getHighwire();
      this._getDublinCore();
      this._getFacebook();
      this._getEprints();
      this._getPrism();
      this._getTwitter();
      this._getFavicon();
      this._getTitle();
      this._getLinks();
      return this.metadata;
    };

    Document.prototype._getHighwire = function() {
      return this.metadata.highwire = this._getMetaTags("citation", "name", "_");
    };

    Document.prototype._getFacebook = function() {
      return this.metadata.facebook = this._getMetaTags("og", "property", ":");
    };

    Document.prototype._getTwitter = function() {
      return this.metadata.twitter = this._getMetaTags("twitter", "name", ":");
    };

    Document.prototype._getDublinCore = function() {
      return this.metadata.dc = this._getMetaTags("dc", "name", ".");
    };

    Document.prototype._getPrism = function() {
      return this.metadata.prism = this._getMetaTags("prism", "name", ".");
    };

    Document.prototype._getEprints = function() {
      return this.metadata.eprints = this._getMetaTags("eprints", "name", ".");
    };

    Document.prototype._getMetaTags = function(prefix, attribute, delimiter) {
      var content, match, meta, n, name, tags, _i, _len, _ref1;
      tags = {};
      _ref1 = $("meta");
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        meta = _ref1[_i];
        name = $(meta).attr(attribute);
        content = $(meta).prop("content");
        if (name) {
          match = name.match(RegExp("^" + prefix + delimiter + "(.+)$", "i"));
          if (match) {
            n = match[1];
            if (tags[n]) {
              tags[n].push(content);
            } else {
              tags[n] = [content];
            }
          }
        }
      }
      return tags;
    };

    Document.prototype._getTitle = function() {
      if (this.metadata.highwire.title) {
        return this.metadata.title = this.metadata.highwire.title[0];
      } else if (this.metadata.eprints.title) {
        return this.metadata.title = this.metadata.eprints.title;
      } else if (this.metadata.prism.title) {
        return this.metadata.title = this.metadata.prism.title;
      } else if (this.metadata.facebook.title) {
        return this.metadata.title = this.metadata.facebook.title;
      } else if (this.metadata.twitter.title) {
        return this.metadata.title = this.metadata.twitter.title;
      } else if (this.metadata.dc.title) {
        return this.metadata.title = this.metadata.dc.title;
      } else {
        return this.metadata.title = $("head title").text();
      }
    };

    Document.prototype._getLinks = function() {
      var doi, href, id, l, link, name, rel, type, url, values, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3, _results;
      this.metadata.link = [
        {
          href: document.location.href
        }
      ];
      _ref1 = $("link");
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        link = _ref1[_i];
        l = $(link);
        href = this._absoluteUrl(l.prop('href'));
        rel = l.prop('rel');
        type = l.prop('type');
        if ((rel === "alternate" || rel === "canonical" || rel === "bookmark") && (type !== "application/rss+xml" && type !== "application/atom+xml")) {
          this.metadata.link.push({
            href: href,
            rel: rel,
            type: type
          });
        }
      }
      _ref2 = this.metadata.highwire;
      for (name in _ref2) {
        values = _ref2[name];
        if (name === "pdf_url") {
          for (_j = 0, _len1 = values.length; _j < _len1; _j++) {
            url = values[_j];
            this.metadata.link.push({
              href: this._absoluteUrl(url),
              type: "application/pdf"
            });
          }
        }
        if (name === "doi") {
          for (_k = 0, _len2 = values.length; _k < _len2; _k++) {
            doi = values[_k];
            if (doi.slice(0, 4) !== "doi:") {
              doi = "doi:" + doi;
            }
            this.metadata.link.push({
              href: doi
            });
          }
        }
      }
      _ref3 = this.metadata.dc;
      _results = [];
      for (name in _ref3) {
        values = _ref3[name];
        if (name === "identifier") {
          _results.push((function() {
            var _l, _len3, _results1;
            _results1 = [];
            for (_l = 0, _len3 = values.length; _l < _len3; _l++) {
              id = values[_l];
              if (id.slice(0, 4) === "doi:") {
                _results1.push(this.metadata.link.push({
                  href: id
                }));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Document.prototype._getFavicon = function() {
      var link, _i, _len, _ref1, _ref2, _results;
      _ref1 = $("link");
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        link = _ref1[_i];
        if ((_ref2 = $(link).prop("rel")) === "shortcut icon" || _ref2 === "icon") {
          _results.push(this.metadata["favicon"] = this._absoluteUrl(link.href));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Document.prototype._absoluteUrl = function(url) {
      var img;
      img = $("<img src='" + url + "'></img>");
      url = img.prop('src');
      img.prop('src', null);
      return url;
    };

    return Document;

  })(Annotator.Plugin);

}).call(this);

//
//@ sourceMappingURL=annotator.document.map