///<reference path='../typings/express/express.d.ts'/>
///<reference path='../typings/doctrine/doctrine.d.ts'/>

import express = require('express');
import path = require('path');
import fs = require('fs');
// import doctrine = require('doctrine');
	
export module Controllers{
	export interface IController{
		rend();
	}
	
	class HttpAction{
		constructor(method:string, name:string){
			
		}
		
		Method:string
		Name:string
		Route:string
		// Target:Function
	}
	
	class RouterBag{
		constructor(name:string, router:express.Router){
			this.Name = name, this.Router= router;
		}
		
		Name:string;
		Router:express.Router;
	}
	
	export class Controller implements IController{
		
		private _actions:HttpAction[] = [];
		
		rend(){
			console.log(this);
		}
				
		initActions(){}
				
		action(method:string, target: Function, route?:string) {
			this._actions.push(new HttpAction(method, target.toString()))
		}
				
		static getAllRoutes(dir:string):RouterBag[]{
			
            function getControllers(obj, func:Function[]) {
                // func = func || [];
                for (var p in obj) {
                    if(typeof obj[p] === 'function' && (/\w+Controller$/ig).test(p)){
                        func.push(obj[p])
                    }
                    else{
                        getControllers(obj[p], func)
                    }
                }
            }
			
			var routers : RouterBag[] = [];
			fs.readdirSync(dir).forEach(function(p){
				console.log(p);
				if((/\w{2,}Controller\.\w+$/ig).test(p)){
					var m = require(path.join(dir, p));
					var ctrls: Function[] = [];
					getControllers(m, ctrls);
					
					ctrls.forEach(c=>{
						var router = express.Router();
						var ctrl = <Controller>(new (<any>c)());
						ctrl.initActions();
						ctrl._actions.forEach(rt=>{
							router.get('/', function(req:express.Request,res:express.Response){
								// rt.Method
								res.json({demo:true});
							})
						});
						
						routers.push(new RouterBag(p, router));
					})

				}
			})
			
			return routers;
		}
	}
}

