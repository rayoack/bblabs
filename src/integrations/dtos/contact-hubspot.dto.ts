export interface ContactHubspotEvent extends ContactHubspot {
  token: string;
}
export interface ContactHubspot {
  challengeName?: string;
  squadName?: string;
  professionalType?: string;
  isCreator?: boolean;
}
