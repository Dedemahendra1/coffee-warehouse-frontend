import { z } from "zod";

export const editDistribusiStokOutlet = z.object({
  stock: z
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be a number",
    })
    .min(1, "Stock must be at least 1"),
});

export type EditDistribusiStokOutletFormData = z.infer<typeof editDistribusiStokOutlet>;
