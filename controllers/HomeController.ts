
import base = require('./IController');

export module Controllers{
	export class HomeController extends base.Controllers.Controller{
		
		constructor(){
			super();
		}
		
		initActions(){
			super.action('get', this.index);
		}
		
		/*! @httpget() */
		index(){

			super.rend();
		}
	}
	

}