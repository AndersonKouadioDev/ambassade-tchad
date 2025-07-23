// types/request.inputs.ts
import {
  visaRequestDetailsSchema,
  birthActRequestDetailsSchema,
  consularCardRequestDetailsSchema,
  laissezPasserRequestDetailsSchema,
  marriageCapacityActRequestDetailsSchema,
  deathActRequestDetailsSchema,
  powerOfAttorneyRequestDetailsSchema,
  nationalityCertificateRequestDetailsSchema,
} from "@/lib/validation/details-request.validation";

import { z } from "zod";

export type CreateVisaRequestInput = z.infer<typeof visaRequestDetailsSchema>;
export type CreateBirthActRequestInput = z.infer<typeof birthActRequestDetailsSchema>;
export type CreateConsularCardRequestInput = z.infer<typeof consularCardRequestDetailsSchema>;
export type CreateLaissezPasserRequestInput = z.infer<typeof laissezPasserRequestDetailsSchema>;
export type CreateMarriageCapacityActRequestInput = z.infer<typeof marriageCapacityActRequestDetailsSchema>;
export type CreateDeathActRequestInput = z.infer<typeof deathActRequestDetailsSchema>;
export type CreatePowerOfAttorneyRequestInput = z.infer<typeof powerOfAttorneyRequestDetailsSchema>;
export type CreateNationalityCertificateRequestInput = z.infer<typeof nationalityCertificateRequestDetailsSchema>;
