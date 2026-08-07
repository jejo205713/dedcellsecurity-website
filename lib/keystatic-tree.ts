import { createHash } from 'node:crypto';
import type { FileChange } from './github-commit';

/**
 * Rebuilds the file-tree listing Keystatic's browser client expects back from
 * `POST /api/keystatic/update`.
 *
 * Why this exists: in local-storage mode Keystatic's client does not treat that
 * endpoint as "did it work?". It treats it as "give me the new tree":
 *
 *     const newTree = await res.json();
 *     const { tree } = await hydrateTreeCacheWithEntries(newTree);
 *     setTreeSha(await treeSha(tree));
 *
 * `hydrateTreeCacheWithEntries` calls `entries.map(...)` on that body. Returning
 * `{ success: true }` - the obvious-looking thing for a handler that commits to
 * GitHub instead of writing to disk - therefore throws `e.map is not a function`
 * in the editor *after* the commit has already landed. Saves and deletes looked
 * broken while silently succeeding.
 *
 * The stock handler answers with `readToDirEntries(baseDirectory)`, i.e. the
 * tree re-read from disk after the write. We cannot do that: the write went to
 * GitHub and the serverless filesystem still holds the pre-change content. So we
 * take the on-disk tree as the base and apply the same changes to it in memory.
 *
 * Shas are computed with git's own object hashing, matching
 * @keystatic/core's implementation byte for byte, so a subsequent save compares
 * the right blob shas and does not re-upload unchanged files.
 */

export type TreeEntry = {
  path: string;
  mode: '100644' | '040000';
  type: 'blob' | 'tree';
  sha: string;
};

type Node = { entry: TreeEntry; children?: Map<string, Node> };

function sha1(bytes: Buffer): string {
  return createHash('sha1').update(bytes).digest('hex');
}

/** `sha1("blob <byte-length>\0" + contents)` - a git blob object id. */
export function blobSha(contents: Buffer): string {
  return sha1(Buffer.concat([Buffer.from(`blob ${contents.length}\0`, 'utf8'), contents]));
}

/**
 * A git tree object id over one directory's immediate children.
 *
 * Two details are load-bearing and easy to get wrong:
 *   - directories sort as if their name ended in `/`, which is git's rule and
 *     changes the order of e.g. `blog` (a tree) against `blog.mdx` (a blob);
 *   - the mode is written without its leading zero (`40000`, not `040000`).
 */
function treeSha(children: Map<string, Node>): string {
  const entries = [...children].map(([name, node]) => ({
    name,
    sha: node.entry.sha,
    mode: node.entry.mode,
  }));

  entries.sort((a, b) => {
    const aName = a.mode === '040000' ? `${a.name}/` : a.name;
    const bName = b.mode === '040000' ? `${b.name}/` : b.name;
    return aName === bName ? 0 : aName < bName ? -1 : 1;
  });

  const payload = Buffer.concat(
    entries.flatMap((entry) => [
      Buffer.from(entry.mode.replace(/^0/, ''), 'utf8'),
      Buffer.from(' ', 'utf8'),
      Buffer.from(entry.name, 'utf8'),
      Buffer.from([0]),
      Buffer.from(entry.sha, 'hex'),
    ]),
  );

  return sha1(Buffer.concat([Buffer.from(`tree ${payload.length}\0`, 'utf8'), payload]));
}

/** Shape-check the base tree, which arrives as untyped JSON from Keystatic. */
export function isTreeEntryArray(value: unknown): value is TreeEntry[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as TreeEntry).path === 'string' &&
        typeof (entry as TreeEntry).sha === 'string',
    )
  );
}

/**
 * `base` with `changes` applied, as a fresh entry list.
 *
 * Only blob entries are carried across from `base`; every directory entry is
 * recomputed, because deleting the last file in a directory has to remove the
 * directory too, and adding one changes its parents' shas all the way up.
 *
 * Entries come out parent-before-child: Keystatic's `treeEntriesToTreeNodes`
 * looks up an entry's parent as it goes and silently drops anything whose parent
 * it has not seen yet.
 */
export function applyChangesToTree(base: TreeEntry[], changes: FileChange[]): TreeEntry[] {
  const blobs = new Map<string, string>();
  for (const entry of base) {
    if (entry.type !== 'tree') blobs.set(entry.path, entry.sha);
  }
  for (const change of changes) {
    if (change.type === 'delete') {
      blobs.delete(change.path);
    } else {
      blobs.set(change.path, blobSha(Buffer.from(change.contents, 'base64')));
    }
  }

  const root = new Map<string, Node>();
  for (const path of [...blobs.keys()].sort()) {
    const parts = path.split('/');
    let dir = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const name = parts[i];
      let children = dir.get(name)?.children;
      if (!children) {
        children = new Map<string, Node>();
        dir.set(name, {
          entry: {
            path: parts.slice(0, i + 1).join('/'),
            mode: '040000',
            type: 'tree',
            sha: '',
          },
          children,
        });
      }
      dir = children;
    }
    dir.set(parts[parts.length - 1], {
      entry: { path, mode: '100644', type: 'blob', sha: blobs.get(path)! },
    });
  }

  // Depth-first, so a directory's sha is only computed once its children have theirs.
  const fillShas = (level: Map<string, Node>): string => {
    for (const node of level.values()) {
      if (node.children) node.entry.sha = fillShas(node.children);
    }
    return treeSha(level);
  };
  fillShas(root);

  const out: TreeEntry[] = [];
  const flatten = (level: Map<string, Node>) => {
    for (const node of level.values()) {
      out.push(node.entry);
      if (node.children) flatten(node.children);
    }
  };
  flatten(root);
  return out;
}
