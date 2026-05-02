import { z } from 'zod'

export const ShemaUsluga = z.object({
  naziv: z.string()
    .trim()
    .min(1, "Naziv usluge je obavezan!")
    .min(3, "Naziv usluge mora imati najmanje 3 znaka!")
    .max(100, "Naziv usluge može imati najviše 100 znakova!"),

  trajanje: z.coerce.number({
    invalid_type_error: "Trajanje mora biti broj!"
  })
    .min(0, "Trajanje ne može biti negativno!"),

  cijena: z.coerce.number({
    invalid_type_error: "Cijena mora biti broj!"
  })
    .min(0, "Cijena mora biti pozitivan broj!"),

  datumPokretanja: z.coerce.date({
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_date) {
        return { message: "Molimo unesite ispravan format datuma!" }
      }
      return { message: ctx.defaultError }
    },
    invalid_type_error: "Molimo unesite ispravan format datuma!",
    required_error: "Datum je obavezan!"
  })
    .refine((odabraniDatum) => {
      const danas = new Date()
      danas.setHours(0, 0, 0, 0)
      return odabraniDatum >= danas
    }, "Datum početka ne može biti u prošlosti!"),

  aktivan: z.boolean()
})
