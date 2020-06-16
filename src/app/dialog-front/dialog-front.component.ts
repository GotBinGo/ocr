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

  displayedColumns: string[] = ['name', 'value'];
  dataSource = [
  ];

  constructor(public dialogRef: MatDialogRef<any>, private serverService: ServerService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.serverService.sendImage(this.data.image, this.data.card_type).subscribe((x: any) => {
      this.detected = x;
      this.dataSource = [];
      if(x.card_type == 'CardType.ID_CARD_FRONT') {
        this.dataSource.push({name: 'Név', value: x.full_name})
        this.dataSource.push({name: 'Kártya típus', value: 'IDCardType.OLD_CARD'})
      } else if (x.card_type == 'CardType.ID_CARD_BACK') {
        this.dataSource.push({name: 'Név', value: x.mrz.full_name})
        this.dataSource.push({name: 'Születési idő', value: x.mrz.birth_date})
        this.dataSource.push({name: 'Okmányazonosító', value: x.mrz.id_code})
        this.dataSource.push({name: 'Állampolgárság', value: x.mrz.nationality})
      } else if(x.card_type == 'CardType.ADDRESS_CARD') {
        this.dataSource.push({name: 'Kártya száma', value: x.card_number})
        this.dataSource.push({name: 'Cím első sora', value: x.address_line_1})
        this.dataSource.push({name: 'Cím második sora', value: x.address_line_2})
        this.dataSource.push({name: 'Cím harmadik sora', value: x.address_line_3})

      }
      
    }, x => {
      this.loading = false;
      this.detected = x.error;
    });
  }

  ok() {
    this.dialogRef.close(this.detected);
  }

  retake() {
    this.dialogRef.close(false);
  }

}
