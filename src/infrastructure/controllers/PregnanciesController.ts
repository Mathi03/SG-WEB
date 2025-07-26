import {
  ExpectedBirthsSchema,
  expectedBirthsSchema,
} from "@infrastructure/validations/expectectBirthsValidation";
import {
  pregnanciesSchema,
  PregnanciesSchema,
} from "@infrastructure/validations/pregnanciesValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: {
  farmId?: number;
}): Promise<PregnanciesSchema[]> {
  const res = await ApiHandler.get(`/pregnancies`, { params });
  return array(pregnanciesSchema).parse(res);
}

async function expectedDate(params?: {
  farmId?: number;
}): Promise<ExpectedBirthsSchema[]> {
  const res = await ApiHandler.get(`/pregnancies/expected-births`, { params });
  return array(expectedBirthsSchema).parse(res);
}

async function searchOne(id: number): Promise<PregnanciesSchema> {
  const res = await ApiHandler.get(`/pregnancies/${id}`, {});
  return pregnanciesSchema.parse(res);
}

async function create(data: PregnanciesSchema): Promise<PregnanciesSchema> {
  const res = await ApiHandler.post(`/pregnancies`, { data });
  return pregnanciesSchema.parse(res);
}

function update(id: number, data: PregnanciesSchema) {
  return ApiHandler.put(`/pregnancies/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/pregnancies/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
  expectedDate,
};
