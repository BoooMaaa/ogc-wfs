(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.wfs = {}));
}(this, function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  // find '{{ ... }}' string
  var regExp = /\{\{((?:.|\r?\n)+?)\}\}/g;
  /**
   * compile template
   * @private
   * @param template
   * @param data
   */

  function templateRender(template, data) {
    var match;
    var str = template;

    while (match = regExp.exec(template)) {
      var key = match[1].trim();
      var value = typeof data.hasOwnProperty === 'function' && data.hasOwnProperty(key) ? data[key] : '';
      str = str.replace(match[0], value);
    }

    return str;
  }

  /**
   * Main Class
   */

  var WFS =
  /*#__PURE__*/
  function () {
    function WFS(options) {
      _classCallCheck(this, WFS);

      this.version = '1.0.0';
      this.outputFormat = 'JSON';
      this.maxFeatures = 100;
      this.typeName = options.typeName;

      if (options.outputFormat) {
        this.outputFormat = options.outputFormat;
      }

      if (typeof options.maxFeatures === 'number') {
        this.maxFeatures = options.maxFeatures;
      }

      this.namespaces = options.namespaces;
      this.extraAttributes = options.extraAttributes;
    }
    /**
     * get xml string
     * @param filter WFSFilter or filter string
     */


    _createClass(WFS, [{
      key: "getXML",
      value: function getXML(filter) {
        var data = {
          version: this.version,
          outputFormat: this.outputFormat,
          maxFeatures: this.maxFeatures,
          namespaces: this.getNamespaces(),
          extraAttributes: this.getExtraAttributes(),
          typeName: this.typeName,
          filter: ''
        };

        if (filter) {
          if (filter instanceof Array) {
            filter.forEach(function (item) {
              data.filter += item;
            });
          } else {
            data.filter += filter;
          }
        }

        return templateRender(template, data).replace(/\n/g, '');
      }
    }, {
      key: "getNamespaces",
      value: function getNamespaces() {
        var ns = [];
        var namespaces = Object.assign({}, baseNamespaces, this.namespaces);

        for (var key in namespaces) {
          if (namespaces.hasOwnProperty(key)) {
            ns.push("xmlns:".concat(key, "=\"").concat(namespaces[key], "\""));
          }
        }

        return ns.join(' ');
      }
    }, {
      key: "getExtraAttributes",
      value: function getExtraAttributes() {
        if (this.extraAttributes) {
          var ea = [];
          var extraAttributes = this.extraAttributes;

          for (var key in extraAttributes) {
            if (extraAttributes.hasOwnProperty(key)) {
              ea.push("".concat(key, "=\"").concat(extraAttributes[key], "\""));
            }
          }
        } else {
          return '';
        }
      }
    }]);

    return WFS;
  }();
  var template = "<wfs:GetFeature service=\"WFS\"\n version=\"{{ version }}\"\n outputFormat=\"{{ outputFormat }}\"\n maxFeatures=\"{{ maxFeatures }}\"\n {{ extraAttributes }}\n {{ namespaces }}\n xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/filter/{{ version }}/filter.xsd\">\n<wfs:Query typeName=\"{{ typeName }}\">\n<ogc:Filter>\n{{ filter }}\n</ogc:Filter>\n</wfs:Query>\n</wfs:GetFeature>";
  var baseNamespaces = {
    topp: 'http://www.openplans.org/topp',
    wfs: 'http://www.opengis.net/wfs',
    ogc: 'http://www.opengis.net/ogc',
    gml: 'http://www.opengis.net/gml',
    xsi: 'http://www.w3.org/2001/XMLSchema-instance'
  };

  /**
   * basic class of filter
   */
  var WFSFilter =
  /*#__PURE__*/
  function () {
    function WFSFilter() {
      _classCallCheck(this, WFSFilter);
    }

    _createClass(WFSFilter, [{
      key: "or",
      value: function or() {
        for (var _len = arguments.length, filters = new Array(_len), _key = 0; _key < _len; _key++) {
          filters[_key] = arguments[_key];
        }

        return this.logicJoin(filters, 'Or');
      }
    }, {
      key: "and",
      value: function and() {
        for (var _len2 = arguments.length, filters = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          filters[_key2] = arguments[_key2];
        }

        return this.logicJoin(filters, 'And');
      }
    }, {
      key: "not",
      value: function not() {
        return "<Not>".concat(this.toString(), "</Not>");
      }
    }, {
      key: "logicJoin",
      value: function logicJoin(filters, operator) {
        var str = "<".concat(operator, ">").concat(this.toString());
        filters.forEach(function (filter) {
          str += filter;
        });
        return "".concat(str, "</").concat(operator, ">");
      }
    }]);

    return WFSFilter;
  }();

  /**
   * format GeometryObject json to gml
   */

  var GML =
  /*#__PURE__*/
  function () {
    function GML(geometryObject) {
      _classCallCheck(this, GML);

      switch (geometryObject.type) {
        case 'Point':
          this.gmlString = this.createPoint(geometryObject.coordinates);
          break;

        case 'MultiPoint':
          this.gmlString = this.createMultiPoint(geometryObject.coordinates);
          break;

        case 'LineString':
          this.gmlString = this.createLineString(geometryObject.coordinates);
          break;

        case 'MultiLineString':
          this.gmlString = this.createMultiLineString(geometryObject.coordinates);
          break;

        case 'Polygon':
          this.gmlString = this.createPolygon(geometryObject.coordinates);
          break;

        case 'MultiPloygon':
          this.gmlString = this.createMultiPolygon(geometryObject.coordinates);
      }
    }

    _createClass(GML, [{
      key: "toString",
      value: function toString() {
        return this.gmlString;
      }
    }, {
      key: "createPoint",
      value: function createPoint(coordinates) {
        var template = templates.Point;
        var coords = coordinates.join(' ');
        return templateRender(template, {
          coordinates: coords
        });
      }
    }, {
      key: "createMultiPoint",
      value: function createMultiPoint(coordinates) {
        var _this = this;

        var template = templates.MultiPoint;
        var points = [];
        coordinates.forEach(function (position) {
          points.push(_this.createPoint(position));
        });
        return templateRender(template, {
          points: points.join('')
        });
      }
    }, {
      key: "createLineString",
      value: function createLineString(coordinates) {
        var template = templates.LineString;
        var coords = coordinates.map(function (coord) {
          return "".concat(coord[0], " ").concat(coord[1]);
        }).join(' ');
        return templateRender(template, {
          coordinates: coords
        });
      }
    }, {
      key: "createMultiLineString",
      value: function createMultiLineString(coordinates) {
        var _this2 = this;

        var template = templates.MultiLineString;
        var lines = [];
        coordinates.forEach(function (lineCoords) {
          lines.push(_this2.createLineString(lineCoords));
        });
        return templateRender(template, {
          lines: lines.join('')
        });
      }
    }, {
      key: "createPolygon",
      value: function createPolygon(coordinates) {
        var template = templates.Polygon;
        var hasHole = coordinates.length > 1;
        var coords = coordinates[0].map(function (coord) {
          return "".concat(coord[0], " ").concat(coord[1]);
        }).join(' ');
        var data = {
          coordinates: coords,
          holes: ''
        };

        if (hasHole) {
          var holes = [];
          var holeTemplate = templates.Hole;

          for (var i = 1; i < coordinates.length; i++) {
            var _coords = coordinates[i].map(function (coord) {
              return "".concat(coord[0], " ").concat(coord[1]);
            }).join(' ');

            holes.push(templateRender(holeTemplate, {
              coordinates: _coords
            }));
          }

          data.holes = holes.join('');
        }

        return templateRender(template, data);
      }
    }, {
      key: "createMultiPolygon",
      value: function createMultiPolygon(coordinates) {
        var _this3 = this;

        var template = templates.MultiPloygon;
        var polygons = [];
        coordinates.forEach(function (polygonCoords) {
          polygons.push(_this3.createPolygon(polygonCoords));
        });
        return templateRender(template, {
          polygons: polygons.join('')
        });
      }
    }]);

    return GML;
  }();
  var templates = {
    Point: "<gml:Point>\n<gml:posList>{{ coordinates }}</gml:posList>\n</gml:Point>",
    MultiPoint: "<gml:MultiPoint>\n<gml:PointMembers>{{ points }}</gml:PointMemebers>\n</gml:MultiPoint>",
    LineString: "<gml:LineString>\n<gml:posList>{{ coordinates }}</gml:posList>\n</gml:LineString>",
    MultiLineString: "<gml:MultiString>\n<gml:LineStringMembers>{{ lines }}</gml:LineStringMembers>\n</gml:MultiString>",
    Polygon: "<gml:Polygon>\n<gml:exterior>\n<gml:LinearRing>\n<gml:posList>{{ coordinates }}</gml:posList>\n</gml:LinearRing>\n</gml:exterior>\n{{ holes }}\n</gml:Polygon>",
    Hole: "<gml:interior>\n<gml:LinearRing>\n<gml:posList>{{ coordinates }}</gml:posList>\n</gml:LinearRing>\n</gml:interior>",
    MultiPloygon: "<gml:MultiPolygon>\n<gml:PolygonMembers>{{ polygons }}</gml:PolygonMembers>\n</gml:MultiPolygon>"
  };

  var GeometryFilter =
  /*#__PURE__*/
  function (_WFSFilter) {
    _inherits(GeometryFilter, _WFSFilter);

    function GeometryFilter(geometryField, operator, geometry) {
      var _this;

      _classCallCheck(this, GeometryFilter);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GeometryFilter).call(this));
      _this.geometryField = geometryField;
      _this.operator = operator;
      _this.gml = new GML(geometry);
      return _this;
    }

    _createClass(GeometryFilter, [{
      key: "toString",
      value: function toString() {
        var data = {
          propertyName: this.geometryField,
          operator: this.operator,
          gml: this.gml.toString()
        };
        return templateRender(template$1, data);
      }
    }]);

    return GeometryFilter;
  }(WFSFilter);
  var template$1 = "<ogc:{{ operator }}>\n<ogc:PropertyName>{{ propertyName }}</ogc:PropertyName>\n{{ gml }}\n</ogc:{{ operator }}>";

  var PropertyFilter =
  /*#__PURE__*/
  function (_WFSFilter) {
    _inherits(PropertyFilter, _WFSFilter);

    function PropertyFilter(options) {
      var _this;

      _classCallCheck(this, PropertyFilter);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyFilter).call(this));

      switch (options.comparison) {
        case 'IsNull':
          break;

        case 'Between':
          _this.propertyValue = options.propertyValue;
          _this.secondValue = options.secondValue;
          break;

        default:
          _this.propertyValue = options.propertyValue;
      }

      _this.propertyName = options.propertyName;
      _this.comparison = options.comparison;
      return _this;
    }

    _createClass(PropertyFilter, [{
      key: "toString",
      value: function toString() {
        var comparison = comparisonList[this.comparison];
        var propertyName = this.propertyName;
        var data = {
          comparison: comparison,
          propertyName: propertyName,
          attributes: '',
          value: ''
        };

        switch (this.comparison) {
          case 'IsNull':
            break;

          case 'Between':
            data.value = templateRender(betweenValueTemplate, {
              value1: this.propertyValue,
              value2: this.secondValue
            });
            break;

          case 'Like':
            data.attributes = 'wildCard="*" singleChar="#" escapeChar="!"';
            data.value = templateRender(valueTemplate, {
              value: this.propertyValue
            });
            break;

          default:
            data.value = templateRender(valueTemplate, {
              value: this.propertyValue
            });
        }

        return templateRender(template$2, data);
      }
    }]);

    return PropertyFilter;
  }(WFSFilter);
  var template$2 = "<ogc:{{ comparison }} {{ attributes }}>\n<ogc:PropertyName>{{ propertyName }}</ogc:PropertyName>\n{{ value }}\n</ogc:{{ comparison }}>";
  var valueTemplate = "<ogc:Literal>{{ value }}</ogc:Literal>";
  var betweenValueTemplate = "<ogc:LowerBoundary>{{ value1 }}</ogc:LowerBoundary>\n<ogc:UpperBoundary>{{ value2 }}</ogc:UpperBoundary>";
  var comparisonList = {
    EQ: 'PropertyIsEqualTo',
    NotEQ: 'PropertyIsNotEqualTo',
    LT: 'PropertyIsLessThan',
    GT: 'PropertyIsGreaterThan',
    LEQ: 'PropertyIsLessThanOrEqualTo',
    GEQ: 'PropertyIsGreaterThanOrEqualTo',
    Like: 'PropertyIsLike',
    IsNull: 'PropertyIsNull',
    Between: 'PropertyIsBetween'
  };

  exports.WFS = WFS;
  exports.GeometryFilter = GeometryFilter;
  exports.PropertyFilter = PropertyFilter;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
