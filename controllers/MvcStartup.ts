///<reference path='../typings/express/express.d.ts'/>
///<reference path='../typings/doctrine/doctrine.d.ts'/>
///<reference path='../typings/extend/extend.d.ts'/>

import express = require('express');
import path = require('path');
import fs = require('fs');
import util = require('util');
import mc = require('./IController')
import extend = require('extend');
	
export module MVC{

	class HttpAction{
		constructor(method:EnumHttpMethod, name:string){
			this.Method = method;
			this.Name = name;
		}
		
		Method:EnumHttpMethod
		Name:string
		Route:string
		Parameters:string[]
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
		all,
		get,
		post// ='post'
	}
	
	// class RouterBag{
	// 	constructor(name:string, router:express.Router){
	// 		this.Name = name, this.Router= router;
	// 	}
		
	// 	Name:string;
	// 	Router:express.Router;
	// }
	
	export class MvcStartup{
				
		rend(viewName?:string, model?:{}){
			return (defaultValue:any, req:express.Request, res:express.Response, next:any)=>{
				viewName = viewName || defaultValue.defaultView;
				res.render(viewName, model);
			};
		}
						
		static registerAllControllers(dir:string, app:express.Express){
			
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
					return createHttpAction(EnumHttpMethod.get, url);
				},
				httpPost:function(url){
					return createHttpAction(EnumHttpMethod.post, url);
				}
			};
			
			//retrive actions from controller, parse comments 
			function getAllActions(obj, items:HttpAction[]){
				if(!obj) return;
				for(var p in obj){
                    if(typeof obj[p] === 'function'){
						if((/\w+Action$/g).test(p)){
							items.push(new HttpAction(EnumHttpMethod.all, p));
						}
						else{
							var body = (<any>obj[p]).toString();
							var regAction = /\/\*\!\s*@(\w+)\((.*?)\)\s*\*\//ig
							var regParameter = /function\s*\((.*)\)/ig
							var match:RegExpExecArray;
							var parameters=[];
							
							match=regParameter.exec(body);
							if(match!=null && match[1].length>0){
								parameters = match[1].split(',').map(s=>s.trim());
							}
							
							while((match = regAction.exec(body)) != null){
								if(match[1] && httpMap[match[1]]){
									var args = match[2].split(',').map(function(i:string){
										return i.trim().replace(/^('|")/, '').replace(/('|")$/, '');//remove quote
									});
									var action:HttpAction = httpMap[match[1]].apply(this, args)(p);
									action.Parameters = parameters;
									items.push(action);
								}
							}
						}
                    }
				}
			}
			
			fs.readdirSync(dir).forEach(function(p){
				if((/\w{2,}Controller\.js$/ig).test(p)){
					var m = require(path.join(dir, p));
					var ctrls: HttpController[] = [];
					getControllers(m, ctrls);
					
					ctrls.forEach(ctrl=>{
						var target = <mc.MVC.Controllers.Controller>(new (<any>(ctrl.Func))());
						var actions:HttpAction[] = [];
						getAllActions(target, actions);
						actions.forEach(action=>{
							app[EnumHttpMethod[action.Method]]((action.Route || (ctrl.Name + '/' + action.Name)), function(req:express.Request, res:express.Response, next:any){
								var dicValues:{[name:string]:any}={};
								var reqParams:any = {};
								extend(reqParams, req.params||{});
								extend(reqParams, req.query||{});
								if(!reqParams.req) reqParams.req=req;
								if(!reqParams.res) reqParams.res=res;
								if(!reqParams.next) reqParams.next=next;
								action.Parameters.forEach((n:string)=>{
									var value = undefined;
									if(reqParams[n]){
										value = reqParams[n];
									}
									dicValues[n] = value;
								});
								
								var temp=[];//temp values for concat js invoke statement, if can invoke by 'apply' or 'call', can delete this
								for(var name in dicValues){
									var v=dicValues[name];
									if(typeof v === 'undefined' || v == null)
										temp.push('undefined');
									else if(typeof v === 'string')
										temp.push('"'+v+'"');
									else if (typeof v == 'object')
										temp.push(name);
									else
										temp.push(v);
								}
								var js=temp.join(', ');
								js = '(target[action.Name])('+ (js&&js.length>0 ? js + ', ' : '') +'req, res, next)';
								
								var actionResult = eval(js);//(target[action.Name]).apply(null, values)
								actionResult && actionResult({
									defaultView:ctrl.Name + '/' + action.Name
								}, req, res, next);
							});
						});
					})

				}
			})
		}
	}
}

