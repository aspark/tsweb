var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base = require('./IController');
var Controllers;
(function (Controllers) {
    var HomeController = (function (_super) {
        __extends(HomeController, _super);
        function HomeController() {
            _super.call(this);
        }
        HomeController.prototype.initActions = function () {
            _super.prototype.action.call(this, 'get', this.index);
        };
        /*! @httpget() */
        HomeController.prototype.index = function () {
            _super.prototype.rend.call(this);
        };
        return HomeController;
    })(base.Controllers.Controller);
    Controllers.HomeController = HomeController;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
//# sourceMappingURL=HomeController.js.map