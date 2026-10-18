"""Network topology loader, graph validator, and routing utilities for JALRAKSHAK AI."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple
import networkx as nx

NETWORK_JSON_PATH = Path(__file__).resolve().parent / "data" / "network.json"

_cached_network_data: Optional[Dict[str, Any]] = None
_cached_graph: Optional[nx.DiGraph] = None


def load_network_data() -> Dict[str, Any]:
    """Load and validate the fixed 42-node network topology."""
    global _cached_network_data
    if _cached_network_data is not None:
        return _cached_network_data

    if not NETWORK_JSON_PATH.is_file():
        raise FileNotFoundError(f"Network topology file not found at {NETWORK_JSON_PATH}")

    with open(NETWORK_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Validation checks
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])
    sensors = data.get("sensors", [])
    zones = data.get("zones", [])
    reservoirs = data.get("reservoirs", [])

    if len(nodes) != 42:
        raise ValueError(f"Topology must have exactly 42 nodes, found {len(nodes)}")
    if len(sensors) != 8:
        raise ValueError(f"Topology must have exactly 8 sensors, found {len(sensors)}")
    if len(zones) != 8:
        raise ValueError(f"Topology must have exactly 8 zones, found {len(zones)}")
    if len(reservoirs) != 2:
        raise ValueError(f"Topology must have exactly 2 reservoirs, found {len(reservoirs)}")

    # Build and validate DiGraph
    G = nx.DiGraph()
    for n in nodes:
        G.add_node(n["id"], **n)
    for e in edges:
        G.add_edge(e["from"], e["to"], **e)

    # Confirm all nodes are reachable from at least one reservoir
    reachable_nodes = set()
    for r in reservoirs:
        reachable_nodes.add(r)
        reachable_nodes.update(nx.descendants(G, r))

    all_ids = set(n["id"] for n in nodes)
    unreachable = all_ids - reachable_nodes
    if unreachable:
        raise ValueError(f"Dangling unreachable nodes detected: {unreachable}")

    _cached_network_data = data
    return _cached_network_data


def get_network_graph() -> nx.DiGraph:
    """Return NetworkX DiGraph representation of the water network."""
    global _cached_graph
    if _cached_graph is not None:
        return _cached_graph

    data = load_network_data()
    G = nx.DiGraph()
    for n in data["nodes"]:
        G.add_node(n["id"], **n)
    for e in data["edges"]:
        G.add_edge(e["from"], e["to"], **e)

    _cached_graph = G
    return _cached_graph


def compute_path_delay_and_dilution(source: str, target: str) -> Optional[Tuple[int, float, List[str]]]:
    """Compute the cumulative delay and dilution factor along the primary downstream path.
    
    If multiple paths exist, selects the primary shortest-delay path.
    Returns (cumulative_delay_steps, cumulative_dilution, path_nodes) or None if target is unreachable.
    """
    if source == target:
        return 0, 1.0, [source]

    G = get_network_graph()
    if not nx.has_path(G, source, target):
        return None

    # Find shortest path by cumulative delay
    all_paths = list(nx.all_simple_paths(G, source, target, cutoff=12))
    if not all_paths:
        return None

    best_path = None
    min_delay = float("inf")
    best_dilution = 1.0

    for path in all_paths:
        delay = 0
        dilution = 1.0
        for i in range(len(path) - 1):
            edge_data = G[path[i]][path[i + 1]]
            delay += edge_data.get("delay_steps", 1)
            dilution *= edge_data.get("dilution", 0.85)

        if delay < min_delay:
            min_delay = delay
            best_path = path
            best_dilution = dilution

    return int(min_delay), round(best_dilution, 4), best_path or []


def get_downstream_nodes(source: str) -> Set[str]:
    """Return all downstream descendants of a node."""
    G = get_network_graph()
    if source not in G:
        return set()
    return set(nx.descendants(G, source)) | {source}


def get_affected_zones(candidate_node: str) -> List[str]:
    """Return list of supply zones downstream of a node."""
    desc = get_downstream_nodes(candidate_node)
    data = load_network_data()
    return [z for z in data["zones"] if z in desc]


def get_hop_distance(source: str, target: str) -> int:
    """Calculate shortest undirected hop distance between two nodes for error evaluation."""
    G = get_network_graph()
    U = G.to_undirected()
    try:
        return nx.shortest_path_length(U, source, target)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        return 99
