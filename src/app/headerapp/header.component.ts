import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = 'devcom';
}



/*import { Component, OnInit } from '@angular/core';
//import { FirebaseLoginService } from './../firebase/firebase.login.service'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {

    private Login: any
    public control = {
        state: false
    }

    ngOnInit() {

        /*this.Login.check((state: any)=> {
            this.control.state = state
        })
    }

    /*constructor(Login: FirebaseLoginService) { 
        
        //this.Login = Login

    }

    

    public logOut() {
        this.Login.denied()
    }
    

}
*/
