import { Component, OnInit, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
 
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit():void { }

  toggleSideBar(){
    this.toggleSideBarForMe.emit();
  }

  
}
