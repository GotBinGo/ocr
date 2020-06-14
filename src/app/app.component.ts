import {Component, OnInit, HostListener, ViewChild} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { MatDialog } from '@angular/material/dialog';
import { DialogFrontComponent } from './dialog-front/dialog-front.component';
import { MatStepper } from '@angular/material/stepper';

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

  @ViewChild('stepper') private myStepper: MatStepper;

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
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
      if (!this.firstResult || this.firstResult.err) {
        this.firstResult = result;
        
        setTimeout(x => {
          if (result && !this.firstResult.err) {
            this.myStepper.next();
          }
        });
      } else if (!this.secondResult || this.secondResult.err) {
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