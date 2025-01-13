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
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/VERSTAPPEN.jpg"
  },
  {
    id: 11,
    name: "Sergio Pérez",
    number: "11",
    team: "Red Bull Racing",
    country: "MEX",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/PEREZ.jpg"
  },
  {
    id: 16,
    name: "Charles Leclerc",
    number: "16",
    team: "Ferrari",
    country: "MON",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/LECLERC.jpg"
  },
  {
    id: 55,
    name: "Carlos Sainz",
    number: "55",
    team: "Ferrari",
    country: "ESP",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/SAINZ.jpg"
  },
  {
    id: 44,
    name: "Lewis Hamilton",
    number: "44",
    team: "Mercedes",
    country: "GBR",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/HAMILTON.jpg"
  },
  {
    id: 63,
    name: "George Russell",
    number: "63",
    team: "Mercedes",
    country: "GBR",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/RUSSELL.jpg"
  },
  {
    id: 4,
    name: "Lando Norris",
    number: "4",
    team: "McLaren",
    country: "GBR",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/NORRIS.jpg"
  },
  {
    id: 81,
    name: "Oscar Piastri",
    number: "81",
    team: "McLaren",
    country: "AUS",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/PIASTRI.jpg"
  },
  {
    id: 14,
    name: "Fernando Alonso",
    number: "14",
    team: "Aston Martin",
    country: "ESP",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/ALONSO.jpg"
  },
  {
    id: 18,
    name: "Lance Stroll",
    number: "18",
    team: "Aston Martin",
    country: "CAN",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/STROLL.jpg"
  },
  {
    id: 10,
    name: "Pierre Gasly",
    number: "10",
    team: "Alpine",
    country: "FRA",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/GASLY.jpg"
  },
  {
    id: 31,
    name: "Esteban Ocon",
    number: "31",
    team: "Alpine",
    country: "FRA",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/OCON.jpg"
  },
  {
    id: 23,
    name: "Alexander Albon",
    number: "23",
    team: "Williams",
    country: "THA",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/ALBON.jpg"
  },
  {
    id: 2,
    name: "Logan Sargeant",
    number: "2",
    team: "Williams",
    country: "USA",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/SARGEANT.jpg"
  },
  {
    id: 27,
    name: "Nico Hülkenberg",
    number: "27",
    team: "Haas",
    country: "GER",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/HULKEMBERG.jpg"
  },
  {
    id: 20,
    name: "Kevin Magnussen",
    number: "20",
    team: "Haas",
    country: "DNK",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/MAGNUSSEN.jpg"
  },
  {
    id: 77,
    name: "Valtteri Bottas",
    number: "77",
    team: "Kick Sauber",
    country: "FIN",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/BOTTAS.jpg"
  },
  {
    id: 24,
    name: "Zhou Guanyu",
    number: "24",
    team: "Kick Sauber",
    country: "CHN",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/ZHOU.jpg"
  },
  {
    id: 22,
    name: "Yuki Tsunoda",
    number: "22",
    team: "RB",
    country: "JPN",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/TSUNODA.jpg"
  },
  {
    id: 3,
    name: "Daniel Ricciardo",
    number: "3",
    team: "RB",
    country: "AUS",
    imageUrl: "https://fgjpullzone.b-cdn.net/f1/caras%20pilotos/RICCIARDO.jpg"
  }
];