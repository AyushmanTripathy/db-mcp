#!/usr/bin/env bun

import { McpServer, StdioServerTransport } from "@modelcontextprotocol/server";
import { sql } from "bun";
import * as z from "zod";

const server = new McpServer({
  name: "db-mcp",
  version: "1.0.0",
});

server.registerTool(
  "list-tables",
  {
    title: "List all tables present",
    description: "Used to retrive list of table names present.",
  },
  async () => {
    const list = await sql`SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';`;

    return {
      content: [{ type: "text", text: JSON.stringify(list, null, 2) }],
    };
  }
);

server.registerTool(
  "read-rows-of-table",
  {
    title: "Read rows of table",
    description: "Used to retrive rows of table.",
    inputSchema: z.strictObject({
      tableName: z.string().nonempty().describe("Name of the table"),
      whereCondition: z
        .string()
        .optional()
        .describe("Where condition for query"),
      limit: z
        .number()
        .optional()
        .describe("Limit the number of rows returned")
        .default(100),
    }),
  },
  async (request) => {
    let rows;
    if (request.whereCondition)
      rows = await sql`SELECT *
FROM ${sql(request.tableName)}
WHERE ${sql.unsafe(request.whereCondition)}
LIMIT ${request.limit};`;
    else
      rows = await sql`SELECT *
FROM ${sql(request.tableName)} LIMIT ${request.limit};`;

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
    };
  }
);
server.registerTool(
  "get-table-schema",
  {
    title: "Get schema defination of a table",
    description: "Used to retrive the schema defination of any database table.",
    inputSchema: z.strictObject({
      tableName: z.string().nonempty().describe("Name of the table"),
    }),
  },
  async (request) => {
    const schema = await sql`SELECT 
    column_name, 
    data_type, 
    character_maximum_length AS max_length, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = ${request.tableName}
ORDER BY 
    ordinal_position`;

    return {
      content: [{ type: "text", text: JSON.stringify(schema, null, 2) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

