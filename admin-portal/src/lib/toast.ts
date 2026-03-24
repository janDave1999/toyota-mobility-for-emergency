let toastTimer: ReturnType<typeof setTimeout>;

export function showToast(message: string, type: 'success' | 'error') {
  const toast   = document.getElementById('toast')!;
  const msgEl   = document.getElementById('toast-message')!;
  const success = document.getElementById('toast-icon-success')!;
  const error   = document.getElementById('toast-icon-error')!;

  clearTimeout(toastTimer);

  msgEl.textContent = message;
  success.classList.toggle('hidden', type !== 'success');
  error.classList.toggle('hidden', type !== 'error');

  toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[260px] max-w-xs';
  if (type === 'success') {
    toast.classList.add('bg-green-50', 'border', 'border-green-200', 'text-green-800');
  } else {
    toast.classList.add('bg-red-50', 'border', 'border-red-200', 'text-red-800');
  }

  toastTimer = setTimeout(() => toast.classList.add('hidden'), 4000);
}
