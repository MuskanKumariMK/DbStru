import json
import streamlit as st
import pandas as pd
from pyvis.network import Network


# --- Load Schema ---
def load_schema(schema_file="schema.json"):
    with open(schema_file, "r", encoding="utf-8") as f:
        schema = json.load(f)
    return schema


# --- Create Interactive ERD with PyVis ---
def create_erd(schema):
    net = Network(height="800px", width="100%", directed=True, notebook=False)
    net.barnes_hut()

    # Add tables as nodes
    for table, details in schema.items():
        label = f"{table}\nColumns: {len(details['columns'])}\nPKs: {', '.join(details['primary_keys'])}"
        net.add_node(table, label=label, shape="box", color="#e0f2fe")

    # Add nodes first
    for table in schema.keys():
        net.add_node(table, label=table, shape="box", color="#e0f2fe")

    # Add edges
    for table, details in schema.items():
        for fk in details.get("foreign_keys", []):
            # Construct full node name
            ref_table_name = fk["ref_table"]
            # Append schema if missing
            if "." not in ref_table_name:
                ref_table_name = f"dbo.{ref_table_name}"  # match your JSON keys

            # Only add edge if node exists
            if ref_table_name in schema:
                net.add_edge(
                    table,
                    ref_table_name,
                    title=f"{fk['column']} → {fk['ref_column']}",
                    color="#2563eb",
                )

    return net


# --- Streamlit UI ---
st.set_page_config(page_title="Interactive SQL ERD", layout="wide")
st.title("📊 SQL Server Schema Visualizer (Interactive ERD)")

schema = load_schema("schema.json")

# Sidebar: Table selection
tables = list(schema.keys())
selected_table = st.sidebar.selectbox("Select a Table to View Details", tables)

if selected_table:
    details = schema[selected_table]
    st.subheader(f"📋 Table: {selected_table}")
    st.write(f"**Row Count:** {details.get('row_count', 'N/A')}")

    # Detailed Table View
    df_columns = pd.DataFrame(
        [
            {
                "Column": col,
                "Type": details["column_types"].get(col, ""),
                "Primary Key": "✅" if col in details["primary_keys"] else "",
                "Foreign Key": (
                    "🔗"
                    if any(
                        fk["column"] == col for fk in details.get("foreign_keys", [])
                    )
                    else ""
                ),
                "Nullable": "✔️" if details["nullable"].get(col, False) else "",
            }
            for col in details["columns"]
        ]
    )
    st.table(df_columns)

# Tables summary
st.subheader("📊 Tables Summary")
summary_df = pd.DataFrame(
    [
        {
            "Table": t,
            "Columns": len(d["columns"]),
            "Rows": d.get("row_count", 0),
            "Primary Keys": len(d.get("primary_keys", [])),
            "Foreign Keys": len(d.get("foreign_keys", [])),
        }
        for t, d in schema.items()
    ]
)
st.dataframe(summary_df)

# ERD Graph
st.subheader("🖼 Interactive Database ERD")
net = create_erd(schema)
net.save_graph("erd.html")
st.components.v1.html(open("erd.html", "r", encoding="utf-8").read(), height=800)

# Optional: Download JSON
st.download_button(
    "📥 Download Schema JSON",
    data=json.dumps(schema, indent=4),
    file_name="schema.json",
)
