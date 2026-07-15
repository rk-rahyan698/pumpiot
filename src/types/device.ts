export type DeviceRelayState = 'ON' | 'OFF';

export type DeviceConnectionState = 'Online' | 'Offline';

export interface DeviceInfo {
  id: string;
  name: string;
  connectionState: DeviceConnectionState;
  relayState: DeviceRelayState;
}
