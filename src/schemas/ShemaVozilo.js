import { z } from "zod";

// Lokalni error map koji prevodi sistemske Zod greške na hrvatski
const hrErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === "number") {
        return { message: "Polje mora biti broj!" };
      }
      break;
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        return { message: `Minimalno ${issue.minimum} znakova!` };
      }
      break;
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        return { message: "Neispravan format email adrese!" };
      }
      break;
  }
  // Ako nemamo specifičan prijevod, koristi default (tvoj tekst iz sheme ili Zod default)
  return { message: ctx.defaultError };
};

// Primjena error mapa
z.setErrorMap(hrErrorMap);

export const ShemaVozilo = z.object({
  registracija: z
    .string()
    .trim()
    .min(1, "Registracija je obavezna!")
    .max(50, "Registracija može imati najviše 50 znakova!"),

  marka: z
    .string()
    .trim()
    .min(1, "Marka je obavezna!")
    .max(50, "Marka može imati najviše 50 znakova!"),

  model: z
    .string()
    .trim()
    .min(1, "Model je obavezan!")
    .max(50, "Model može imati najviše 50 znakova!"),

  godiste: z.coerce
    .number({
      invalid_type_error: "Godište mora biti broj!",
      required_error: "Godište je obavezno!"
    })
    .int("Godište mora biti cijeli broj!")
    .min(1900, "Unesite ispravno godište (min. 1900)!")
    .max(new Date().getFullYear() + 1, "Godište ne može biti u dalekoj budućnosti!"),

  kilometri: z.coerce
  .number({
    invalid_type_error: "Kilometri moraju biti broj!",
    required_error: "Kilometri su obavezni!"
  })
  .min(1, "Kilometri moraju biti veći od 0!")

});