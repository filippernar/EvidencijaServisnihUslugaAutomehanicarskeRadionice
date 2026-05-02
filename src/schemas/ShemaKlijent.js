import { z } from "zod";

export const ShemaKlijent = z.object({

  ime: z.string()
    .trim()
    .min(1, "Ime je obavezno i ne smije sadržavati samo razmake!")
    .min(2, "Ime mora imati najmanje 2 znaka!")
    .max(50, "Ime može imati najviše 50 znakova!"),

  prezime: z.string()
    .trim()
    .min(1, "Prezime je obavezno i ne smije sadržavati samo razmake!")
    .min(2, "Prezime mora imati najmanje 2 znaka!")
    .max(50, "Prezime može imati najviše 50 znakova!"),

  email: z.string()
    .trim()
    .min(1, "Email je obavezan!")
    .email("Email nije u ispravnom formatu!")
    .max(100, "Email može imati najviše 100 znakova!"),

  oib: z.string()
    .trim()
    .min(1, "OIB je obavezan!")
    .length(11, "OIB mora imati točno 11 znamenki!")
    .regex(/^\d+$/, "OIB smije sadržavati samo brojeve!")
});
