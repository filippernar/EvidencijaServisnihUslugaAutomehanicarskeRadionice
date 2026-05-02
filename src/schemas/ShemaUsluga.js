import { z } from 'zod';

// Globalni error map za prijevode sistemskih poruka (npr. Required, Invalid type)
const hrErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === "number") return { message: "Polje mora biti broj!" };
      if (issue.expected === "date") return { message: "Neispravan format datuma!" };
      break;
    case z.ZodIssueCode.invalid_date:
      return { message: "Molimo unesite ispravan datum!" };
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") return { message: `Minimalno ${issue.minimum} znakova!` };
      break;
  }
  return { message: ctx.defaultError };
};

// Aktiviraj prijevod
z.setErrorMap(hrErrorMap);

export const ShemaUsluga = z.object({
  naziv: z.string()
    .trim()
    .min(1, "Naziv usluge je obavezan!")
    .min(3, "Naziv usluge mora imati najmanje 3 znaka!")
    .max(100, "Naziv usluge može imati najviše 100 znakova!"),

  trajanje: z.coerce.number({
    invalid_type_error: "Trajanje mora biti broj!",
    required_error: "Trajanje je obavezno!"
  })
    .min(0, "Trajanje ne može biti negativno!"),

  cijena: z.coerce.number({
    invalid_type_error: "Cijena mora biti broj!",
    required_error: "Cijena je obavezna!"
  })
    .min(0, "Cijena mora biti pozitivan broj!"),

  datumPokretanja: z.coerce.date({
    invalid_type_error: "Molimo unesite ispravan format datuma!",
    required_error: "Datum je obavezan!"
  })
    .refine((odabraniDatum) => {
      const danas = new Date();
      danas.setHours(0, 0, 0, 0);
      return odabraniDatum >= danas;
    }, "Datum početka ne može biti u prošlosti!"),

  aktivan: z.boolean({
    invalid_type_error: "Status mora biti istinit ili lažan!",
    required_error: "Status aktivnosti je obavezan!"
  }).default(true)
});