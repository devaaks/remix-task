import { ZodSchema } from "zod";

export const validateSchema = <T>(data: any, schema: ZodSchema<T>): T=> {
  try {
    const result = schema.safeParse(data);
    
    if (!result.success) throw new Response("Invalid data format", { status: 400 });
    
    return data;
  } catch (error) {
    console.error('Data validation failed: ', error);
    throw error;
  }
}

export const getSearchParam = (url: string): string => {
    const currentUrl = new URL(url);
    const searchedKeyword = currentUrl.searchParams.get("search");
    const searchQuery = searchedKeyword ? `search=${encodeURIComponent(searchedKeyword)}` : '';
    return searchQuery;
}