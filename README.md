# db-mcp

`db-mcp` is an MCP server that provides tools to interact with a Postgres database. 
It allows you to list tables, read rows, and view table schemas directly from your agents.

## Tools

- `list-tables`: Retrieve a list of all base tables present in the database.
- `read-rows-of-table`: Read rows from a specific table, with optional conditions and limits.
- `get-table-schema`: Retrieve the schema definition of any database table.

## Installation

This project requires **Bun** to be installed on your system.

To install and use this MCP server in your agents, add the following configuration to your `.agents/mcp_config.json` file:

```json
{
  "mcpServers": {
    "db-mcp": {
      "command": "bunx",
      "args": [
        "@ayushmantripathy/db-mcp"
      ]
    }
  }
}
```
