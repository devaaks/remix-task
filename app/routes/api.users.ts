import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { API_ENDPOINTS } from '~/constants';
import { UsersSchema } from '~/schema/user';
import { getSearchParam, validateSchema } from "~/utils";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
    try {
        const searchParam = getSearchParam(request.url);
    
        const url = `${API_ENDPOINTS.SWAPI_USERS}&${searchParam}`;
        const response = await fetch(url);
        if (!response.ok) throw new Response("User fetch request failed", { status: response.status });

        const data = await response.json();
        
        // validates user schema against the api result
        validateSchema(data.results, UsersSchema);
    
        return json(data);
    } catch (error) {
        console.error('Failed to get users list: ', error);
        throw error;
    }
};
