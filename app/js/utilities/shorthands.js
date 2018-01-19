// $('h1') or $('h1:last-child', node_context)
export const $  = (query, context = document) => context.querySelector(query)

// $$('h1') or $$('h1', node_context)
export const $$ = (query, context = document) => context.querySelectorAll(query)
