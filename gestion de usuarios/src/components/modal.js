// src/components/modal.js
// Ventana modal reutilizable para confirmaciones y formularios
export function showModal(contentHtml, onClose = null) {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }
  modalRoot.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" id="closeModalBtn">&times;</button>
        ${contentHtml}
      </div>
    </div>
  `;
  modalRoot.style.display = 'block';
  document.getElementById('closeModalBtn').onclick = () => {
    modalRoot.style.display = 'none';
    modalRoot.innerHTML = '';
    if (onClose) onClose();
  };
}

export function closeModal() {
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) {
    modalRoot.style.display = 'none';
    modalRoot.innerHTML = '';
  }
}
