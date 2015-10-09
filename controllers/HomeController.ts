import fw = require('./IController');
import express = require('express');

export module Controllers{
	export class HomeController extends fw.MVC.Controllers.Controller{
		
		constructor(){
			super();
		}
		
		index(id, q, req:express.Request, res:express.Response){
			/*! @httpGet('/:id') */
			return super.rend(null, {
				name:'aspark'+id+q//http://localhost:3000/3?q=1
			});
			
			//res.send("abc");
		}
		
		OtherAction(){
			/*! @httpPost() */
			return super.rend();
		}
	}
	

}