///<reference path='../typings/express/express.d.ts'/>
///<reference path='../typings/doctrine/doctrine.d.ts'/>
var express = require('express');
var path = require('path');
var fs = require('fs');
var Controllers;
(function (Controllers) {
    var HttpAction = (function () {
        function HttpAction(method, name) {
        }
        return HttpAction;
    })();
    var RouterBag = (function () {
        function RouterBag(name, router) {
            this.Name = name, this.Router = router;
        }
        return RouterBag;
    })();
    var Controller = (function () {
        function Controller() {
            this._actions = [];
        }
        Controller.prototype.rend = function () {
            console.log(this);
        };
        Controller.prototype.initActions = function () { };
        Controller.prototype.action = function (method, target, route) {
            this._actions.push(new HttpAction(method, target.toString()));
        };
        Controller.getAllRoutes = function (dir) {
            function getControllers(obj, func) {
                for (var p in obj) {
                    if (typeof obj[p] === 'function' && (/\w+Controller$/ig).test(p)) {
                        func.push(obj[p]);
                    }
                    else {
                        getControllers(obj[p], func);
                    }
                }
            }
            var routers = [];
            fs.readdirSync(dir).forEach(function (p) {
                console.log(p);
                if ((/\w{2,}Controller\.\w+$/ig).test(p)) {
                    var m = require(path.join(dir, p));
                    var ctrls = [];
                    getControllers(m, ctrls);
                    ctrls.forEach(function (c) {
                        var router = express.Router();
                        var ctrl = (new c());
                        ctrl.initActions();
                        ctrl._actions.forEach(function (rt) {
                            router.get('/', function (req, res) {
                                res.json({ demo: true });
                            });
                        });
                        routers.push(new RouterBag(p, router));
                    });
                }
            });
            return routers;
        };
        return Controller;
    })();
    Controllers.Controller = Controller;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
//# sourceMappingURL=IController.js.map