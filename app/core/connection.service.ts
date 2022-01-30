import { Injectable, EventEmitter, NgZone } from "@angular/core";

import { HubConnectionBuilder } from "@microsoft/signalr";
import { TestAttendeeAc } from "app/reports/testAttendeeAc";

// This service is used as a middleware of the communication between clinet ans server hub in real time
@Injectable()
export class ConnectionService {
  hubConnection: signalR.HubConnection;
  isConnected: boolean;
  forceClose!: boolean;

  public recievedAttendee: EventEmitter<TestAttendeeAc>;
  public recievedAttendeeId: EventEmitter<any>;
  public recievedEstimatedEndTime: EventEmitter<any>;

  constructor(private _zone: NgZone) {
    this.recievedAttendee = new EventEmitter<TestAttendeeAc>();
    this.recievedAttendeeId = new EventEmitter<any>();
    this.recievedEstimatedEndTime = new EventEmitter<any>();
    // makes a connection with hub
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("/TrappistHub")
      .build();
    this.registerProxy();
    this.isConnected = false;
  }
  // This method defines that what action should be taken when getReport and getRequest methods are invoked from the TrappistHub
  registerProxy() {
    this.hubConnection.on("getReport", (testAttendee: TestAttendeeAc) => {
      this._zone.run(() => this.recievedAttendee.emit(testAttendee));
    });
    this.hubConnection.on("getAttendeeIdWhoRequestedForResumeTest", (id) => {
      this._zone.run(() => this.recievedAttendeeId.emit(id));
    });
    this.hubConnection.on("setEstimatedEndTime", (remainingTime) => {
      this._zone.run(() => this.recievedEstimatedEndTime.emit(remainingTime));
    });
    this.hubConnection.onclose(() => {
      this.isConnected = false;
      if (!this.forceClose) void this.startConnection();
    });
  }

  // starts the connection between hub and client
  async startConnection(_callback?: () => Promise<void>) {
    if (!this.isConnected) {
      // makes a connection with hub
      this.hubConnection = new HubConnectionBuilder()
        .withUrl("/TrappistHub")
        .build();
      this.registerProxy();
      await this.hubConnection.start();
      this.isConnected = true;
      if (_callback) await _callback();
    }
  }

  async stopConnection(_callback?: () => void) {
    if (this.isConnected) {
      await this.hubConnection.stop();
      this.isConnected = false;
      this.forceClose = true;
      if (_callback) _callback();
      console.log("Stopped");
    }
  }

  isHubConnected() {
    return this.isConnected;
  }

  // This method sends the testAttendee object to the hub method SendReport
  async sendReport(testAttendee) {
    await this.hubConnection.invoke("sendReport", testAttendee);
  }
  // Sends the id of candidate to the hub method sendRequest
  async sendCandidateIdWhoRequestedForResumeTest(attendeeId: number) {
    await this.hubConnection.invoke(
      "sendCandidateIdWhoRequestedForResumeTest",
      attendeeId
    );
  }

  getReport(testAttendee: TestAttendeeAc) {
    return testAttendee;
  }

  getAttendeeIdWhoRequestedForResumeTest(attendeeId: number) {
    return attendeeId;
  }

  async registerAttendee(id: number) {
    await this.hubConnection.invoke("registerAttendee", id);
  }

  async addTestLogs(id: number) {
    await this.hubConnection.invoke("addTestLogs", id);
  }

  async updateExpectedEndTime(seconds: number, testId: number) {
    await this.hubConnection.invoke("GetExpectedEndTime", seconds, testId);
  }

  setEstimatedEndTime(time: Date) {
    return time;
  }

  async joinAdminGroup() {
    await this.hubConnection.invoke("JoinAdminGroup");
  }
}
