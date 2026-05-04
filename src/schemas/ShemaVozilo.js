import { z } from "zod";

// Hrvatski error map — stabilan, bez rušenja
const hrErrorMap = (issue, ctx) => {
  switch (issue.code) {

    case z.ZodIssueCode.invalid_type:
      if (issue.expected === "number") {
        return { message: "Polje mora biti broj!" };
      }
      if (issue.expected === "string") {
        return { message: "Polje mora biti tekst!" };
      }
      return { message: "Neispravan tip podatka!" };

    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        return { message: `Minimalno ${issue.minimum} znakova!` };
      }
      if (issue.type === "number") {
        return { message: `Vrijednost mora biti najmanje ${issue.minimum}.` };
      }
      return { message: "Vrijednost je premala!" };

    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        return { message: `Maksimalno ${issue.maximum} znakova!` };
      }
      if (issue.type === "number") {
        return { message: `Vrijednost mora biti najviše ${issue.maximum}.` };
      }
      return { message: "Vrijednost je prevelika!" };

    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        return { message: "Neispravan format email adrese!" };
      }
      return { message: "Neispravan format teksta!" };

    default:
      // SIGURAN fallback — nikad ne baca grešku
      return { message: issue.message || "Neispravna vrijednost." };
  }
};

// Aktiviramo hrvatski error map globalno
z.setErrorMap(hrErrorMap);

// Shema za vozilo
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
