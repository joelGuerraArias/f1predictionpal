export interface Driver {
  id: number;
  name: string;
  number: string;
  team: string;
  teamLogo?: string;
  country: string;
  imageUrl: string;
}

export const drivers: Driver[] = [
  {
    id: 1,
    name: "Max Verstappen",
    number: "1",
    team: "Red Bull Racing",
    country: "NLD",
    imageUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png"
  },
  {
    id: 11,
    name: "Sergio Pérez",
    number: "11",
    team: "Red Bull Racing",
    country: "MEX",
    imageUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png"
  },
  {
    id: 16,
    name: "Charles Leclerc",
    number: "16",
    team: "Ferrari",
    country: "MON",
    imageUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png"
  },
  {
    id: 55,
    name: "Carlos Sainz",
    number: "55",
    team: "Ferrari",
    country: "ESP",
    imageUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png"
  },
  {
    id: 44,
    name: "Lewis Hamilton",
    number: "44",
    team: "Mercedes",
    country: "GBR",
    imageUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png"
  }
];