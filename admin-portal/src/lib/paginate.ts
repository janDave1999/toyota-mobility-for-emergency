/**
 * Lightweight client-side pagination helper.
 * Creates a self-contained paginator bound to a DOM container.
 */
export interface PaginatorState {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export function createPaginator(
  containerId: string,
  onPageChange: (page: number) => void,
) {
  let state: PaginatorState = { page: 1, totalPages: 1, total: 0, limit: 10 };

  function render() {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (state.totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    const start = (state.page - 1) * state.limit + 1;
    const end   = Math.min(state.page * state.limit, state.total);

    container.innerHTML = `
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span>Showing ${start}–${end} of ${state.total}</span>
        <div class="flex items-center gap-1">
          <button id="${containerId}-prev"
            class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            ${state.page <= 1 ? 'disabled' : ''}>
            ← Prev
          </button>
          <span class="px-3 py-1.5 text-gray-700 font-medium">
            ${state.page} / ${state.totalPages}
          </span>
          <button id="${containerId}-next"
            class="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            ${state.page >= state.totalPages ? 'disabled' : ''}>
            Next →
          </button>
        </div>
      </div>
    `;

    document.getElementById(`${containerId}-prev`)
      ?.addEventListener('click', () => onPageChange(state.page - 1));
    document.getElementById(`${containerId}-next`)
      ?.addEventListener('click', () => onPageChange(state.page + 1));
  }

  return {
    update(newState: Partial<PaginatorState>) {
      state = { ...state, ...newState };
      render();
    },
    get page() { return state.page; },
  };
}
