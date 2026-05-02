import { z } from "zod";

export const ShemaVozilo = z.object({

  registracija: z.string()
    .trim()
    .min(1, "Registracija je obavezna!")
    .max(50, "Registracija može imati najviše 50 znakova!"),

  marka: z.string()
    .trim()
    .min(1, "Marka je obavezna!")
    .max(50, "Marka može imati najviše 50 znakova!"),

  model: z.string()
    .trim()
    .min(1, "Model je obavezan!")
    .max(50, "Model može imati najviše 50 znakova!"),

  godiste: z.coerce.number({
    invalid_type_error: "Godište mora biti broj!"
  })
    .min(1900, "Unesite ispravno godište vozila!")
    .max(new Date().getFullYear() + 1, "Unesite ispravno godište vozila!"),

  kilometri: z.coerce.number({
    invalid_type_error: "Kilometri moraju biti broj!"
  })
    .min(0, "Kilometri ne mogu biti negativni!")
});
