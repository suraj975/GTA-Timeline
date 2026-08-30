export type Trailer = {
  id: string;
  game: string;
  label: string;
  year: string;
};

// Videos are published by the verified Rockstar Games YouTube channel.
export const trailers: Trailer[] = [
  { id: "0VxoWT0MyLE", game: "GTA III", label: "10 Year Anniversary Launch Trailer", year: "2011" },
  { id: "f_VBXRZuHTc", game: "Vice City", label: "Anniversary Trailer", year: "2012" },
  { id: "M80K51DosFo", game: "GTA IV", label: "Things Will Be Different", year: "2007" },
  { id: "QkkoHAzjnUs", game: "GTA V", label: "Trailer 1", year: "2011" },
  { id: "QdBZY2fkU-0", game: "GTA VI", label: "Trailer 1", year: "2023" },
  { id: "VQRLujxTm3c", game: "GTA VI", label: "Trailer 2", year: "2025" },
];
