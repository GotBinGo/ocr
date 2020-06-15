import {Component, OnInit, HostListener, ViewChild} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { MatDialog } from '@angular/material/dialog';
import { DialogFrontComponent } from './dialog-front/dialog-front.component';
import { MatStepper } from '@angular/material/stepper';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLinear = true;
  firstResult = null;
  secondResult = null;
  thirdResult = null; 
  selectedIndex = 0;

  @ViewChild('stepper') private myStepper: MatStepper;

  stepChange(e) {
    this.selectedIndex = e.selectedIndex;
  }
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 1920},
    height: {ideal: 1080},
    facingMode: 'environment'
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public width: number;
  public height: number;

  reset() {
    this.firstResult = false;
    this.secondResult = false;
    this.thirdResult = false;
    this.myStepper.reset()
  }

  save() {
    var zip = new JSZip();
    let front = JSON.parse(JSON.stringify(this.firstResult));
    let back = JSON.parse(JSON.stringify(this.secondResult));
    delete front.detected_image;
    delete back.detected_image;
    zip.file("front.txt", JSON.stringify(front));
    zip.file("back.txt", JSON.stringify(back));
    var img = zip.folder("images");
    img.file("front.png", this.firstResult.detected_image, {base64: true});
    img.file("back.png", this.secondResult.detected_image, {base64: true});
    zip.generateAsync({type:"blob"})
    .then(function(content) {
      saveAs(content, "card.zip");
    });
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    this.width = win.innerWidth;
    this.height = win.innerHeight;
    if(this.height > 600) {
      this.height = 600;
    }
  }

  constructor(public dialog: MatDialog) {
    this.onResize();
  }


  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    // console.log(this.webcamImage.imageAsDataUrl)
    const dialogRef = this.dialog.open(DialogFrontComponent, {
      width: '80%',
      maxWidth: '1000px',
      data: { image: this.webcamImage.imageAsDataUrl},
      disableClose: true,
      backdropClass: 'blur-bg',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.selectedIndex == 0) {
        this.firstResult = result;
        setTimeout(x => {
          if (result && !this.firstResult.err) {
            this.myStepper.next();
          }
        });
      } else if (this.selectedIndex == 1) {
        this.secondResult = result;
        setTimeout(x => {
          if (result && !this.secondResult.err) {
            this.myStepper.next();
          }
        });
        this.thirdResult = result;
      }

    });
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
}