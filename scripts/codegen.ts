import { SCHEMA } from "@/database/db";
import { startPgGatewayServer, stopPgGatewayServer } from "@/database/pg";
import { config } from "@/lib/config";
import { watch } from "graphile-migrate";
import kanel from "kanel";
import kanelKysely from "kanel-kysely";
import camelCase from "lodash/camelCase";
import capitalize from "lodash/capitalize";
const { processDatabase } = kanel;
const { makeKyselyHook } = kanelKysely;

async function runMigrations(connectionString: string) {
  await watch(
    {
      connectionString,
      migrationsFolder: config.MIGRATIONS_FOLDER,
    },
    // true for once (run and done)
    true,
  );
}

const makeConfig = (connectionString: string) => ({
  schemas: [SCHEMA],
  outputPath: "./database/types",
  preRenderHooks: [makeKyselyHook()],
  connection: {
    connectionString,
  },
  // This implementation will generate flavored instead of branded types.
  // See: https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/
  generateIdentifierType: (c, d) => {
    const pascalTableName = capitalize(camelCase(d.name));
    const pascalColumnName = capitalize(camelCase(c.name));

    return {
      declarationType: "typeDeclaration" as const,
      name: `${pascalTableName}${pascalColumnName}`,
      exportAs: "named" as const,
      typeDefinition: [
        // `string & { __flavor?: '${pascalTableName}${pascalColumnName}' }`,
        "string",
      ],
      comment: [`Identifier type for ${d.name}`],
    };
  },
});

async function main() {
  const { server, connectionString } = await startPgGatewayServer();
  await runMigrations(connectionString);
  await processDatabase(makeConfig(connectionString));
  stopPgGatewayServer(server);
}

main();
