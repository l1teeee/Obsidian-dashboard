export type ChannelId = 'ig' | 'li' | 'fb';

export interface Channel {
  id:    ChannelId;
  label: string;
  color: string;
}
