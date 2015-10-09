import fw = require('./IController');
import express = require('express');

export module Controllers{
	export class HomeController extends fw.MVC.Controllers.Controller{
		
		constructor(){
			super();
		}
		
		index(req:express.Request, res:express.Response){
			/*! @httpGet('/') */
			return super.rend(null, {
				name:'aspark'
			});
		}
		
		OtherAction(){
			/*! @httpPost() */
			return super.rend();
		}
	}
	

}