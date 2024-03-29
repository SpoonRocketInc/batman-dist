/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	Batman.Paginator = __webpack_require__(166);

	Batman.ModelPaginator = __webpack_require__(167);


/***/ },

/***/ 166:
/***/ function(module, exports) {

	var Paginator,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	module.exports = Paginator = (function(_super) {
	  __extends(Paginator, _super);

	  function Paginator() {
	    return Paginator.__super__.constructor.apply(this, arguments);
	  }

	  Paginator.Range = (function() {
	    function Range(offset, limit) {
	      this.offset = offset;
	      this.limit = limit;
	      this.reach = offset + limit;
	    }

	    Range.prototype.coversOffsetAndLimit = function(offset, limit) {
	      return offset >= this.offset && (offset + limit) <= this.reach;
	    };

	    return Range;

	  })();

	  Paginator.Cache = (function(_super1) {
	    __extends(Cache, _super1);

	    function Cache(offset, limit, items) {
	      this.offset = offset;
	      this.limit = limit;
	      this.items = items;
	      Cache.__super__.constructor.apply(this, arguments);
	      this.length = items.length;
	    }

	    Cache.prototype.itemsForOffsetAndLimit = function(offset, limit) {
	      var begin, end, padding, slice;
	      begin = offset - this.offset;
	      end = begin + limit;
	      if (begin < 0) {
	        padding = new Array(-begin);
	        begin = 0;
	      }
	      slice = this.items.slice(begin, end);
	      if (padding) {
	        return padding.concat(slice);
	      } else {
	        return slice;
	      }
	    };

	    return Cache;

	  })(Paginator.Range);

	  Paginator.prototype.offset = 0;

	  Paginator.prototype.limit = 10;

	  Paginator.prototype.totalCount = 0;

	  Paginator.prototype.totalCountKey = 'totalCount';

	  Paginator.prototype.markAsLoadingOffsetAndLimit = function(offset, limit) {
	    return this.loadingRange = new Batman.Paginator.Range(offset, limit);
	  };

	  Paginator.prototype.markAsFinishedLoading = function() {
	    return delete this.loadingRange;
	  };

	  Paginator.prototype.offsetFromPageAndLimit = function(page, limit) {
	    return Math.round((+page - 1) * limit);
	  };

	  Paginator.prototype.pageFromOffsetAndLimit = function(offset, limit) {
	    return offset / limit + 1;
	  };

	  Paginator.prototype._load = function(offset, limit) {
	    var _ref;
	    if ((_ref = this.loadingRange) != null ? _ref.coversOffsetAndLimit(offset, limit) : void 0) {
	      return;
	    }
	    this.markAsLoadingOffsetAndLimit(offset, limit);
	    return this.loadItemsForOffsetAndLimit(offset, limit);
	  };

	  Paginator.prototype.toArray = function() {
	    var cache, limit, offset;
	    cache = this.get('cache');
	    offset = this.get('offset');
	    limit = this.get('limit');
	    if (!(cache != null ? cache.coversOffsetAndLimit(offset, limit) : void 0)) {
	      this._load(offset, limit);
	    }
	    return (cache != null ? cache.itemsForOffsetAndLimit(offset, limit) : void 0) || [];
	  };

	  Paginator.prototype.page = function() {
	    return this.pageFromOffsetAndLimit(this.get('offset'), this.get('limit'));
	  };

	  Paginator.prototype.pageCount = function() {
	    return Math.ceil(this.get('totalCount') / this.get('limit'));
	  };

	  Paginator.prototype.previousPage = function() {
	    return this.set('page', this.get('page') - 1);
	  };

	  Paginator.prototype.nextPage = function() {
	    return this.set('page', this.get('page') + 1);
	  };

	  Paginator.prototype.loadItemsForOffsetAndLimit = function(offset, limit) {};

	  Paginator.prototype.updateCache = function(offset, limit, items) {
	    var cache;
	    cache = new Batman.Paginator.Cache(offset, limit, items);
	    if ((this.loadingRange != null) && !cache.coversOffsetAndLimit(this.loadingRange.offset, this.loadingRange.limit)) {
	      return;
	    }
	    this.markAsFinishedLoading();
	    return this.set('cache', cache);
	  };

	  Paginator.accessor('toArray', Paginator.prototype.toArray);

	  Paginator.accessor('offset', 'limit', 'totalCount', {
	    get: Batman.Property.defaultAccessor.get,
	    set: function(key, value) {
	      return Batman.Property.defaultAccessor.set.call(this, key, +value);
	    }
	  });

	  Paginator.accessor('page', {
	    get: Paginator.prototype.page,
	    set: function(_, value) {
	      value = +value;
	      this.set('offset', this.offsetFromPageAndLimit(value, this.get('limit')));
	      return value;
	    }
	  });

	  Paginator.accessor('pageCount', Paginator.prototype.pageCount);

	  return Paginator;

	})(Batman.Object);


/***/ },

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	var ModelPaginator, Paginator,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Paginator = __webpack_require__(166);

	module.exports = ModelPaginator = (function(_super) {
	  __extends(ModelPaginator, _super);

	  function ModelPaginator() {
	    return ModelPaginator.__super__.constructor.apply(this, arguments);
	  }

	  ModelPaginator.prototype.cachePadding = 0;

	  ModelPaginator.prototype.paddedOffset = function(offset) {
	    offset -= this.cachePadding;
	    if (offset < 0) {
	      return 0;
	    } else {
	      return offset;
	    }
	  };

	  ModelPaginator.prototype.paddedLimit = function(limit) {
	    return limit + this.cachePadding * 2;
	  };

	  ModelPaginator.prototype.loadItemsForOffsetAndLimit = function(offset, limit) {
	    var k, params, v, _ref;
	    params = this.paramsForOffsetAndLimit(offset, limit);
	    _ref = this.params;
	    for (k in _ref) {
	      v = _ref[k];
	      params[k] = v;
	    }
	    return this.model.load(params, (function(_this) {
	      return function(err, records, env) {
	        if (err != null) {
	          _this.markAsFinishedLoading();
	          return _this.fire('error', err);
	        } else {
	          _this.set('totalCount', env.response[_this.totalCountKey]);
	          return _this.updateCache(_this.offsetFromParams(params), _this.limitFromParams(params), records);
	        }
	      };
	    })(this));
	  };

	  ModelPaginator.prototype.paramsForOffsetAndLimit = function(offset, limit) {
	    return {
	      offset: this.paddedOffset(offset),
	      limit: this.paddedLimit(limit)
	    };
	  };

	  ModelPaginator.prototype.offsetFromParams = function(params) {
	    return params.offset;
	  };

	  ModelPaginator.prototype.limitFromParams = function(params) {
	    return params.limit;
	  };

	  return ModelPaginator;

	})(Paginator);


/***/ }

/******/ });