import fw = require('./IController');

export module Controllers{
	export class HomeController extends fw.MVC.Controllers.Controller{
		
		constructor(){
			super();
		}
		
		index(){
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