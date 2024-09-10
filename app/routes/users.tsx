import { useLoaderData, Form } from "@remix-run/react";
import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { API_ENDPOINTS } from '~/constants';
import { User } from "~/types";
import { UsersSchema } from '~/schema/user';
import { validateSchema, getSearchParam } from "~/utils";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs): Promise<User[]> => {
    try {
        const searchParam = getSearchParam(request.url);
        const apiUrl = `${API_ENDPOINTS.USERS}?${searchParam}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Response("Failed to fetch data", { status: response.status });

        const userData = await response.json();
        const users = validateSchema(userData.results, UsersSchema);

        return users;
    } catch (error) {
        console.error('Failed to load users: ', error);
        throw new Response("Server Error", { status: 500 });
    }
};

export default function UsersPage() {
    const users = useLoaderData<User[]>();
    
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Users</h1>
                <Form method="get">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search..."
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Form>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Birth Year</th>
                            <th className="py-3 px-6 text-left">Gender</th>
                            <th className="py-3 px-6 text-left">Height (CM)</th>
                            <th className="py-3 px-6 text-left">Hair Color</th>
                            <th className="py-3 px-6 text-left">Mass (Kg)</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {users.map((user: User) => (
                            <tr key={user.name.replace(/\s/g, '')} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
                                <td className="py-3 px-6 text-left">{user.birth_year}</td>
                                <td className="py-3 px-6 text-left">{user.gender}</td>
                                <td className="py-3 px-6 text-left">{user.height}</td>
                                <td className="py-3 px-6 text-left">{user.hair_color}</td>
                                <td className="py-3 px-6 text-left">{user.mass}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
