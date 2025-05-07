export default async (url: string): Promise<Response> => {
  const response = await fetch(url);
  return response;
};
