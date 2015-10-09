
import base = require('./IController');

export module Controllers{
	export class HomeController extends base.Controllers.Controller{
		
		constructor(){
			super();
		}
		
		index(){
			/*! @httpGet('/') */
			super.rend();
		}
		
		OtherAction(){
			/*! @httpPost() */
			super.rend();
		}
	}
	

}