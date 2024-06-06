

import {useLocation} from "react-router-dom";


export const usePath = (pathName:string) => {

    const {pathname} = useLocation();

	let isDone: boolean = false;
    
	if(pathname.replace('/', '') === pathName) {
		isDone = true;
	}
    
	return isDone;
	
}
