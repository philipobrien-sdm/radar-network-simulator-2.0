import { Airport, SensorType } from './types';

// Data for major European airports, loaded from user-provided data.
// Note: Elevation and runway data are set to defaults as they were not in the source data.
// Note: Obvious longitude errors (missing negative signs) have been corrected.
export const AIRPORTS_BY_COUNTRY: Record<string, Airport[]> = {
  'GB': [
    { name: "Belfast City Airport", icao: "EGAC", passengers: 1537243, lat: 54.6186, lon: -5.87759, country: 'GB', elevation: 0, runways: [90, 270] },
    { name: "Belfast International Airport", icao: "EGAA", passengers: 6137279, lat: 54.6567, lon: -6.21379, country: 'GB', elevation: 0, runways: [90, 270] },
    { name: "City of Derry Airport", icao: "EGAE", passengers: 105128, lat: 55.0425, lon: -7.16244, country: 'GB', elevation: 0, runways: [90, 270] }
  ],
  'IE': [
    { name: "Shannon Airport", icao: "EINN", passengers: 1771804, lat: 52.6882, lon: -8.91849, country: 'IE', elevation: 0, runways: [90, 270] },
    { name: "Cork Airport", icao: "EICK", passengers: 3090623, lat: 51.8427, lon: -8.49122, country: 'IE', elevation: 0, runways: [90, 270] },
    { name: "Dublin Airport", icao: "EIDW", passengers: 34057999, lat: 53.4213, lon: -6.27007, country: 'IE', elevation: 0, runways: [90, 270] },
    { name: "Ireland West Airport Knock", icao: "EIKN", passengers: 765961, lat: 53.9103, lon: -8.81831, country: 'IE', elevation: 0, runways: [90, 270] }
  ],
  'MT': [
    { name: "Malta International Airport", icao: "LMML", passengers: 7670986, lat: 35.8575, lon: 14.4774, country: 'MT', elevation: 0, runways: [90, 270] }
  ],
  'PL': [
    { name: "Gdańsk Lech Wałęsa Airport", icao: "EPGD", passengers: 5834827, lat: 54.3776, lon: 18.4662, country: 'PL', elevation: 0, runways: [90, 270] },
    { name: "Kraków John Paul II International Airport", icao: "EPKK", passengers: 8937013, lat: 50.0805, lon: 19.7848, country: 'PL', elevation: 0, runways: [90, 270] },
    { name: "Katowice International Airport", icao: "EPKT", passengers: 4901594, lat: 50.4746, lon: 19.0802, country: 'PL', elevation: 0, runways: [90, 270] },
    { name: "Poznań-Ławica Airport", icao: "EPPO", passengers: 2889600, lat: 52.4137, lon: 16.829, country: 'PL', elevation: 0, runways: [90, 270] },
    { name: "Rzeszów-Jasionka Airport", icao: "EPRZ", passengers: 1118182, lat: 50.109, lon: 22.019, country: 'PL', elevation: 0, runways: [90, 270] },
    { name: "Szczecin-Goleniów \"Solidarność\" Airport", icao: "EPSC", passengers: 414271, lat: 53.5855, lon: 14.9084, country: 'PL', elevation: 0, runways: [90, 270] },
    { name: "Warsaw Chopin Airport", icao: "EPWA", passengers: 18398433, lat: 52.1658, lon: 20.9672, country: 'PL', elevation: 0, runways: [90, 270] },
    { name: "Wrocław–Copernicus Airport", icao: "EPWR", passengers: 3873420, lat: 51.1026, lon: 16.8858, country: 'PL', elevation: 0, runways: [90, 270] },
    { name: "Lublin Airport", icao: "EPLB", passengers: 476778, lat: 51.2336, lon: 22.7169, country: 'PL', elevation: 0, runways: [90, 270] }
  ],
  'DK': [
    { name: "Aalborg Airport", icao: "EKYT", passengers: 1528646, lat: 57.1088, lon: 9.84917, country: 'DK', elevation: 0, runways: [90, 270] },
    { name: "Aarhus Airport", icao: "EKAH", passengers: 448135, lat: 56.3023, lon: 10.6128, country: 'DK', elevation: 0, runways: [90, 270] },
    { name: "Billund Airport", icao: "EKBI", passengers: 3535266, lat: 55.7402, lon: 9.152, country: 'DK', elevation: 0, runways: [90, 270] },
    { name: "Copenhagen Airport", icao: "EKCH", passengers: 29740150, lat: 55.6179, lon: 12.6556, country: 'DK', elevation: 0, runways: [90, 270] },
    { name: "Esbjerg Airport", icao: "EKEB", passengers: 60017, lat: 55.5262, lon: 8.55294, country: 'DK', elevation: 0, runways: [90, 270] },
    { name: "Karup Airport", icao: "EKKA", passengers: 12235, lat: 56.3015, lon: 9.12579, country: 'DK', elevation: 0, runways: [90, 270] },
    { name: "Sonderborg Airport", icao: "EKSB", passengers: 29113, lat: 54.9659, lon: 9.79222, country: 'DK', elevation: 0, runways: [90, 270] },
    { name: "Odense Airport", icao: "EKOD", passengers: 2908, lat: 55.4764, lon: 10.3308, country: 'DK', elevation: 0, runways: [90, 270] }
  ],
  'IS': [
    { name: "Keflavik International Airport", icao: "BIKF", passengers: 7996384, lat: 63.985, lon: -22.6056, country: 'IS', elevation: 0, runways: [90, 270] }
  ],
  'HU': [
    { name: "Budapest Ferenc Liszt International Airport", icao: "LHBP", passengers: 14872990, lat: 47.4628, lon: 19.256, country: 'HU', elevation: 0, runways: [90, 270] },
    { name: "Debrecen International Airport", icao: "LHDC", passengers: 451528, lat: 47.4984, lon: 21.6192, country: 'HU', elevation: 0, runways: [90, 270] }
  ],
  'EE': [
    { name: "Tallinn Airport", icao: "EETN", passengers: 3183578, lat: 59.4168, lon: 24.8328, country: 'EE', elevation: 0, runways: [90, 270] },
    { name: "Tartu Airport", icao: "EETU", passengers: 17697, lat: 58.3074, lon: 26.6908, country: 'EE', elevation: 0, runways: [90, 270] }
  ],
  'ES': [
    { name: "Málaga Airport", icao: "LEMG", passengers: 20689914, lat: 36.6749, lon: -4.4991, country: 'ES', elevation: 0, runways: [90, 270] }, // Corrected Lat/Lon
    { name: "Barcelona International Airport", icao: "LEBL", passengers: 54622159, lat: 41.2971, lon: 2.07833, country: 'ES', elevation: 0, runways: [90, 270] }
  ],
  'SK': [
    { name: "Bratislava Airport", icao: "LZIB", passengers: 1968875, lat: 48.1702, lon: 17.2127, country: 'SK', elevation: 0, runways: [90, 270] },
    { name: "Košice International Airport", icao: "LZKZ", passengers: 563428, lat: 48.6631, lon: 21.2415, country: 'SK', elevation: 0, runways: [90, 270] },
    { name: "Poprad-Tatry Airport", icao: "LZTT", passengers: 64190, lat: 49.0713, lon: 20.2419, country: 'SK', elevation: 0, runways: [90, 270] }
  ],
  'NO': [
    { name: "Oslo Gardermoen Airport", icao: "ENGM", passengers: 29555171, lat: 60.1939, lon: 11.1004, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Bergen Airport, Flesland", icao: "ENBR", passengers: 7028405, lat: 60.2933, lon: 5.22415, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Stavanger Airport, Sola", icao: "ENZV", passengers: 3787754, lat: 58.8821, lon: 5.62534, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Trondheim Airport, Værnes", icao: "ENVA", passengers: 3668858, lat: 63.4578, lon: 10.924, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Kristiansand Airport, Kjevik", icao: "ENCN", passengers: 809653, lat: 58.2045, lon: 8.08405, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Tromsø Airport, Langnes", icao: "ENTC", passengers: 2058253, lat: 69.6936, lon: 18.9179, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Bodø Airport", icao: "ENBO", passengers: 1608688, lat: 67.2692, lon: 14.3653, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Ålesund Airport, Vigra", icao: "ENAL", passengers: 833501, lat: 62.56, lon: 6.08583, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Haugesund Airport, Karmøy", icao: "ENHD", passengers: 363025, lat: 59.3456, lon: 5.20963, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Molde Airport, Årø", icao: "ENML", passengers: 358745, lat: 62.7441, lon: 7.26248, country: 'NO', elevation: 0, runways: [90, 270] },
    { name: "Harstad/Narvik Airport, Evenes", icao: "ENEV", passengers: 514588, lat: 68.4912, lon: 16.6806, country: 'NO', elevation: 0, runways: [90, 270] }
  ],
  'FR': [
    { name: "Nice-Cote d'Azur Airport", icao: "LFMN", passengers: 14986121, lat: 43.6584, lon: 7.21587, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Lyon-Saint Exupéry Airport", icao: "LFLL", passengers: 12480062, lat: 45.7256, lon: 5.08119, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Bâle-Mulhouse-Freiburg Airport", icao: "LFSB", passengers: 8902507, lat: 47.5902, lon: 7.52504, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Clermont-Ferrand Auvergne Airport", icao: "LFLC", passengers: 268798, lat: 45.7865, lon: 3.16912, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Ajaccio Napoleon Bonaparte Airport", icao: "LFKF", passengers: 1603957, lat: 41.9213, lon: 8.79017, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Bastia – Poretta Airport", icao: "LFKB", passengers: 1704259, lat: 42.552, lon: 9.48398, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Figari South Corse Airport", icao: "LFKF", passengers: 799516, lat: 41.5037, lon: 9.10173, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Calvi – Sainte-Catherine Airport", icao: "LFKC", passengers: 483163, lat: 42.5317, lon: 8.79427, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Limoges – Bellegarde Airport", icao: "LFBL", passengers: 232938, lat: 45.7725, lon: 1.18228, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Montpellier–Méditerranée Airport", icao: "LFMT", passengers: 1515201, lat: 43.576, lon: 3.96317, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Strasbourg Airport", icao: "LFST", passengers: 951915, lat: 48.5383, lon: 7.63436, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Bordeaux–Mérignac Airport", icao: "LFBD", passengers: 7212015, lat: 44.8283, lon: -0.715556, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Toulouse–Blagnac Airport", icao: "LFBO", passengers: 8868352, lat: 43.635, lon: 1.36761, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Marseille Provence Airport", icao: "LFML", passengers: 11210817, lat: 43.4367, lon: 5.215, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Nantes Atlantique Airport", icao: "LFRS", passengers: 5503463, lat: 47.1561, lon: -1.6062, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Lille Airport", icao: "LFQQ", passengers: 2068499, lat: 50.5636, lon: 3.14083, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Beauvais–Tillé Airport", icao: "LFOB", passengers: 3468087, lat: 49.4544, lon: 2.11501, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Paris–Le Bourget Airport", icao: "LFPB", passengers: 19313, lat: 48.9667, lon: 2.44391, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Paris–Charles de Gaulle Airport", icao: "LFPG", passengers: 67329598, lat: 49.0128, lon: 2.55, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Paris-Orly Airport", icao: "LFPO", passengers: 32747190, lat: 48.7233, lon: 2.3664, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Pau Pyrénées Airport", icao: "LFBP", passengers: 462157, lat: 43.3448, lon: -0.400556, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "La Rochelle - Île de Ré Airport", icao: "LFBH", passengers: 230872, lat: 46.1793, lon: -1.19667, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Rennes–Saint-Jacques Airport", icao: "LFRN", passengers: 838122, lat: 48.0683, lon: -1.725, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Toulon–Hyères Airport", icao: "LFTH", passengers: 1301726, lat: 43.0975, lon: 6.14583, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Nîmes–Alès–Camargue–Cévennes Airport", icao: "LFNF", passengers: 249339, lat: 43.7583, lon: 4.41681, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Béziers Cap d'Agde Airport", icao: "LFMU", passengers: 223707, lat: 43.3183, lon: 3.35333, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Dinard–Pleurtuit–Saint-Malo Airport", icao: "LFRD", passengers: 135965, lat: 48.5878, lon: -2.07361, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Tours Val de Loire Airport", icao: "LFOT", passengers: 204689, lat: 47.4333, lon: 0.725, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Caen – Carpiquet Airport", icao: "LFRK", passengers: 294026, lat: 49.1831, lon: -0.457778, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Lorient South Brittany Airport", icao: "LFRH", passengers: 125028, lat: 47.7617, lon: -3.44028, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Aéroport de Deauville - Normandie", icao: "LFRG", passengers: 82531, lat: 49.3667, lon: 0.155833, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Brest Bretagne Airport", icao: "LFRB", passengers: 1026410, lat: 48.4467, lon: -4.41833, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Poitiers–Biard Airport", icao: "LFBI", passengers: 99166, lat: 46.5875, lon: 0.306111, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Perpignan–Rivesaltes Airport", icao: "LFMP", passengers: 314589, lat: 42.74, lon: 2.87167, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Grenoble-Isère Airport", icao: "LFLS", passengers: 315694, lat: 45.3619, lon: 5.32833, country: 'FR', elevation: 0, runways: [90, 270] },
    { name: "Lourdes – Pyrénées Airport", icao: "LFBT", passengers: 346146, lat: 43.1883, lon: -0.005556, country: 'FR', elevation: 0, runways: [90, 270] }
  ],
  'FI': [
    { name: "Tampere-Pirkkala Airport", icao: "EFTP", passengers: 337397, lat: 61.4141, lon: 23.7024, country: 'FI', elevation: 0, runways: [90, 270] },
    { name: "Turku Airport", icao: "EFTU", passengers: 427774, lat: 60.5104, lon: 22.2618, country: 'FI', elevation: 0, runways: [90, 270] },
    { name: "Kuopio Airport", icao: "EFKU", passengers: 233513, lat: 63.0084, lon: 27.7977, country: 'FI', elevation: 0, runways: [90, 270] },
    { name: "Rovaniemi Airport", icao: "EFRO", passengers: 672439, lat: 66.5614, lon: 25.83, country: 'FI', elevation: 0, runways: [90, 270] },
    { name: "Helsinki-Vantaa Airport", icao: "EFHK", passengers: 15370605, lat: 60.3172, lon: 24.9633, country: 'FI', elevation: 0, runways: [90, 270] },
    { name: "Kittilä Airport", icao: "EFKT", passengers: 375364, lat: 67.7011, lon: 24.8483, country: 'FI', elevation: 0, runways: [90, 270] },
    { name: "Oulu Airport", icao: "EFOU", passengers: 842407, lat: 64.9333, lon: 25.3528, country: 'FI', elevation: 0, runways: [90, 270] },
    { name: "Lappeenranta Airport", icao: "EFLP", passengers: 72124, lat: 61.0494, lon: 28.1461, country: 'FI', elevation: 0, runways: [90, 270] },
    { name: "Vaasa Airport", icao: "EFVA", passengers: 195655, lat: 63.0506, lon: 21.7611, country: 'FI', elevation: 0, runways: [90, 270] }
  ],
  'LT': [
    { name: "Vilnius International Airport", icao: "EYVI", passengers: 5853106, lat: 54.6433, lon: 25.2847, country: 'LT', elevation: 0, runways: [90, 270] },
    { name: "Kaunas International Airport", icao: "EYKA", passengers: 1029415, lat: 54.9654, lon: 24.0858, country: 'LT', elevation: 0, runways: [90, 270] },
    { name: "Palanga International Airport", icao: "EYPA", passengers: 373406, lat: 55.918, lon: 21.0967, country: 'LT', elevation: 0, runways: [90, 270] }
  ],
  'LU': [
    { name: "Luxembourg Airport", icao: "ELLX", passengers: 4247514, lat: 49.6342, lon: 6.21661, country: 'LU', elevation: 0, runways: [90, 270] }
  ],
  'NL': [
    { name: "Amsterdam Airport Schiphol", icao: "EHAM", passengers: 62514330, lat: 52.3086, lon: 4.76389, country: 'NL', elevation: 0, runways: [90, 270] },
    { name: "Maastricht Aachen Airport", icao: "EHBK", passengers: 355938, lat: 50.9167, lon: 5.77028, country: 'NL', elevation: 0, runways: [90, 270] },
    { name: "Eindhoven Airport", icao: "EHEH", passengers: 6804561, lat: 51.4501, lon: 5.3745, country: 'NL', elevation: 0, runways: [90, 270] },
    { name: "Rotterdam The Hague Airport", icao: "EHRD", passengers: 1955030, lat: 51.9547, lon: 4.43733, country: 'NL', elevation: 0, runways: [90, 270] },
    { name: "Groningen Airport Eelde", icao: "EHGG", passengers: 94270, lat: 53.1197, lon: 6.58472, country: 'NL', elevation: 0, runways: [90, 270] }
  ],
  'AT': [
    { name: "Vienna International Airport", icao: "LOWW", passengers: 34747754, lat: 48.1103, lon: 16.5697, country: 'AT', elevation: 0, runways: [90, 270] },
    { name: "Innsbruck Airport", icao: "LOWI", passengers: 1199321, lat: 47.26, lon: 11.3439, country: 'AT', elevation: 0, runways: [90, 270] },
    { name: "Graz Airport", icao: "LOWG", passengers: 854087, lat: 46.9911, lon: 15.4399, country: 'AT', elevation: 0, runways: [90, 270] },
    { name: "Klagenfurt Airport", icao: "LOWK", passengers: 107248, lat: 46.6432, lon: 14.3382, country: 'AT', elevation: 0, runways: [90, 270] },
    { name: "Linz Airport", icao: "LOWL", passengers: 327411, lat: 48.233, lon: 14.1873, country: 'AT', elevation: 0, runways: [90, 270] },
    { name: "Salzburg Airport", icao: "LOWS", passengers: 1838848, lat: 47.7933, lon: 13.0033, country: 'AT', elevation: 0, runways: [90, 270] }
  ],
  'BE': [
    { name: "Antwerp International Airport", icao: "EBAW", passengers: 167825, lat: 51.1895, lon: 4.46028, country: 'BE', elevation: 0, runways: [90, 270] },
    { name: "Brussels Airport", icao: "EBBR", passengers: 24483868, lat: 50.9014, lon: 4.48444, country: 'BE', elevation: 0, runways: [90, 270] },
    { name: "Brussels South Charleroi Airport", icao: "EBCI", passengers: 10156711, lat: 50.4592, lon: 4.4538, country: 'BE', elevation: 0, runways: [90, 270] },
    { name: "Liege Airport", icao: "EBLG", passengers: 105151, lat: 50.6375, lon: 5.44222, country: 'BE', elevation: 0, runways: [90, 270] },
    { name: "Ostend-Bruges International Airport", icao: "EBOS", passengers: 424419, lat: 51.1989, lon: 2.86222, country: 'BE', elevation: 0, runways: [90, 270] }
  ],
  'BG': [
    { name: "Burgas Airport", icao: "LBBG", passengers: 2046483, lat: 42.5696, lon: 27.5152, country: 'BG', elevation: 0, runways: [90, 270] },
    { name: "Plovdiv Airport", icao: "LBPD", passengers: 86847, lat: 42.0678, lon: 24.8504, country: 'BG', elevation: 0, runways: [90, 270] },
    { name: "Sofia Airport", icao: "LBSF", passengers: 7941014, lat: 42.6953, lon: 23.4079, country: 'BG', elevation: 0, runways: [90, 270] },
    { name: "Varna Airport", icao: "LBWN", passengers: 1498175, lat: 43.2325, lon: 27.8252, country: 'BG', elevation: 0, runways: [90, 270] }
  ],
  'CH': [
    { name: "EuroAirport Basel Mulhouse Freiburg", icao: "LFSB", passengers: 8902507, lat: 47.5902, lon: 7.52504, country: 'CH', elevation: 0, runways: [90, 270] },
    { name: "Geneva Airport", icao: "LSGG", passengers: 15865225, lat: 46.2381, lon: 6.10895, country: 'CH', elevation: 0, runways: [90, 270] },
    { name: "Lausanne-Blécherette Airport", icao: "LSGS", passengers: 16226, lat: 46.5414, lon: 6.63722, country: 'CH', elevation: 0, runways: [90, 270] },
    { name: "Lugano Airport", icao: "LSZA", passengers: 3060, lat: 46.0035, lon: 8.91054, country: 'CH', elevation: 0, runways: [90, 270] },
    { name: "Bern Airport", icao: "LSZB", passengers: 27894, lat: 46.9142, lon: 7.502, country: 'CH', elevation: 0, runways: [90, 270] },
    { name: "Zurich Airport", icao: "LSZH", passengers: 30266014, lat: 47.4647, lon: 8.54917, country: 'CH', elevation: 0, runways: [90, 270] },
    { name: "St. Gallen–Altenrhein Airport", icao: "LSZR", passengers: 65416, lat: 47.4853, lon: 9.56028, country: 'CH', elevation: 0, runways: [90, 270] }
  ],
  'CY': [
    { name: "Larnaca International Airport", icao: "LCLK", passengers: 10741984, lat: 34.8752, lon: 33.6247, country: 'CY', elevation: 0, runways: [90, 270] },
    { name: "Paphos International Airport", icao: "LCPH", passengers: 4025068, lat: 34.7176, lon: 32.486, country: 'CY', elevation: 0, runways: [90, 270] }
  ],
  'CZ': [
    { name: "Karlovy Vary Airport", icao: "LKKV", passengers: 40187, lat: 50.2198, lon: 12.9192, country: 'CZ', elevation: 0, runways: [90, 270] },
    { name: "Ostrava Leos Janáček Airport", icao: "LKMT", passengers: 408608, lat: 49.722, lon: 18.1491, country: 'CZ', elevation: 0, runways: [90, 270] },
    { name: "Pardubice Airport", icao: "LKPD", passengers: 148247, lat: 50.0152, lon: 15.74, country: 'CZ', elevation: 0, runways: [90, 270] },
    { name: "Václav Havel Airport Prague", icao: "LKPR", passengers: 15935084, lat: 50.1009, lon: 14.26, country: 'CZ', elevation: 0, runways: [90, 270] },
    { name: "Brno–Tuřany Airport", icao: "LKTB", passengers: 538600, lat: 49.1557, lon: 16.6874, country: 'CZ', elevation: 0, runways: [90, 270] }
  ],
  'DE': [
    { name: "Berlin Brandenburg Airport", icao: "EDDB", passengers: 20015555, lat: 52.3667, lon: 13.5033, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Dresden Airport", icao: "EDDC", passengers: 322818, lat: 51.1239, lon: 13.768, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Erfurt-Weimar Airport", icao: "EDDE", passengers: 160029, lat: 50.9786, lon: 10.9589, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Frankfurt Airport", icao: "EDDF", passengers: 52467510, lat: 50.0333, lon: 8.57056, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Münster Osnabrück International Airport", icao: "EDDG", passengers: 305581, lat: 52.1347, lon: 7.68472, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Hamburg Airport", icao: "EDDH", passengers: 10787012, lat: 53.6309, lon: 9.98822, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Cologne Bonn Airport", icao: "EDDK", passengers: 8571060, lat: 50.8659, lon: 7.14274, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Düsseldorf Airport", icao: "EDDL", passengers: 15707738, lat: 51.2895, lon: 6.76678, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Munich Airport", icao: "EDDM", passengers: 31143890, lat: 48.3538, lon: 11.7861, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Nuremberg Airport", icao: "EDDN", passengers: 3313032, lat: 49.4975, lon: 11.0667, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Leipzig/Halle Airport", icao: "EDDP", passengers: 1535372, lat: 51.4239, lon: 12.2419, country: 'DE', elevation: 0, runways: [90, 270] },
    // Corrected ICAO for Dortmund Airport
    { name: "Dortmund Airport", icao: "EDLW", passengers: 2765322, lat: 51.5183, lon: 7.61225, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Stuttgart Airport", icao: "EDDS", passengers: 8722405, lat: 48.6907, lon: 9.22197, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Hannover Airport", icao: "EDDV", passengers: 5399587, lat: 52.4609, lon: 9.68504, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Bremen Airport", icao: "EDDW", passengers: 1072927, lat: 53.0483, lon: 8.80434, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Frankfurt–Hahn Airport", icao: "EDFH", passengers: 1865922, lat: 49.9442, lon: 7.2625, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Memmingen Airport", icao: "EDJA", passengers: 3070624, lat: 47.9897, lon: 10.2394, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Paderborn Lippstadt Airport", icao: "EDLP", passengers: 576100, lat: 51.6141, lon: 8.61633, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Baden Airpark", icao: "EDSB", passengers: 1588720, lat: 48.7797, lon: 8.07833, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Weeze Airport", icao: "EDLV", passengers: 2336067, lat: 51.6015, lon: 6.14217, country: 'DE', elevation: 0, runways: [90, 270] },
    { name: "Saarbrücken Airport", icao: "EDDR", passengers: 213824, lat: 49.4053, lon: 7.10959, country: 'DE', elevation: 0, runways: [90, 270] }
  ],
  'GR': [
    { name: "Athens International Airport", icao: "LGAV", passengers: 31011880, lat: 37.9363, lon: 23.9444, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Chania International Airport", icao: "LGSA", passengers: 2943916, lat: 35.5317, lon: 24.1497, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Heraklion International Airport", icao: "LGIR", passengers: 9407335, lat: 35.3392, lon: 25.1764, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Thessaloniki Airport, Makedonia", icao: "LGTS", passengers: 6571590, lat: 40.5198, lon: 22.9709, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Corfu International Airport", icao: "LGKR", passengers: 3703598, lat: 39.601, lon: 19.9117, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Kefalonia International Airport", icao: "LGKF", passengers: 820257, lat: 38.125, lon: 20.501, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Rhodes International Airport", icao: "LGRP", passengers: 7256127, lat: 36.4055, lon: 28.0863, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Kos International Airport", icao: "LGKO", passengers: 3134372, lat: 36.792, lon: 27.0911, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Santorini (Thira) International Airport", icao: "LGSR", passengers: 2930266, lat: 36.3989, lon: 25.4764, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Mykonos Island National Airport", icao: "LGMK", passengers: 2080345, lat: 37.4357, lon: 25.3481, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Zakynthos International Airport", icao: "LGZA", passengers: 1607519, lat: 37.7836, lon: 20.8953, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Samos International Airport", icao: "LGSM", passengers: 479342, lat: 37.6896, lon: 26.9118, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Mytilene International Airport", icao: "LGMT", passengers: 488319, lat: 39.0669, lon: 26.5989, country: 'GR', elevation: 0, runways: [90, 270] },
    { name: "Kalamata International Airport", icao: "LGKL", passengers: 527263, lat: 37.0673, lon: 22.0255, country: 'GR', elevation: 0, runways: [90, 270] }
  ],
  'MK': [
    { name: "Skopje International Airport", icao: "LWSK", passengers: 2864332, lat: 41.9617, lon: 21.6214, country: 'MK', elevation: 0, runways: [90, 270] },
    { name: "Ohrid St. Paul the Apostle Airport", icao: "LWOH", passengers: 329303, lat: 41.1098, lon: 20.758, country: 'MK', elevation: 0, runways: [90, 270] }
  ],
  'LV': [
    { name: "Riga International Airport", icao: "EVRA", passengers: 6830508, lat: 56.9234, lon: 23.9798, country: 'LV', elevation: 0, runways: [90, 270] },
    { name: "Liepāja International Airport", icao: "EVLA", passengers: 14986, lat: 56.5268, lon: 21.0967, country: 'LV', elevation: 0, runways: [90, 270] },
    { name: "Ventspils Airport", icao: "EVVA", passengers: 53, lat: 57.3551, lon: 21.5369, country: 'LV', elevation: 0, runways: [90, 270] }
  ],
  'HR': [
    { name: "Zagreb Airport", icao: "LDZA", passengers: 4001997, lat: 45.7423, lon: 16.0688, country: 'HR', elevation: 0, runways: [90, 270] },
    { name: "Split Airport", icao: "LDSP", passengers: 3628790, lat: 43.5388, lon: 16.2979, country: 'HR', elevation: 0, runways: [90, 270] },
    { name: "Dubrovnik Airport", icao: "LDDU", passengers: 2920215, lat: 42.5611, lon: 18.2681, country: 'HR', elevation: 0, runways: [90, 270] },
    { name: "Pula Airport", icao: "LDPL", passengers: 939460, lat: 44.8933, lon: 13.9213, country: 'HR', elevation: 0, runways: [90, 270] },
    { name: "Zadar Airport", icao: "LDZD", passengers: 1051563, lat: 44.096, lon: 15.3468, country: 'HR', elevation: 0, runways: [90, 270] },
    { name: "Osijek Airport", icao: "LDOS", passengers: 27063, lat: 45.4623, lon: 18.8105, country: 'HR', elevation: 0, runways: [90, 270] }
  ],
  'TR': [
    { name: "Istanbul Airport", icao: "LTFM", passengers: 44432168, lat: 41.2753, lon: 28.7497, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Sabiha Gökçen International Airport", icao: "LTFJ", passengers: 26317769, lat: 40.8986, lon: 29.3092, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Antalya Airport", icao: "LTAI", passengers: 33552085, lat: 36.9211, lon: 30.8033, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Ankara Esenboğa Airport", icao: "LTAC", passengers: 10852955, lat: 40.1267, lon: 32.995, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Izmir Adnan Menderes Airport", icao: "LTBJ", passengers: 10672528, lat: 38.2923, lon: 27.1569, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Adana Şakirpaşa Airport", icao: "LTAF", passengers: 4621516, lat: 36.9822, lon: 35.2861, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Dalaman Airport", icao: "LTBS", passengers: 6183901, lat: 36.9209, lon: 28.7921, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Milas–Bodrum Airport", icao: "LTFE", passengers: 4210080, lat: 37.2589, lon: 27.6644, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Trabzon Airport", icao: "LTCG", passengers: 2703901, lat: 40.9996, lon: 39.7891, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Gaziantep Oğuzeli International Airport", icao: "LTAJ", passengers: 2035815, lat: 36.9587, lon: 37.4786, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Kayseri Erkilet International Airport", icao: "LTAA", passengers: 1217088, lat: 38.77, lon: 35.4953, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Sivas Nuri Demirağ Airport", icao: "LTAR", passengers: 225882, lat: 39.8164, lon: 36.9042, country: 'TR', elevation: 0, runways: [90, 270] },
    // Corrected ICAO for Erzurum Airport
    { name: "Erzurum Airport", icao: "LTCE", passengers: 460655, lat: 39.9566, lon: 41.1683, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Diyarbakır Airport", icao: "LTCC", passengers: 1405021, lat: 37.8939, lon: 40.2811, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Denizli Çardak Airport", icao: "LTAY", passengers: 232970, lat: 37.785, lon: 29.7028, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Samsun Çarşamba Airport", icao: "LTFH", passengers: 1073842, lat: 41.267, lon: 36.5647, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Balıkesir Koca Seyit Airport", icao: "LTFD", passengers: 126046, lat: 39.555, lon: 27.0164, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Tekirdağ Çorlu Airport", icao: "LTBU", passengers: 213853, lat: 41.1386, lon: 27.9158, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Isparta Süleyman Demirel Airport", icao: "LTFC", passengers: 88448, lat: 37.8553, lon: 30.3803, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Hatay Airport", icao: "LTDA", passengers: 650371, lat: 36.31, lon: 36.2847, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Malatya Erhaç Airport", icao: "LTAT", passengers: 206803, lat: 38.4556, lon: 38.0886, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Kars Harakani Airport", icao: "LTCK", passengers: 237583, lat: 40.5619, lon: 43.0864, country: 'TR', elevation: 0, runways: [90, 270] },
    // Corrected ICAO for Konya Airport
    { name: "Konya Airport", icao: "LTAZ", passengers: 460655, lat: 37.979, lon: 32.5618, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Bingöl Airport", icao: "LTCW", passengers: 106423, lat: 38.878, lon: 40.5901, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Ağrı Ahmed-i Hani Airport", icao: "LTCO", passengers: 118491, lat: 39.654, lon: 43.0298, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Elazığ Airport", icao: "LTCA", passengers: 193188, lat: 38.6083, lon: 39.2319, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Kocaeli Cengiz Topel Airport", icao: "LTFQ", passengers: 126343, lat: 40.7388, lon: 30.0717, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Tokat Airport", icao: "LTAW", passengers: 50689, lat: 40.686, lon: 36.3813, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Amasya Merzifon Airport", icao: "LTAP", passengers: 131589, lat: 40.8257, lon: 35.1916, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Kastamonu Airport", icao: "LTFB", passengers: 46937, lat: 41.3204, lon: 33.7915, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Siirt Airport", icao: "LTCL", passengers: 21000, lat: 37.973, lon: 41.8398, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Zonguldak Çaycuma Airport", icao: "LTAS", passengers: 61376, lat: 41.5065, lon: 32.0839, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Van Ferit Melen Airport", icao: "LTCI", passengers: 1596707, lat: 38.4682, lon: 43.3323, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Erzincan Airport", icao: "LTCD", passengers: 140889, lat: 39.5376, lon: 39.4684, country: 'TR', elevation: 0, runways: [90, 270] },
    { name: "Gümüşhane-Bayburt Airport", icao: "LTDA", passengers: 336424, lat: 40.1062, lon: 39.6975, country: 'TR', elevation: 0, runways: [90, 270] }
  ],
};

export const SENSOR_DEFINITIONS = {
  [SensorType.ADS_B]: { rangeKm: 150, hasConeOfSilence: false, coneOfSilenceRadiusKm: 0 },
  [SensorType.MODE_S]: { rangeKm: 200, hasConeOfSilence: true, coneOfSilenceRadiusKm: 1 },
  [SensorType.PRIMARY]: { rangeKm: 100, hasConeOfSilence: false, coneOfSilenceRadiusKm: 0 },
};

export const MAP_BOUNDS = { minLat: 35, maxLat: 70, minLon: -25, maxLon: 45 };

const avgLat = (MAP_BOUNDS.minLat + MAP_BOUNDS.maxLat) / 2;
export const KM_PER_DEG_LAT = 111.32;
export const KM_PER_DEG_LON = 111.32 * Math.cos(avgLat * (Math.PI / 180));

export const MAP_WIDTH_KM = (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon) * KM_PER_DEG_LON;
export const MAP_HEIGHT_KM = (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat) * KM_PER_DEG_LAT;

export const GRID_CELL_SIZE_KM = 10; // Increased resolution to reduce projection artifacts

export const GRID_WIDTH = Math.ceil(MAP_WIDTH_KM / GRID_CELL_SIZE_KM);
export const GRID_HEIGHT = Math.ceil(MAP_HEIGHT_KM / GRID_CELL_SIZE_KM);

export const FT_TO_KM = 0.0003048;
export const KM_TO_FT = 3280.84;
export const ALTITUDE_LEVELS_FT = Array.from({ length: 40 }, (_, i) => (i + 1) * 1000);
export const ALTITUDE_LEVELS_KM = ALTITUDE_LEVELS_FT.map(ft => ft * FT_TO_KM);

export const MAP_ID = 'RADAR_COVERAGE_MAP_STYLE';

// --- SIMULATION CONSTANTS ---
export const AIRCRAFT_CAPACITY = 250;
export const DAY_START_HOUR = 8; // 08:00
export const DAY_END_HOUR = 20; // 20:00
export const DAY_NIGHT_TRAFFIC_RATIO = 0.6; // 60% during the day

export const AIRCRAFT_CLIMB_RATE_FPM = 2500; // feet per minute
export const AIRCRAFT_DESCENT_RATE_FPM = 2000;
export const AIRCRAFT_CRUISE_SPEED_KMH = 850;
export const SECONDS_IN_DAY = 24 * 60 * 60;