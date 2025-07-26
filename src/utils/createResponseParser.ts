/* eslint-disable @typescript-eslint/no-explicit-any */
import Overwrite from "@application/common/Overwrite";
import { ZodType, z } from "zod";

export default function createResponseParser<T extends z.ZodTypeAny>(
  parser: T
) {
  return z.object({
    success: z.boolean().nullable().optional(),
    data: z.array(parser),
  });
}

export type ResponseParser<T extends z.ZodTypeAny> = ReturnType<
  typeof createResponseParser<T>
>;

export type ResponseParserOf<T> = z.infer<
  ResponseParser<
    Overwrite<
      ZodType<any, any, any>,
      {
        _output: T;
      }
    >
  >
>;
