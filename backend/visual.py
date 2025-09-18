import json
import networkx as nx
import matplotlib.pyplot as plt


def visualize_schema(schema_file="schema.json"):
    with open(schema_file, "r", encoding="utf-8") as f:
        schema = json.load(f)

    G = nx.DiGraph()

    # Add tables as nodes
    for table in schema:
        G.add_node(table)

    # Add foreign key relationships as edges
    for table, details in schema.items():
        for fk in details["foreign_keys"]:
            G.add_edge(
                table, fk["ref_table"], label=f"{fk['column']} → {fk['ref_column']}"
            )

    # Draw graph
    pos = nx.spring_layout(G, k=1.5)
    plt.figure(figsize=(10, 7))
    nx.draw(
        G,
        pos,
        with_labels=True,
        node_size=2500,
        node_color="lightblue",
        font_size=10,
        font_weight="bold",
    )
    edge_labels = nx.get_edge_attributes(G, "label")
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=8)
    plt.title("📊 Database Schema Visualizer", fontsize=14)
    plt.show()


if __name__ == "__main__":
    visualize_schema("schema.json")
