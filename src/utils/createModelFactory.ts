/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  z,
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodString,
  ZodUnion,
} from "zod";
import { defaultsDeep } from "lodash";

export default function createModelFactory<T extends z.ZodObject<any>>(
  parser: T
) {
  const emptyModel = createEmptyModel(parser);
  const partialParser = parser.strip().deepPartial();

  return function (obj?: DeepPartial<z.infer<T>> | null) {
    if (
      obj === undefined ||
      obj === null ||
      (typeof obj === "object" && !Array.isArray(obj))
    ) {
      const parsed = partialParser.parse(obj ?? {});

      return defaultsDeep(parsed, emptyModel) as z.infer<T>;
    }

    throw new Error(
      `Failed to create model, invalid data type "${typeof obj}"`
    );
  };
}

function createEmptyModel<T extends ZodObject<any>>(parser: T) {
  const emptyModel: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(parser.shape)) {
    emptyModel[key] =
      value instanceof ZodObject
        ? createEmptyModel(value)
        : getDefaultValue(value);
  }

  return emptyModel as z.infer<T>;
}

function getDefaultValue(parser: unknown) {
  if (parser instanceof ZodObject) {
    throw new Error("ZodObject is not supported");
  }

  if (parser instanceof ZodOptional) {
    return undefined;
  }

  if (parser instanceof ZodNullable) {
    return null;
  }
  if (parser instanceof ZodString) {
    return "";
  }
  if (parser instanceof ZodUnion) {
    return "";
  }
  if (parser instanceof ZodNumber) {
    return 0;
  }
  if (parser instanceof ZodBoolean) {
    return false;
  }

  if (parser instanceof ZodArray) {
    return [] as unknown[];
  }

  if (parser instanceof ZodDate) {
    return new Date();
  }

  throw new Error("Unknown parser");
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
