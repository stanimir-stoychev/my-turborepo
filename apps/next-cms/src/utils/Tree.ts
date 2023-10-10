function thingToArrayOfThings<T>(thing: T | T[]): T[] {
    return Array.isArray(thing) ? thing : [thing];
}

export class TreeNode<Key = string, Value = Key> {
    constructor(
        public key: Key,
        public value: Value,
        public parent: TreeNode<Key, Value> | null = null,
        public children: TreeNode<Key, Value>[] = [],
    ) {}

    add(
        data: { key: Key; value: Value } | TreeNode<Key, Value> | ({ key: Key; value: Value } | TreeNode<Key, Value>)[],
    ) {
        const nodes: TreeNode<Key, Value>[] = thingToArrayOfThings(data).reduce(
            (acc, node) => {
                if (node === this) return acc;

                if (node instanceof TreeNode) {
                    node.parent = this;
                    return [...acc, node];
                }

                return [...acc, new TreeNode(node.key, node.value, this)];
            },
            [] as TreeNode<Key, Value>[],
        );

        this.children = [...this.children.filter((child) => !nodes.includes(child)), ...nodes];

        return nodes;
    }

    remove(key: Key | TreeNode<Key, Value> | (Key | TreeNode<Key, Value>)[]) {
        return thingToArrayOfThings(key).reduce(
            (acc, node) => {
                const index = this.children.findIndex((child) => child === node || child.key === node);
                if (index >= 0) {
                    const [removedNode] = this.children.splice(index, 1);
                    if (removedNode) {
                        acc.push(removedNode);
                        removedNode.parent = null;
                    }
                }

                return acc;
            },
            [] as TreeNode<Key, Value>[],
        );
    }

    replace(
        oldIdentifier: string | TreeNode<Key, Value>,
        newNodeData:
            | { key: Key; value: Value }
            | TreeNode<Key, Value>
            | ({ key: Key; value: Value } | TreeNode<Key, Value>)[],
    ) {
        const index = this.children.findIndex((child) => child === oldIdentifier || child.key === oldIdentifier);

        if (index < 0) return {};

        const newNodes: TreeNode<Key, Value>[] = thingToArrayOfThings(newNodeData).reduce(
            (acc, node) => {
                if (node === this) return acc;

                if (node instanceof TreeNode) {
                    node.parent = this;
                    return [...acc, node];
                }

                return [...acc, new TreeNode(node.key, node.value, this)];
            },
            [] as TreeNode<Key, Value>[],
        );

        const [oldNode] = this.children.splice(index, 1, ...newNodes);

        if (!oldNode) return {};

        oldNode.parent = null;

        return {
            new: newNodes,
            old: oldNode,
        };
    }

    get isLeaf() {
        return this.children.length < 1;
    }

    get clone() {
        return new TreeNode<Key, Value>(this.key, this.value, this.parent, this.children);
    }

    cloneWithOverwrites(key = this.key, value = this.value, parent = this.parent, children = this.children) {
        return new TreeNode(key, value, parent, children);
    }
}

type TraversalDirection = 'depth-first' | 'breadth-first' | 'pre-order' | 'post-order' | 'forward' | 'backward';

const isPreOrder = (direction: TraversalDirection = 'forward') =>
    ['pre-order', 'breadth-first', 'forward'].includes(direction);

export class Tree<Key = string, Value = Key> {
    public root: TreeNode<Key, Value>;

    constructor(root: TreeNode<Key, Value> | { key: Key; value: Value }) {
        if (root instanceof TreeNode) this.root = root;
        else this.root = new TreeNode<Key, Value>(root.key, root.value);
    }

    *preOrderTraversal(root = this.root): Generator<TreeNode<Key, Value>> {
        yield root;
        if (root.children.length) {
            for (const child of root.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    *postOrderTraversal(root = this.root): Generator<TreeNode<Key, Value>> {
        if (root.children.length) {
            for (const child of root.children) {
                yield* this.postOrderTraversal(child);
            }
        }
        yield root;
    }

    find(search: Key | TreeNode<Key, Value>, root = this.root): TreeNode<Key, Value> | null {
        if (root === search || root.key === search) return root;

        for (const child of root.children) {
            const node = this.find(search, child);
            if (node) return node;
        }

        return null;
    }

    /**
     * Adds data to the tree. If no key is specified, then the data will be added to the root.
     *
     * @param data Data that needs to be added.
     * @param parentSearch The key of the parent that should hold the new items.
     * @returns The added children and the parent node if successful.
     */
    add(
        data: { key: Key; value: Value } | TreeNode<Key, Value> | ({ key: Key; value: Value } | TreeNode<Key, Value>)[],
        parentSearch?: Key,
    ) {
        const node = parentSearch ? this.find(parentSearch) : this.root;

        if (!node) return {};

        const addedChildren = node.add(data);
        return { parent: node, addedChildren };
    }

    /**
     * Removes nodes from the tree.
     *
     * @param search Identifier or array of identifiers
     * @returns An array with all removed nodes
     */
    remove(search: Key | TreeNode<Key, Value> | (Key | TreeNode<Key, Value>)[]) {
        return thingToArrayOfThings(search).reduce(
            (acc, searchTerm) => {
                const foundNode = this.find(searchTerm);

                if (!foundNode || !foundNode.parent) return acc;

                foundNode.parent.remove(foundNode);

                return [...acc, foundNode];
            },
            [] as TreeNode<Key, Value>[],
        );
    }

    /**
     * Replaces a node with the given data. Note that open can be replaced by many!
     *
     * @param searchTerm An identifier for the node that should be replaced.
     * @param data The data that should be inserted in the found node's place. Accepts multiple!
     * @param root The root from which to start the search. The tree's root be default.
     * @returns The removed node and the inserted entries.
     */
    replace(
        searchTerm: Key | TreeNode<Key, Value>,
        data: { key: Key; value: Value } | TreeNode<Key, Value> | ({ key: Key; value: Value } | TreeNode<Key, Value>)[],
        root = this.root,
    ) {
        const oldNode = this.find(searchTerm, root);

        if (!oldNode || !oldNode.parent) return {};

        const { old: removed, new: inserted } = oldNode.parent.replace(
            oldNode,
            thingToArrayOfThings(data).map((thing) =>
                thing instanceof TreeNode ? thing : new TreeNode(thing.key, thing.value),
            ),
        );

        if (!removed || !inserted) return {};
        return { removed, inserted };
    }

    forEach(
        callback: (child: TreeNode<Key, Value>) => void,
        direction: TraversalDirection = 'pre-order',
        root = this.root,
    ) {
        const method = isPreOrder(direction) ? 'preOrderTraversal' : 'postOrderTraversal';
        for (const newNode of this[method](root)) {
            callback(newNode);
        }
    }

    map<R>(
        callback: (child: TreeNode<Key, Value>) => R,
        direction: TraversalDirection = 'pre-order',
        root = this.root,
    ) {
        const results: R[] = [];

        const method = isPreOrder(direction) ? 'preOrderTraversal' : 'postOrderTraversal';
        for (const newNode of this[method](root)) {
            results.push(callback(newNode));
        }

        return results;
    }
}
