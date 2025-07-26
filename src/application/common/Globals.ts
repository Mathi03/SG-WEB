export const baseURL = "https://sg-api-igpl.onrender.com/api/v1";
const accessToken = sessionStorage.getItem("accessToken");
export let AuthorizationHeader = `Bearer ${accessToken}`;
export let ExternalAuthorizationHeader = "";
export const timeoutDuration = 300000;
export const setHeader = (header: string, external = false) => {
  if (external) ExternalAuthorizationHeader = header;
  else AuthorizationHeader = header;
};

export const submissionEnviroment = "development";
export const submissionSource = "MANUAL";
export const submissionEntityTransaction = "Transaction";
export const submissionEntityOffice = "Office";
export const submissionEntityPerson = "Person";
