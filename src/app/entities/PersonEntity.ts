//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
export class PersonEntity {
  id: string;
  prename: string;
  lastname: string;
  email: string;
  phoneNumber: string;

  constructor(id?: number) {
    if (id) {
      this.id = id.toString();
    }
  }
}
