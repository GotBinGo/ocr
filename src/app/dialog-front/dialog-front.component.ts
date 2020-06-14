import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-dialog-front',
  templateUrl: './dialog-front.component.html',
  styleUrls: ['./dialog-front.component.css']
})
export class DialogFrontComponent implements OnInit {

  @Input() image;

  detected = null;
  loading = true;

  constructor(public dialogRef: MatDialogRef<any>, private serverService: ServerService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.serverService.sendImage(this.data.image).subscribe(x => {
      this.detected = x;
    }, x => {
      this.loading = false;
      this.detected = {err: "DETECTION ERROR"}
    });
  }

  ok() {
    this.dialogRef.close(this.detected);
  }

  retake() {
    this.dialogRef.close(this.detected);
  }

}
