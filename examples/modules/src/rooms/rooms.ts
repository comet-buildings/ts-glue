type Room = {
  id: string;
  name: string;
  capacity: number;
};
export type RoomsReferentialClient = {
  findAll: () => Promise<Room[]>;
};
