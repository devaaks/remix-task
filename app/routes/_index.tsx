import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Loopsin | Task" },
    { name: "description", content: "Loopsin Task" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Loopsin Task</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            href="/users"
            rel="noreferrer"
          >
            Users
          </a>
        </li>
      </ul>
    </div>
  );
}
