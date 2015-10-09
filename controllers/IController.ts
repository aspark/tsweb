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
		constructor(method:EnumHttpMethod, name:string){
			this.Method = method;
			this.Name = name;
		}
		
		Method:EnumHttpMethod
		Name:string
		Route:string
		// Controller:HttpController
	}
	
	class HttpController{
		constructor(name:string, controller:Function){
			this.Name = name;
			this.Func = controller;
		}
		
		Name:string;
		Func:Function
	}
	
	enum EnumHttpMethod{
		All,
		Get,
		Post
	}
	
	class RouterBag{
		constructor(name:string, router:express.Router){
			this.Name = name, this.Router= router;
		}
		
		Name:string;
		Router:express.Router;
	}
	
	export class Controller implements IController{
		
		// private _actions:HttpAction[] = [];
		
		rend(viewName?:string, model?:{}){
			console.log(this);
		}
				
		// action(method:string, target: Function, route?:string) {
		// 	this._actions.push(new HttpAction(method, target.toString()))
		// }
				
		static getAllRoutes(dir:string):RouterBag[]{
			
			//get controller function from the obj
            function getControllers(obj, items:HttpController[]) {
                if(!obj) return;
                for (var p in obj) {
					var reg = /(\w+)Controller$/ig;
					var match = reg.exec(p);
                    if(typeof obj[p] === 'function' && match!=null){
                        items.push(new HttpController(match[1], obj[p]));
                    }
                    else{
                        getControllers(obj[p], items)
                    }
                }
            }
			
			function createHttpAction(method:EnumHttpMethod, url){
				return (function(name:string):HttpAction{
					var action= new HttpAction(method, name);
					action.Route=url;
					return action; 
				});
			}
			
			var httpMap:{[name:string]:(url:any)=>((name:string)=>HttpAction)} = {
				httpGet:function(url){
					return createHttpAction(EnumHttpMethod.Get, url);
				},
				httpPost:function(url){
					return createHttpAction(EnumHttpMethod.Post, url);
				}
			};
			
			//retrive actions from controller, parse comments 
			function getAllActions(obj, items:HttpAction[]){
				if(!obj) return;
				for(var p in obj){
                    if(typeof obj[p] === 'function'){
						if((/\w+Action$/g).test(p)){
							items.push(new HttpAction(EnumHttpMethod.All, p));
						}
						else{
							var body = (<any>obj[p]).toString();
							var reg = /\/\*\!\s*@(\w+)\((.*?)\)\s*\*\//ig
							var match:RegExpExecArray;
							while((match = reg.exec(body)) != null){
								if(match[1] && httpMap[match[1]]){
									var args = match[2].split(',').map(function(i:string){
										return i.replace(/^('|")/, '').replace(/('|")$/, '');//remove quote
									});
									var action:HttpAction = httpMap[match[1]].apply(this, args)(p);
									items.push(action);
								}
							}
						}
                    }
				}
			}
			
			var routers : RouterBag[] = [];
			fs.readdirSync(dir).forEach(function(p){
				if((/\w{2,}Controller\.js$/ig).test(p)){
					var m = require(path.join(dir, p));
					var ctrls: HttpController[] = [];
					getControllers(m, ctrls);
					
					ctrls.forEach(ctrl=>{
						var router = express.Router();
						var target = <Controller>(new (<any>(ctrl.Func))());
						var actions:HttpAction[] = [];
						getAllActions(target, actions);
						actions.forEach(action=>{
							router.get(action.Route||action.Name, function(req:express.Request, res:express.Response){
								var result = target[action.Name]()
								res.json({demo:action.Name});
							});
						});
						
						routers.push(new RouterBag('/'+ctrl.Name, router));
					})

				}
			})
			
			return routers;
		}
	}
}

