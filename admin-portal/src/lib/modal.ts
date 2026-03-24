export function openModal(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => Promise<void>,
) {
  const modal   = document.getElementById('confirm-modal')!;
  const backdrop = document.getElementById('modal-backdrop')!;
  const cancel  = document.getElementById('modal-cancel') as HTMLButtonElement;
  const confirm = document.getElementById('modal-confirm') as HTMLButtonElement;
  const spinner = document.getElementById('modal-spinner')!;
  const label   = document.getElementById('modal-confirm-label')!;

  document.getElementById('modal-title')!.textContent   = title;
  document.getElementById('modal-message')!.textContent = message;
  label.textContent = confirmLabel;
  modal.classList.remove('hidden');

  const ac = new AbortController();

  function setLoading(loading: boolean) {
    confirm.disabled = loading;
    cancel.disabled  = loading;
    spinner.classList.toggle('hidden', !loading);
  }

  function close() {
    modal.classList.add('hidden');
    ac.abort();
  }

  confirm.addEventListener('click', async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    close();
  }, { signal: ac.signal });

  cancel.addEventListener('click', close, { signal: ac.signal });
  backdrop.addEventListener('click', close, { signal: ac.signal });
}
