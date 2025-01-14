import { withDatabase } from "@/app/middleware";
import { addJob } from "@/tasks/worker";
import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { useAtomValue } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { z } from "zod";

const listWidgets = createServerFn({ method: "GET" })
  .middleware([withDatabase])
  .handler(async ({ context }) => {
    const widgets = await context.db.selectFrom("widget").selectAll().execute();
    return widgets;
  });

const createWidget = createServerFn({ method: "POST" })
  .middleware([withDatabase])
  .validator(z.object({ name: z.string() }))
  .handler(async ({ data, context }) => {
    const widget = await context.db.insertInto("widget").values(data).returning("id").executeTakeFirstOrThrow();
    await addJob("after-create-widget", { widgetId: widget.id });
  });

const listWidgetsQueryOptions = queryOptions({
  queryKey: ["widgets"],
  queryFn: () => listWidgets(),
});

const widgetListAtom = atomWithQuery((_get) => listWidgetsQueryOptions);
// const widgetListAtom = atomWithSuspenseQuery((get) => listWidgetsQueryOptions);

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(listWidgetsQueryOptions);
  },
});

function Home() {
  const widgets = useAtomValue(widgetListAtom);
  const queryClient = useQueryClient();

  if (!widgets.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Widgets</h1>
      <ul className="space-y-2">
        {widgets.data.map((widget) => (
          <li key={widget.id} className="p-2 border rounded">
            {widget.name}
          </li>
        ))}
      </ul>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const name = formData.get("name");
          await createWidget({ data: { name: name as string } });
          await queryClient.invalidateQueries(listWidgetsQueryOptions);
        }}
      >
        <input type="text" name="name" />
        <button type="submit">Create Widget</button>
      </form>
    </div>
  );
}
