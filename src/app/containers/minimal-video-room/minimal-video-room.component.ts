import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-minimal-video-room',
  templateUrl: './minimal-video-room.component.html',
  styleUrls: ['./minimal-video-room.component.scss']
})
export class MinimalVideoRoomComponent implements OnInit {

  roomId = 1234;
  wsUrl = 'ws://149.28.39.85:8188';

  constructor() { }

  ngOnInit(): void {
  }

}
