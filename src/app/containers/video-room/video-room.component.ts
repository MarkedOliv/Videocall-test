import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { first } from 'rxjs/operators';

import { Devices, WebrtcService } from 'janus-angular';

import { DevicesModalComponent } from '../../components/devices-modal/devices-modal.component';
import { JanusServerModalComponent } from '../../components/janus-server-modal/janus-server-modal.component';

import { MatDialog } from '@angular/material/dialog';


import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-video-room',
  templateUrl: './video-room.component.html',
  styleUrls: ['./video-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      state('open', style({
        bottom: '0',
      })),
      state('closed', style({
        bottom: '-160px',
      })),
      transition('open => closed', [
        animate(250)
      ]),
      transition('closed => open', [
        animate(100)
      ]),
    ]),
  ]
})
export class VideoRoomComponent implements OnInit {

  isMuted = false;
  // roomId = 1234;
  // wsUrl = 'wss://janus.conf.meetecho.com/ws';
  roomId = 1234;
  wsUrl = 'ws://149.28.39.85:8188';
  httpUrl: string;
  pin: string;

  dockOpen = false;
  moveTimeout: any;
  devices: Devices;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private webrtc: WebrtcService,
    private dialog: MatDialog,
  ){}

  async ngOnInit(): Promise<void> {
    this.devices = await this.webrtc.getDefaultDevices();
  }

  hideDock(): void { this.dockOpen = false; }
  startDockTimer(): void {
    const instance = this;
    this.dockOpen = true;
    if (this.moveTimeout) {
      clearTimeout(this.moveTimeout);
    }

    this.moveTimeout = setTimeout(() => {
      this.dockOpen = false;
      this.changeDetector.detectChanges();
    }, 3000);
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  onOpenDevices(): void {
    const dialogRef = this.dialog.open(DevicesModalComponent, {
      width: '360px',
      data: this.devices
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result: Devices) => {
      if (result) {
        this.devices = result;
        this.changeDetector.detectChanges();
      }
    });
  }

  onOpenServer(): void {
    const dialogRef = this.dialog.open(JanusServerModalComponent, {
      width: '360px',
      data: {url: this.wsUrl, roomId: this.roomId, pin: this.pin}
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if (result) {
        this.wsUrl = result.wsUrl;
        this.httpUrl = result.httpUrl;
        this.roomId = result.roomId;
        this.pin = result.pin;
      }
    });
  }

  onError(error: {code: number, message: string}): void {
    window.alert('Error: ' + error.message);
  }
}
