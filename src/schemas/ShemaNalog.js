import { z } from "zod";

export const ShemaNalog = z.object({

  naziv: z.string()
    .trim()
    .min(1, "Naziv/Opis naloga je obavezan!")
    .max(200, "Naziv može imati najviše 200 znakova!"),

  vozilo: z.coerce.number({
    invalid_type_error: "Vozilo mora biti odabrano!"
  })
    .min(1, "Vozilo mora biti odabrano!"),

  klijent: z.coerce.number({
    invalid_type_error: "Klijent mora biti odabran!"
  })
    .min(1, "Klijent mora biti odabran!"),

  usluge: z.array(
    z.number({
      invalid_type_error: "Usluge moraju biti valjane!"
    })
  )
    .min(1, "Morate odabrati barem jednu uslugu!")
});
