export const ok = (res, data) => res.status(200).json(data);
export const created = (res, data) => res.status(201).json(data);
export const noContent = (res) => res.status(204).send();
export const badRequest = (res, msg) => res.status(400).json({ error: msg });
export const notFound = (res, msg) => res.status(404).json({ error: msg });
