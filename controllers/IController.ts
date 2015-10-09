///<reference path='../typings/express/express.d.ts'/>
///<reference path='../typings/doctrine/doctrine.d.ts'/>

import express = require('express');
import path = require('path');
import fs = require('fs');
import util = require('util');
	
export module MVC.Controllers{
	export interface IController{
		rend();
	}
	
	export class Controller implements IController{
				
		rend(viewName?:string, model?:{}){
			return (defaultValue:any, req:express.Request, res:express.Response, next:any)=>{
				viewName = viewName || defaultValue.defaultView;
				res.render(viewName, model);
			};
		}
	}
}

