import {
  raceSchema,
  RaceSchema,
} from "@infrastructure/validations/raceValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(): Promise<RaceSchema[]> {
  const res = await ApiHandler.get(`/breeds`, {});
  return array(raceSchema).parse(res);
}

async function searchOne(id: number): Promise<RaceSchema> {
  const res = await ApiHandler.get(`/breeds/${id}`, {});
  return raceSchema.parse(res);
}

async function create(data: RaceSchema): Promise<RaceSchema> {
  const res = await ApiHandler.post(`/breeds`, { data });
  return raceSchema.parse(res);
}

function update(id: number, data: RaceSchema) {
  return ApiHandler.put(`/breeds/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/breeds/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
