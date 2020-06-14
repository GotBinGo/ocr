import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-front',
  templateUrl: './dialog-front.component.html',
  styleUrls: ['./dialog-front.component.css']
})
export class DialogFrontComponent implements OnInit {

  @Input() image;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
